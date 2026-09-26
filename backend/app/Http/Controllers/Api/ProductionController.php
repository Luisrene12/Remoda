<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\ProductionOrder;
use App\Models\ProductionMaterial;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Collection;

class ProductionController extends Controller
{
    // RF-076 to RF-082: Production Orders List
    public function index(Request $request)
    {
        $query = ProductionOrder::with([
            'producer',
            'category',
            'finishedProduct',
            'materials.collection'
        ]);

        if ($request->filled('status') && $request->status !== 'Todos') {
            $query->where('status', $request->status);
        }

        if ($request->filled('producer_id')) {
            $query->where('producer_id', $request->producer_id);
        }

        $orders = $query->orderBy('id', 'desc')->get();

        return response()->json(['production_orders' => $orders]);
    }

    // RF-076, RF-077, RF-083: Create Production Order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'producer_id' => 'required|exists:users,id',
            'product_name' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'primary_material' => 'required|string',
            'target_quantity' => 'required|integer|min:1',
            'material_notes' => 'nullable|string',
            'collection_ids' => 'nullable|array',
            'collection_ids.*' => 'exists:collections,id',
        ]);

        $code = 'OP-' . str_pad((ProductionOrder::count() + 126), 6, '0', STR_PAD_LEFT);

        $po = ProductionOrder::create([
            'code' => $code,
            'producer_id' => $validated['producer_id'],
            'product_name' => $validated['product_name'],
            'category_id' => $validated['category_id'],
            'primary_material' => $validated['primary_material'],
            'target_quantity' => $validated['target_quantity'],
            'produced_quantity' => 0,
            'scrap_weight' => 0,
            'status' => 'Pendiente',
            'qc_status' => 'Pendiente',
            'material_notes' => $validated['material_notes'] ?? null,
        ]);

        if (!empty($validated['collection_ids'])) {
            foreach ($validated['collection_ids'] as $colId) {
                $col = Collection::find($colId);
                ProductionMaterial::create([
                    'production_order_id' => $po->id,
                    'collection_id' => $colId,
                    'material_description' => $col ? "Lote {$col->code} ({$col->material_type})" : "Prendas recicladas",
                    'weight_used' => $col ? $col->actual_weight : 1.0,
                ]);
            }
        }

        return response()->json([
            'message' => 'Orden de producción creada exitosamente',
            'production_order' => $po->load(['producer', 'category', 'materials.collection']),
        ], 201);
    }

    // RF-079, RF-080: Update production status and scrap
    public function updateProgress(Request $request, $id)
    {
        $po = ProductionOrder::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:Pendiente,En producción,Control de calidad,Terminado',
            'produced_quantity' => 'nullable|integer|min:0',
            'scrap_weight' => 'nullable|numeric|min:0',
        ]);

        $po->update($validated);

        return response()->json([
            'message' => 'Progreso de orden de producción actualizado',
            'production_order' => $po->load(['producer', 'category', 'materials.collection']),
        ]);
    }

    // RF-081, RF-082: Quality Control and Stock Entry (RN-007)
    public function completeAndStock(Request $request, $id)
    {
        $po = ProductionOrder::findOrFail($id);
        $validated = $request->validate([
            'qc_status' => 'required|in:Aprobado,Observado,Rechazado',
            'qc_notes' => 'nullable|string',
            'produced_quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:1',
            'origin_story' => 'nullable|string',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $po->update([
            'qc_status' => $validated['qc_status'],
            'qc_notes' => $validated['qc_notes'] ?? null,
            'produced_quantity' => $validated['produced_quantity'],
            'status' => 'Terminado',
        ]);

        // If approved by QC, auto-create or update catalog product (RF-082, RN-007)
        if ($validated['qc_status'] === 'Aprobado') {
            $slug = Str::slug($po->product_name) . '-' . rand(1000, 9999);
            
            $product = Product::create([
                'name' => $po->product_name,
                'slug' => $slug,
                'description' => "Pieza única elaborada artesanalmente bajo la orden {$po->code}. " . ($validated['qc_notes'] ?? ''),
                'category_id' => $po->category_id,
                'price' => $validated['price'],
                'stock' => $validated['produced_quantity'],
                'size' => $validated['size'] ?? 'Talla única',
                'color' => $validated['color'] ?? 'Variado',
                'material' => $po->primary_material,
                'transformation_type' => 'Innovado',
                'origin_story' => $validated['origin_story'] ?? "Confeccionado bajo la orden de producción {$po->code}",
                'badge' => 'Nuevo',
                'rating' => 5.00,
                'reviews_count' => 0,
                'is_featured' => false,
                'is_new' => true,
                'is_active' => true,
                'is_qc_approved' => true,
            ]);

            if (!empty($validated['image_url'])) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $validated['image_url'],
                    'is_primary' => true,
                ]);
            }

            $po->update(['finished_product_id' => $product->id]);
        }

        return response()->json([
            'message' => 'Control de calidad completado e ingresado al inventario de la tienda',
            'production_order' => $po->load(['producer', 'category', 'finishedProduct']),
        ]);
    }
}
