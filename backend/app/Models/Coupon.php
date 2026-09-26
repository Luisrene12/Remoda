<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'discount_percent',
        'discount_fixed',
        'min_order',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'discount_percent' => 'integer',
        'discount_fixed' => 'decimal:2',
        'min_order' => 'decimal:2',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function isValidForAmount($amount): bool
    {
        if (!$this->is_active) return false;
        if ($this->expires_at && $this->expires_at->isPast()) return false;
        if ($this->max_uses && $this->used_count >= $this->max_uses) return false;
        if ($this->min_order && $amount < $this->min_order) return false;
        return true;
    }

    public function calculateDiscount($amount): float
    {
        if ($this->discount_percent) {
            return round(($amount * $this->discount_percent) / 100, 2);
        }
        if ($this->discount_fixed) {
            return min((float)$this->discount_fixed, (float)$amount);
        }
        return 0;
    }
}
