<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CustomRequest;

class CustomRequestController extends Controller
{
    // RF-066 to RF-068: Customer creates transformation request
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'source_garment' => 'required|string',
            'target_transformation' => 'required|string', // Mochila, Bolso, Cartera, Accesorio, Prenda nueva
            'instructions' => 'required|string',
            'reference_image' => 'nullable|string',
        ]);

        $code = 'CUST-' . str_pad((CustomRequest::count() + 93), 5, '0', STR_PAD_LEFT);

        $customReq = CustomRequest::create(array_merge($validated, [
            'code' => $code,
            'status' => 'Solicitud',
        ]));

        return response()->json([
            'message' => '¡Solicitud de personalización enviada! Un artesano evaluará tu prenda.',
            'custom_request' => $customReq->load('user'),
        ], 201);
    }

    // RF-069: Customer / Admin / Producer list
    public function index(Request $request)
    {
        $query = CustomRequest::with(['user', 'assignedProducer']);

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('status') && $request->status !== 'Todos') {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('id', 'desc')->get();

        return response()->json(['custom_requests' => $requests]);
    }

    // RF-070: Quote price and update status
    public function updateStatus(Request $request, $id)
    {
        $req = CustomRequest::findOrFail($id);
        $validated = $request->validate([
            'status' => 'required|in:Solicitud,Evaluación,Aprobada,Producción,Terminada,Entrega,Rechazada',
            'quoted_price' => 'nullable|numeric|min:0',
            'assigned_producer_id' => 'nullable|exists:users,id',
        ]);

        $req->update($validated);

        return response()->json([
            'message' => 'Solicitud de personalización actualizada',
            'custom_request' => $req->load(['user', 'assignedProducer']),
        ]);
    }
}
