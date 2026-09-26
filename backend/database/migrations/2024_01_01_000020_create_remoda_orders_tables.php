<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Orders (RF-026 to RF-033, RF-038 to RF-050, RF-097 to RF-100)
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // ej: RM-000152
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', [
                'Pendiente',
                'Confirmado',
                'En preparación',
                'Listo',
                'En camino',
                'Listo para retirar',
                'Entregado',
                'Retirado',
                'Cancelado'
            ])->default('Pendiente');
            $table->enum('delivery_type', ['Envío a domicilio', 'Retiro en tienda'])->default('Envío a domicilio');
            
            // For delivery
            $table->foreignId('shipping_address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->string('recipient_name')->nullable();
            $table->string('recipient_phone')->nullable();
            $table->string('delivery_slot')->nullable(); // Ej: 14:00 - 18:00
            $table->string('delivery_status')->nullable(); // Preparando, Enviado, En camino, Entregado, Incidencia
            $table->string('delivery_driver')->nullable();
            $table->text('delivery_incident_notes')->nullable();
            
            // For store pickup
            $table->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete();
            $table->string('pickup_code')->nullable(); // Ej: RM-5821
            $table->timestamp('ready_for_pickup_at')->nullable();
            $table->timestamp('picked_up_at')->nullable();

            // Financials
            $table->decimal('subtotal', 8, 2);
            $table->decimal('shipping_cost', 8, 2)->default(0);
            $table->decimal('discount_amount', 8, 2)->default(0);
            $table->integer('points_redeemed')->default(0);
            $table->decimal('points_discount', 8, 2)->default(0);
            $table->decimal('total', 8, 2);

            // Payment info
            $table->string('payment_method')->default('QR'); // QR, Transferencia, Pago en tienda, Efectivo, Tarjeta
            $table->enum('payment_status', ['Pendiente', 'Verificando', 'Confirmado', 'Rechazado'])->default('Pendiente');
            $table->string('payment_reference')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Order Items (RF-018 to RF-022, RF-051, RF-052)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->string('product_name');
            $table->string('product_size')->nullable();
            $table->string('product_color')->nullable();
            $table->integer('quantity');
            $table->decimal('unit_price', 8, 2);
            $table->decimal('subtotal', 8, 2);
            $table->timestamps();
        });

        // Payments (RF-034 to RF-037)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('method');
            $table->decimal('amount', 8, 2);
            $table->enum('status', ['Pendiente', 'Verificando', 'Confirmado', 'Rechazado'])->default('Pendiente');
            $table->string('operation_number')->nullable();
            $table->string('receipt_url')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
