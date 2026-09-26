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
            'user_id' => 'nullable',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable',
            'items.*.quantity' => 'required|integer|min:1',
            'delivery_type' => 'required|string',
            'shipping_address_id' => 'nullable',
            'branch_id' => 'nullable',
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
            // Find or fallback to first active user or guest
            $userId = $validated['user_id'] ?? null;
            $user = null;
            if ($userId) {
                $user = User::find($userId);
            }
            if (!$user) {
                $user = User::first() ?? User::create([
                    'name' => $validated['recipient_name'] ?? 'Cliente ReModa',
                    'email' => 'cliente_' . time() . '@remoda.bo',
                    'password' => bcrypt('remoda123'),
                    'role' => 'customer',
                    'status' => 'active',
                    'points_balance' => 100,
                ]);
            }

            $subtotal = 0;
            $orderItemsData = [];

            // 1. Process items and calculate subtotal
            foreach ($validated['items'] as $item) {
                $productId = $item['product_id'] ?? null;
                $product = $productId ? Product::find($productId) : null;
                $qty = (int) ($item['quantity'] ?? 1);
                
                $unitPrice = $product ? (float) $product->price : (float) ($item['price'] ?? $item['unit_price'] ?? 150);
                $productName = $product ? $product->name : ($item['name'] ?? $item['product_name'] ?? 'Prenda ReModa Upcycled');
                $size = $item['size'] ?? ($product ? $product->size : 'Talla única');
                $color = $item['color'] ?? ($product ? $product->color : 'Original');

                if ($product && $product->stock >= $qty) {
                    $product->decrement('stock', $qty);
                }

                $itemSubtotal = $unitPrice * $qty;
                $subtotal += $itemSubtotal;

                $orderItemsData[] = [
                    'product_id' => $product ? $product->id : null,
                    'product_name' => $productName,
                    'product_size' => $size,
                    'product_color' => $color,
                    'quantity' => $qty,
                    'unit_price' => $unitPrice,
                    'subtotal' => $itemSubtotal,
                ];
            }

            // 2. Shipping cost
            $shippingCost = 0;
            if ($validated['delivery_type'] === 'Envío a domicilio') {
                $shippingCost = 15.00;
            }

            // 3. Coupon discount
            $discountAmount = 0;
            if (!empty($validated['coupon_code'])) {
                $coupon = Coupon::where('code', $validated['coupon_code'])->first();
                if ($coupon && $coupon->isValidForAmount($subtotal)) {
                    $discountAmount = $coupon->calculateDiscount($subtotal);
                    $coupon->increment('used_count');
                }
            }

            // 4. Points redemption
            $pointsRedeemed = 0;
            $pointsDiscount = 0;
            if (!empty($validated['points_to_redeem']) && $validated['points_to_redeem'] > 0) {
                $availablePoints = min($user->points_balance ?? 0, (int) $validated['points_to_redeem']);
                if ($availablePoints > 0) {
                    $pointsRedeemed = $availablePoints;
                    $pointsDiscount = round($pointsRedeemed * 0.10, 2);
                    
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

            // Generate order unique number
            $orderNumber = 'RM-' . str_pad((Order::count() + 153), 6, '0', STR_PAD_LEFT);
            $pickupCode = ($validated['delivery_type'] === 'Retiro en tienda') ? 'RM-' . rand(1000, 9999) : null;

            // Clean foreign keys if they don't exist
            $branchId = !empty($validated['branch_id']) && is_numeric($validated['branch_id']) ? $validated['branch_id'] : null;
            $shippingAddressId = !empty($validated['shipping_address_id']) && is_numeric($validated['shipping_address_id']) ? $validated['shipping_address_id'] : null;

            // Create Order
            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $user->id,
                'status' => 'Pendiente',
                'delivery_type' => $validated['delivery_type'],
                'shipping_address_id' => $shippingAddressId,
                'branch_id' => $branchId,
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

            // Create payment record
            Payment::create([
                'order_id' => $order->id,
                'method' => $validated['payment_method'],
                'amount' => $total,
                'status' => $order->payment_status,
                'operation_number' => $validated['payment_reference'] ?? 'OP-' . rand(100000, 999999),
                'paid_at' => ($order->payment_status === 'Confirmado') ? now() : null,
            ]);

            // Award points for purchase
            $earnedPoints = (int) floor($total * 0.10);
            if ($earnedPoints > 0 && $user) {
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
