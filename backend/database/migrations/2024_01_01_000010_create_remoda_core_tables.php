<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Addresses (RF-001, RF-005, RF-028, RF-040)
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->default('Principal');
            $table->string('address');
            $table->string('city')->default('Santa Cruz');
            $table->string('zone');
            $table->string('reference')->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        // Categories (RF-008, RF-010, RF-094)
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Branches / Stores (RF-031, RF-047, RF-111, RF-112)
        Schema::create('branches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city');
            $table->string('address');
            $table->string('phone');
            $table->string('schedule')->default('Lun - Sáb: 09:00 - 19:00');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Delivery Zones (RF-038, RF-039, RF-106, RF-107)
        Schema::create('delivery_zones', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city')->default('Santa Cruz');
            $table->decimal('base_cost', 8, 2)->default(15.00);
            $table->string('estimated_time')->default('24 a 48 horas');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Products (RF-008 to RF-017, RF-082, RF-085, RF-093, RF-095)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->integer('stock')->default(1);
            $table->string('size')->default('M'); // XS, S, M, L, XL, XXL, Talla única
            $table->string('color')->nullable();
            $table->string('material')->default('Denim'); // Denim, Algodón, Lana, Mezcla, Poliéster, etc.
            $table->string('transformation_type')->default('Reutilizado'); // Reutilizado, Innovado, Transformado
            $table->string('origin_story')->nullable(); // Ej: "Fabricada a partir de 2 jeans reutilizados"
            $table->string('badge')->nullable(); // Más vendido, Edición limitada, Nuevo, ¡Últimas!
            $table->decimal('rating', 3, 2)->default(5.00);
            $table->integer('reviews_count')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true);
            $table->boolean('is_qc_approved')->default(true);
            $table->timestamps();
        });

        // Product Images (RF-016)
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('image_url');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        // Coupons & Promotions (RF-096, RF-132, RF-133)
        Schema::create('coupons', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->integer('discount_percent')->nullable();
            $table->decimal('discount_fixed', 8, 2)->nullable();
            $table->decimal('min_order', 8, 2)->default(0);
            $table->integer('max_uses')->default(100);
            $table->integer('used_count')->default(0);
            $table->dateTime('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coupons');
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
        Schema::dropIfExists('delivery_zones');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('categories');
        Schema::dropIfExists('addresses');
    }
};
