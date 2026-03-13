<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Delivery;

class DeliveryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Delivery::with(['supplier', 'product'])->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'buy_price' => 'required|numeric|min:0',
            'date' => 'required|date',
            'status' => 'nullable|string|max:20',
        ]);

        $delivery = Delivery::create($validated);

        return response()->json($delivery->load(['supplier', 'product']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Delivery $delivery)
    {
        return response()->json($delivery->load(['supplier', 'product']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Delivery $delivery)
    {
        $validated = $request->validate([
            'supplier_id' => 'sometimes|required|exists:suppliers,id',
            'product_id' => 'sometimes|required|exists:products,id',
            'quantity' => 'sometimes|required|numeric|min:0.01',
            'buy_price' => 'sometimes|required|numeric|min:0',
            'date' => 'sometimes|required|date',
            'status' => 'nullable|string|max:20',
        ]);

        $delivery->update($validated);

        return response()->json($delivery->load(['supplier', 'product']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Delivery $delivery)
    {
        $delivery->delete();

        return response()->json(null, 204);
    }
}
