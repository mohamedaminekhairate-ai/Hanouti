<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Loss;

class LossController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Loss::with('product')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $loss = Loss::create($validated);

        return response()->json($loss->load('product'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Loss $loss)
    {
        return response()->json($loss->load('product'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Loss $loss)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|required|exists:products,id',
            'quantity' => 'sometimes|required|numeric|min:0.01',
            'reason' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
        ]);

        $loss->update($validated);

        return response()->json($loss->load('product'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Loss $loss)
    {
        $loss->delete();

        return response()->json(null, 204);
    }
}
