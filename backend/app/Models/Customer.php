<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['name', 'phone', 'debt'];

    public function transactions()
    {
        return $this->hasMany(CustomerTransaction::class);
    }
}
