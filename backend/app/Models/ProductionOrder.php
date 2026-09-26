<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'producer_id',
        'product_name',
        'category_id',
        'primary_material',
        'target_quantity',
        'produced_quantity',
        'scrap_weight',
        'status',
        'qc_status',
        'qc_notes',
        'material_notes',
        'finished_product_id',
    ];

    protected $casts = [
        'target_quantity' => 'integer',
        'produced_quantity' => 'integer',
        'scrap_weight' => 'decimal:2',
    ];

    public function producer()
    {
        return $this->belongsTo(User::class, 'producer_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function finishedProduct()
    {
        return $this->belongsTo(Product::class, 'finished_product_id');
    }

    public function materials()
    {
        return $this->hasMany(ProductionMaterial::class);
    }
}
