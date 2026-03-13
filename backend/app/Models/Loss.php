<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loss extends Model
{
    protected $fillable = ['product_id', 'quantity', 'reason', 'date'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
