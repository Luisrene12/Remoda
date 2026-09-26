<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(0)->after('is_active');
            $table->string('color', 20)->nullable()->after('display_order');
            $table->string('banner_image')->nullable()->after('color');
            $table->string('season', 40)->nullable()->after('banner_image');
            $table->string('material', 60)->nullable()->after('season');
            $table->string('meta_title')->nullable()->after('material');
            $table->text('meta_description')->nullable()->after('meta_title');
        });
    }

    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn([
                'display_order',
                'color',
                'banner_image',
                'season',
                'material',
                'meta_title',
                'meta_description',
            ]);
        });
    }
};
