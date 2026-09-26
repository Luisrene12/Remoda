<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\User;
use App\Models\PointTransaction;

class OrderController extends Controller
{
    // RF-026 to RF-037: Create Order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'delivery_type' => 'required|in:Envío a domicilio,Retiro en tienda',
            'shipping_address_id' => 'nullable|exists:addresses,id',
            'branch_id' => 'nullable|exists:branches,id',
            'recipient_name' => 'nullable|string',
            'recipient_phone' => 'nullable|string',
            'delivery_slot' => 'nullable|string',
            'coupon_code' => 'nullable|string',
            'points_to_redeem' => 'nullable|integer|min:0',
            'payment_method' => 'required|string',
            'payment_reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $user = User::findOrFail($validated['user_id']);
            $subtotal = 0;
            $orderItemsData = [];

            // 1. Verify stock and calculate subtotal (RN-002, RNF-021)
            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                
                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Stock insuficiente para el producto: {$product->name}. Disponibles: {$product->stock}"
                    ], 422);
                }

                $itemSubtotal = $product->price * $item['quantity'];
                $subtotal += $itemSubtotal;

                // Decrease stock
                $product->decrement('stock', $item['quantity']);

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'product_size' => $item['size'] ?? $product->size,
                    'product_color' => $item['color'] ?? $product->color,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $itemSubtotal,
                ];
            }

            // 2. Shipping cost (RF-039)
            $shippingCost = 0;
            if ($validated['delivery_type'] === 'Envío a domicilio') {
                $shippingCost = 15.00; // Base rate
            }

            // 3. Coupon discount (RF-132, RF-133)
            $discountAmount = 0;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])->first();
                if ($coupon && $coupon->isValidForAmount($subtotal)) {
                    $discountAmount = $coupon->calculateDiscount($subtotal);
                    $coupon->increment('used_count');
                }
            }

            // 4. Points redemption (RF-064)
            $pointsRedeemed = 0;
            $pointsDiscount = 0;
            if (!empty($validated['points_to_redeem']) && $validated['points_to_redeem'] > 0) {
                $availablePoints = min($user->points_balance, $validated['points_to_redeem']);
                if ($availablePoints > 0) {
                    $pointsRedeemed = $availablePoints;
                    $pointsDiscount = round($pointsRedeemed * 0.10, 2); // 10 puntos = 1 Bs
                    
                    // Deduct from user
                    $user->decrement('points_balance', $pointsRedeemed);
                    PointTransaction::create([
                        'user_id' => $user->id,
                        'points' => -$pointsRedeemed,
                        'type' => 'canje',
                        'description' => 'Descuento aplicado en nueva compra',
                    ]);
                }
            }

            // Calculate total
            $total = max(0, $subtotal + $shippingCost - $discountAmount - $pointsDiscount);

            // Generate order unique number (RF-032)
            $orderNumber = 'RM-' . str_pad((Order::count() + 153), 6, '0', STR_PAD_LEFT);
            $pickupCode = ($validated['delivery_type'] === 'Retiro en tienda') ? 'RM-' . rand(1000, 9999) : null;

            // Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'status' => 'Pendiente',
                'delivery_type' => $validated['delivery_type'],
                'shipping_address_id' => $validated['shipping_address_id'] ?? null,
                'branch_id' => $validated['branch_id'] ?? null,
                'recipient_name' => $validated['recipient_name'] ?? $user->name . ' ' . ($user->last_name ?? ''),
                'recipient_phone' => $validated['recipient_phone'] ?? $user->phone,
                'delivery_slot' => $validated['delivery_slot'] ?? '14:00 - 18:00',
                'pickup_code' => $pickupCode,
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount_amount' => $discountAmount,
                'points_redeemed' => $pointsRedeemed,
                'points_discount' => $pointsDiscount,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => ($validated['payment_method'] === 'Pago en tienda' || $validated['payment_method'] === 'Efectivo') ? 'Pendiente' : 'Confirmado',
                'payment_reference' => $validated['payment_reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create order items
            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Create payment record (RF-035)
            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $total,
                'status' => $order->payment_status,
                'operation_number' => $validated['payment_reference'] ?? 'OP-' . rand(100000, 999999),
                'paid_at' => ($order->payment_status === 'Confirmado') ? now() : null,
            ]);

            // Award points for purchase (RF-061)
            $earnedPoints = (int) floor($total * 0.10); // 10% of purchase in points
            if ($earnedPoints > 0) {
                $user->increment('points_balance', $earnedPoints);
                PointTransaction::create([
                    'user_id' => $user->id,
                    'points' => $earnedPoints,
                    'type' => 'compra',
                    'description' => "Puntos acumulados por compra #{$order->order_number}",
                    'reference_type' => 'order',
                    'reference_id' => $order->id,
                ]);
            }

            return response()->json([
                'message' => '¡Pedido realizado exitosamente!',
                'order' => $order->load(['items.product', 'shippingAddress', 'branch', 'payments']),
            ], 201);
        });
    }

    // RF-051: Customer Orders History
    public function userOrders($userId)
    {
        $orders = Order::with(['items.product', 'shippingAddress', 'branch', 'payments'])
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['orders' => $orders]);
    }

    // RF-052: Order Detail
    public function show($id)
    {
        $order = Order::with(['items.product', 'shippingAddress', 'branch', 'payments', 'user'])
            ->findOrFail($id);

        return response()->json(['order' => $order]);
    }

    // RF-097 to RF-100: Admin Orders List & Filter
    public function adminOrders(Request $request)
    {
        $query = Order::with(['items.product', 'shippingAddress', 'branch', 'payments', 'user']);

        if ($request->filled('status') && $request->status !== 'Todos') {
            $query->where('status', $request->status);
        }

        if ($request->filled('delivery_type') && $request->delivery_type !== 'Todos') {
            $query->where('delivery_type', $request->delivery_type);
        }

        $orders = $query->orderBy('id', 'desc')->get();

        return response()->json(['orders' => $orders]);
    }

    // RF-099, RF-043, RF-048, RF-050: Update Order Status
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:Pendiente,Confirmado,En preparación,Listo,En camino,Listo para retirar,Entregado,Retirado,Cancelado',
            'delivery_driver' => 'nullable|string',
            'delivery_incident_notes' => 'nullable|string',
            'payment_status' => 'nullable|in:Pendiente,Verificando,Confirmado,Rechazado',
        ]);

        $order->update($validated);

        if ($order->status === 'Listo para retirar' && !$order->ready_for_pickup_at) {
            $order->update(['ready_for_pickup_at' => now()]);
        }

        if (($order->status === 'Entregado' || $order->status === 'Retirado') && !$order->picked_up_at) {
            $order->update(['picked_up_at' => now()]);
        }

        return response()->json([
            'message' => 'Estado de pedido actualizado',
            'order' => $order->load(['items.product', 'shippingAddress', 'branch', 'payments', 'user']),
        ]);
    }
}
