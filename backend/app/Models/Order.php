<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'delivery_type',
        'shipping_address_id',
        'recipient_name',
        'recipient_phone',
        'delivery_slot',
        'delivery_status',
        'delivery_driver',
        'delivery_incident_notes',
        'branch_id',
        'pickup_code',
        'ready_for_pickup_at',
        'picked_up_at',
        'subtotal',
        'shipping_cost',
        'discount_amount',
        'points_redeemed',
        'points_discount',
        'total',
        'payment_method',
        'payment_status',
        'payment_reference',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'points_discount' => 'decimal:2',
        'total' => 'decimal:2',
        'points_redeemed' => 'integer',
        'ready_for_pickup_at' => 'datetime',
        'picked_up_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
