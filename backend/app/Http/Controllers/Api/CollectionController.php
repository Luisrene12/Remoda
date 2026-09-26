<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Collection;
use App\Models\User;
use App\Models\PointTransaction;

class CollectionController extends Controller
{
    // RF-054 to RF-056: Customer request clothing collection
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'garment_types' => 'required|string',
            'approx_quantity' => 'required|integer|min:1',
            'estimated_weight' => 'required|numeric|min:0.5',
            'address_id' => 'nullable|exists:addresses,id',
            'pickup_date' => 'required|date',
            'pickup_slot' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $code = 'REC-' . str_pad((Collection::count() + 47), 5, '0', STR_PAD_LEFT);

        $collection = Collection::create(array_merge($validated, [
            'code' => $code,
            'status' => 'Solicitada',
            'points_awarded' => 0,
        ]));

        return response()->json([
            'message' => '¡Solicitud de recolección registrada con éxito! Pasaremos en el horario acordado.',
            'collection' => $collection->load(['address', 'user']),
        ], 201);
    }

    // RF-059: Customer collections list
    public function userCollections($userId)
    {
        $collections = Collection::with(['address', 'assignedProducer'])
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json(['collections' => $collections]);
    }

    // RF-071, RF-101: Admin and Producer collections list
    public function index(Request $request)
    {
        $query = Collection::with(['user', 'address', 'assignedProducer']);

        if ($request->filled('status') && $request->status !== 'Todos') {
            $query->where('status', $request->status);
        }

        if ($request->filled('producer_id')) {
            $query->where('assigned_producer_id', $request->producer_id);
        }

        $collections = $query->orderBy('id', 'desc')->get();

        return response()->json(['collections' => $collections]);
    }

    // RF-102, RF-103: Admin assign and update collection
    public function assign(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        $validated = $request->validate([
            'assigned_producer_id' => 'required|exists:users,id',
            'pickup_date' => 'nullable|date',
            'pickup_slot' => 'nullable|string',
            'status' => 'nullable|string',
        ]);

        $collection->update(array_merge($validated, [
            'status' => $validated['status'] ?? 'Asignada',
        ]));

        return response()->json([
            'message' => 'Recolección asignada correctamente',
            'collection' => $collection->load(['user', 'address', 'assignedProducer']),
        ]);
    }

    // RF-071 to RF-075, RF-061: Producer Receives & Classifies Garments
    public function classify(Request $request, $id)
    {
        $collection = Collection::findOrFail($id);
        $validated = $request->validate([
            'actual_weight' => 'required|numeric|min:0.1',
            'actual_quantity' => 'required|integer|min:1',
            'classification_type' => 'required|string', // Reutilizable, Transformable, Reparación, Donación, Reciclaje, Desecho
            'material_type' => 'required|string', // Algodón, Denim, Poliéster, Lana, Mezcla, Otros
            'quality_grade' => 'required|string', // Excelente, Buena, Regular, Dañada
        ]);

        // Points rule: 50 points per kg of transformable/reusable clothing (RF-065, RN-012)
        $pointsEarned = (int) round($validated['actual_weight'] * 50);

        $collection->update(array_merge($validated, [
            'status' => 'Clasificada',
            'points_awarded' => $pointsEarned,
        ]));

        // Award points to user
        $user = $collection->user;
        $user->increment('points_balance', $pointsEarned);

        PointTransaction::create([
            'user_id' => $user->id,
            'points' => $pointsEarned,
            'type' => 'donacion',
            'description' => "Ropa recolectada y clasificada #{$collection->code} ({$validated['actual_weight']} kg)",
            'reference_type' => 'collection',
            'reference_id' => $collection->id,
        ]);

        return response()->json([
            'message' => 'Prendas clasificadas e ingresadas al lote de producción. Se han asignado los puntos al cliente.',
            'collection' => $collection->load(['user', 'address', 'assignedProducer']),
            'points_awarded' => $pointsEarned,
        ]);
    }
}
