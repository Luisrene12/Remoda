<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionMaterial extends Model
{
    use HasFactory;

    protected $fillable = [
        'production_order_id',
        'collection_id',
        'material_description',
        'weight_used',
    ];

    protected $casts = [
        'weight_used' => 'decimal:2',
    ];

    public function productionOrder()
    {
        return $this->belongsTo(ProductionOrder::class);
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}
