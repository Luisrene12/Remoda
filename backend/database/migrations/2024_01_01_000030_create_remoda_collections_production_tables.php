<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Clothing Collections / Donations (RF-054 to RF-060, RF-071, RF-072, RF-101 to RF-105)
        Schema::create('collections', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Ej: REC-00045
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('garment_types'); // Ej: Jeans, Camisetas, Chaquetas
            $table->integer('approx_quantity')->default(1);
            $table->decimal('estimated_weight', 8, 2)->default(1.0); // in kg
            $table->foreignId('address_id')->nullable()->constrained('addresses')->nullOnDelete();
            $table->date('pickup_date');
            $table->string('pickup_slot'); // Mañana (09:00 - 12:00), Tarde (14:00 - 18:00)
            $table->text('notes')->nullable();
            
            // Workflow status: Solicitada → Confirmada → Asignada → En camino → Recolectada → Clasificada
            $table->enum('status', [
                'Solicitada',
                'Confirmada',
                'Asignada',
                'En camino',
                'Recolectada',
                'Clasificada',
                'Cancelada'
            ])->default('Solicitada');
            
            $table->foreignId('assigned_producer_id')->nullable()->constrained('users')->nullOnDelete();
            
            // Producer Classification data (RF-071 to RF-075)
            $table->decimal('actual_weight', 8, 2)->nullable();
            $table->integer('actual_quantity')->nullable();
            $table->string('classification_type')->nullable(); // Reutilizable, Transformable, Reparación, Donación, Reciclaje, Desecho
            $table->string('material_type')->nullable(); // Algodón, Denim, Poliéster, Lana, Mezcla, Otros
            $table->string('quality_grade')->nullable(); // Excelente, Buena, Regular, Dañada
            $table->integer('points_awarded')->default(0);
            $table->timestamps();
        });

        // Production Orders (RF-076 to RF-082, RF-083 to RF-085, RF-118)
        Schema::create('production_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Ej: OP-000125
            $table->foreignId('producer_id')->constrained('users')->onDelete('cascade');
            $table->string('product_name'); // Ej: Mochila Denim Revival
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('primary_material')->default('Denim');
            $table->integer('target_quantity')->default(1);
            $table->integer('produced_quantity')->default(0);
            $table->decimal('scrap_weight', 8, 2)->default(0); // Residuos / desperdicios en kg
            
            // Status: Pendiente → En producción → Control de calidad → Terminado
            $table->enum('status', ['Pendiente', 'En producción', 'Control de calidad', 'Terminado'])->default('Pendiente');
            $table->enum('qc_status', ['Pendiente', 'Aprobado', 'Observado', 'Rechazado'])->default('Pendiente');
            $table->text('qc_notes')->nullable();
            $table->text('material_notes')->nullable();
            
            // Link to finished product when entered to inventory (RF-082)
            $table->foreignId('finished_product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->timestamps();
        });

        // Production Materials / Traceability Link (RF-077, RF-083, RF-084)
        Schema::create('production_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('production_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('collection_id')->nullable()->constrained('collections')->nullOnDelete();
            $table->string('material_description'); // Ej: 2 Jeans recolectados lote REC-00045
            $table->decimal('weight_used', 8, 2)->default(0);
            $table->timestamps();
        });

        // Custom Product Transformation Requests (RF-066 to RF-070, RF-124)
        Schema::create('custom_requests', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Ej: CUST-0092
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('source_garment'); // Ej: Jean vintage Lee
            $table->string('target_transformation'); // Mochila, Bolso, Cartera, Accesorio, Prenda nueva
            $table->text('instructions');
            $table->string('reference_image')->nullable();
            
            // Status: Solicitud → Evaluación → Aprobada → Producción → Terminada → Entrega
            $table->enum('status', [
                'Solicitud',
                'Evaluación',
                'Aprobada',
                'Producción',
                'Terminada',
                'Entrega',
                'Rechazada'
            ])->default('Solicitud');
            
            $table->decimal('quoted_price', 8, 2)->nullable();
            $table->foreignId('assigned_producer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Points & Rewards Transactions (RF-061 to RF-065, RN-011)
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('points'); // +50 por donación, -100 por canje
            $table->string('type'); // donacion, compra, canje, campana, ajuste
            $table->string('description');
            $table->string('reference_type')->nullable(); // collection, order, custom
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->timestamps();
        });

        // Reviews & Ratings (RF-129 to RF-131)
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('rating'); // 1 a 5
            $table->text('comment');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
        });

        // Favorites (RF-023 to RF-025)
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->unique(['user_id', 'product_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('point_transactions');
        Schema::dropIfExists('custom_requests');
        Schema::dropIfExists('production_materials');
        Schema::dropIfExists('production_orders');
        Schema::dropIfExists('collections');
    }
};
