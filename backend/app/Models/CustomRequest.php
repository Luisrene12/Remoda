<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'user_id',
        'source_garment',
        'target_transformation',
        'instructions',
        'reference_image',
        'status',
        'quoted_price',
        'assigned_producer_id',
    ];

    protected $casts = [
        'quoted_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function assignedProducer()
    {
        return $this->belongsTo(User::class, 'assigned_producer_id');
    }
}
