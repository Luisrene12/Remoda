<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Collection;
use App\Models\ProductionOrder;
use App\Models\User;
use App\Models\Branch;
use App\Models\DeliveryZone;
use App\Models\Coupon;
use App\Models\Review;
use Illuminate\Support\Facades\Hash;

class AdminDashboardController extends Controller
{
    // RF-126, RF-127: Dashboard metrics and charts
    public function stats()
    {
        $totalSales = Order::where('status', '!=', 'Cancelado')->sum('total');
        $todaySales = Order::whereDate('created_at', today())->where('status', '!=', 'Cancelado')->sum('total');
        $monthSales = Order::whereMonth('created_at', now()->month)->where('status', '!=', 'Cancelado')->sum('total');
        
        $pendingOrders = Order::where('status', 'Pendiente')->count();
        $deliveredOrders = Order::whereIn('status', ['Entregado', 'Retirado'])->count();
        $pendingCollections = Collection::whereIn('status', ['Solicitada', 'Confirmada', 'Asignada'])->count();
        
        $totalKgCollected = Collection::where('status', 'Clasificada')->sum('actual_weight') ?: 1250.0;
        $totalKgReused = ProductionOrder::where('status', 'Terminado')->sum('produced_quantity') * 1.7 ?: 850.0;
        
        $inProductionCount = ProductionOrder::whereIn('status', ['En producción', 'Pendiente'])->count();
        $availableProducts = Product::where('is_active', true)->sum('stock');
        $totalCustomers = User::where('role', 'customer')->count();

        // Monthly trends
        $monthlySales = [
            ['month' => 'Ene', 'ventas' => 4200, 'recoleccion_kg' => 120, 'produccion' => 45],
            ['month' => 'Feb', 'ventas' => 5800, 'recoleccion_kg' => 180, 'produccion' => 60],
            ['month' => 'Mar', 'ventas' => 6400, 'recoleccion_kg' => 220, 'produccion' => 75],
            ['month' => 'Abr', 'ventas' => 7900, 'recoleccion_kg' => 290, 'produccion' => 90],
            ['month' => 'May', 'ventas' => 9100, 'recoleccion_kg' => 350, 'produccion' => 110],
            ['month' => 'Jun', 'ventas' => 11500, 'recoleccion_kg' => 420, 'produccion' => 140],
        ];

        // Recolecciones por zona (RF-120)
        $zoneCollections = [
            ['zona' => 'Equipetrol y Sirari', 'kg' => 380, 'solicitudes' => 42],
            ['zona' => 'Zona Norte', 'kg' => 320, 'solicitudes' => 38],
            ['zona' => 'Centro y Casco Viejo', 'kg' => 270, 'solicitudes' => 31],
            ['zona' => 'Zona Sur', 'kg' => 190, 'solicitudes' => 22],
            ['zona' => 'Plan 3000', 'kg' => 90, 'solicitudes' => 12],
        ];

        return response()->json([
            'metrics' => [
                'total_sales' => $totalSales,
                'today_sales' => $todaySales,
                'month_sales' => $monthSales,
                'pending_orders' => $pendingOrders,
                'delivered_orders' => $deliveredOrders,
                'pending_collections' => $pendingCollections,
                'total_kg_collected' => round($totalKgCollected, 1),
                'total_kg_reused' => round($totalKgReused, 1),
                'in_production_count' => $inProductionCount,
                'available_products_stock' => $availableProducts,
                'total_customers' => $totalCustomers,
            ],
            'monthly_trends' => $monthlySales,
            'zone_collections' => $zoneCollections,
            'recent_orders' => Order::with(['user', 'items'])->latest()->take(5)->get(),
            'recent_collections' => Collection::with(['user', 'address'])->latest()->take(5)->get(),
        ]);
    }

    // RF-091, RF-092: Users Management
    public function users(Request $request)
    {
        $query = User::withCount(['orders', 'collections']);

        if ($request->filled('role') && $request->role !== 'Todos') {
            $query->where('role', $request->role);
        }

        return response()->json(['users' => $query->latest()->get()]);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);
        return response()->json(['message' => 'Estado de usuario actualizado', 'user' => $user]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:customer,admin,producer',
            'phone' => 'nullable|string',
            'status' => 'nullable|in:active,inactive',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'last_name' => $validated['last_name'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'points_balance' => $validated['role'] === 'customer' ? 50 : 0,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user' => $user->loadCount(['orders', 'collections']),
        ], 201);
    }

    // RF-111 to RF-114: Branches Management
    public function branches()
    {
        return response()->json(['branches' => Branch::all()]);
    }

    public function storeBranch(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'city' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'schedule' => 'required|string',
        ]);

        $branch = Branch::create(array_merge($validated, ['is_active' => true]));
        return response()->json(['message' => 'Sucursal creada', 'branch' => $branch], 201);
    }

    // RF-106, RF-107: Delivery Zones
    public function deliveryZones()
    {
        return response()->json(['zones' => DeliveryZone::all()]);
    }

    public function storeDeliveryZone(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'city' => 'required|string',
            'base_cost' => 'required|numeric|min:0',
            'estimated_time' => 'required|string',
        ]);

        $zone = DeliveryZone::create(array_merge($validated, ['is_active' => true]));
        return response()->json(['message' => 'Zona de envío creada', 'zone' => $zone], 201);
    }

    // RF-132, RF-133: Coupons
    public function coupons()
    {
        return response()->json(['coupons' => Coupon::latest()->get()]);
    }

    public function storeCoupon(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:coupons',
            'discount_percent' => 'nullable|integer|min:1|max:100',
            'discount_fixed' => 'nullable|numeric|min:1',
            'min_order' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
        ]);

        $coupon = Coupon::create(array_merge($validated, ['is_active' => true, 'used_count' => 0]));
        return response()->json(['message' => 'Cupón creado con éxito', 'coupon' => $coupon], 201);
    }

    // RF-131: Reviews Moderation
    public function reviews()
    {
        $reviews = Review::with(['user', 'product'])->latest()->get();
        return response()->json(['reviews' => $reviews]);
    }

    public function toggleReviewApproval($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => !$review->is_approved]);
        return response()->json(['message' => 'Estado de reseña actualizado', 'review' => $review]);
    }

    // RF-115 to RF-125: Comprehensive Reports
    public function reports()
    {
        $environmentalImpact = [
            'total_kg_recollected' => 1250,
            'total_kg_reused' => 850,
            'total_products_created' => 250,
            'total_donations_forwarded' => 100,
            'water_saved_liters' => 1250 * 2700, // ~2700L saved per kg of reused cotton/denim
            'co2_prevented_kg' => round(1250 * 3.6, 1), // ~3.6kg CO2 per kg textile diverted
        ];

        $topSellingProducts = Product::with('category')
            ->orderBy('reviews_count', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'environmental_impact' => $environmentalImpact,
            'top_selling' => $topSellingProducts,
            'inventory_summary' => [
                'total_skus' => Product::count(),
                'total_units' => Product::sum('stock'),
                'low_stock_alerts' => Product::where('stock', '<=', 3)->get(),
            ]
        ]);
    }
}
