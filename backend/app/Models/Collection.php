<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'user_id',
        'garment_types',
        'approx_quantity',
        'estimated_weight',
        'address_id',
        'pickup_date',
        'pickup_slot',
        'notes',
        'status',
        'assigned_producer_id',
        'actual_weight',
        'actual_quantity',
        'classification_type',
        'material_type',
        'quality_grade',
        'points_awarded',
    ];

    protected $casts = [
        'approx_quantity' => 'integer',
        'estimated_weight' => 'decimal:2',
        'actual_weight' => 'decimal:2',
        'actual_quantity' => 'integer',
        'points_awarded' => 'integer',
        'pickup_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function assignedProducer()
    {
        return $this->belongsTo(User::class, 'assigned_producer_id');
    }

    public function productionMaterials()
    {
        return $this->hasMany(ProductionMaterial::class);
    }
}
