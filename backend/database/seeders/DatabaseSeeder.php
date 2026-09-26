<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Address;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Branch;
use App\Models\DeliveryZone;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Collection;
use App\Models\ProductionOrder;
use App\Models\ProductionMaterial;
use App\Models\PointTransaction;
use App\Models\Review;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Guard against duplicate execution
        if (User::where('email', 'admin@remoda.bo')->exists()) {
            return;
        }

        // 1. Users (RF-001, RF-006, RF-007)
        $admin = User::create([
            'name' => 'Administrador',
            'last_name' => 'ReModa',
            'email' => 'admin@remoda.bo',
            'phone' => '+591 71234567',
            'birth_date' => '1990-05-15',
            'role' => 'admin',
            'points_balance' => 0,
            'status' => 'active',
            'password' => Hash::make('admin123'),
        ]);

        $producer = User::create([
            'name' => 'Carlos',
            'last_name' => 'Mendoza',
            'email' => 'productor@remoda.bo',
            'phone' => '+591 76543210',
            'birth_date' => '1988-08-20',
            'role' => 'producer',
            'points_balance' => 0,
            'status' => 'active',
            'password' => Hash::make('productor123'),
        ]);

        $customer = User::create([
            'name' => 'Lucía',
            'last_name' => 'Vargas',
            'email' => 'cliente@remoda.bo',
            'phone' => '+591 77889900',
            'birth_date' => '1996-11-03',
            'role' => 'customer',
            'points_balance' => 350,
            'status' => 'active',
            'password' => Hash::make('cliente123'),
        ]);

        // 2. Addresses
        $addr1 = Address::create([
            'user_id' => $customer->id,
            'title' => 'Casa',
            'address' => 'Av. San Martín, Calle 7 Oeste #45',
            'city' => 'Santa Cruz',
            'zone' => 'Equipetrol',
            'reference' => 'Frente al café cultural, portón negro',
            'is_default' => true,
        ]);

        $addr2 = Address::create([
            'user_id' => $customer->id,
            'title' => 'Oficina',
            'address' => 'Av. Cristo Redentor 3er Anillo Interno',
            'city' => 'Santa Cruz',
            'zone' => 'Zona Norte',
            'reference' => 'Torre Duo piso 8 oficina 804',
            'is_default' => false,
        ]);

        // 3. Branches / Sucursales (RF-111, RF-112)
        $branch1 = Branch::create([
            'name' => 'Tienda ReModa Equipetrol',
            'city' => 'Santa Cruz',
            'address' => 'Av. San Martín esquina Calle 4 Este',
            'phone' => '+591 3 3456789',
            'schedule' => 'Lun - Sáb: 09:30 - 20:00',
            'is_active' => true,
        ]);

        $branch2 = Branch::create([
            'name' => 'Atelier ReModa Casco Viejo',
            'city' => 'Santa Cruz',
            'address' => 'Calle 24 de Septiembre #180',
            'phone' => '+591 3 3321456',
            'schedule' => 'Lun - Sáb: 09:00 - 19:30',
            'is_active' => true,
        ]);

        $branch3 = Branch::create([
            'name' => 'Espacio ReModa Sopocachi',
            'city' => 'La Paz',
            'address' => 'Av. 20 de Octubre #2150',
            'phone' => '+591 2 2445566',
            'schedule' => 'Lun - Vie: 10:00 - 19:00, Sáb: 10:00 - 16:00',
            'is_active' => true,
        ]);

        // 4. Delivery Zones (RF-038, RF-106, RF-107)
        DeliveryZone::create(['name' => 'Equipetrol y Sirari', 'city' => 'Santa Cruz', 'base_cost' => 12.00, 'estimated_time' => '12 a 24 horas']);
        DeliveryZone::create(['name' => 'Zona Norte (1er al 5to Anillo)', 'city' => 'Santa Cruz', 'base_cost' => 15.00, 'estimated_time' => '24 horas']);
        DeliveryZone::create(['name' => 'Centro y Casco Viejo', 'city' => 'Santa Cruz', 'base_cost' => 15.00, 'estimated_time' => '24 horas']);
        DeliveryZone::create(['name' => 'Zona Sur y Santos Dumont', 'city' => 'Santa Cruz', 'base_cost' => 18.00, 'estimated_time' => '24 a 48 horas']);
        DeliveryZone::create(['name' => 'Plan 3000 y Villa 1ro de Mayo', 'city' => 'Santa Cruz', 'base_cost' => 20.00, 'estimated_time' => '48 horas']);

        // 5. Coupons (RF-132, RF-133)
        Coupon::create([
            'code' => 'REMODA10',
            'discount_percent' => 10,
            'min_order' => 100.00,
            'max_uses' => 500,
            'used_count' => 18,
            'expires_at' => now()->addMonths(6),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'BIENVENIDA20',
            'discount_fixed' => 20.00,
            'min_order' => 120.00,
            'max_uses' => 200,
            'used_count' => 45,
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
        ]);

        // 6. Categories (RF-010)
        $catMochilas = Category::create([
            'name' => 'Mochilas',
            'slug' => 'mochilas',
            'description' => 'Mochilas urbanas e innovadas elaboradas a partir de denim y lonas recicladas.',
            'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        ]);

        $catCamisetas = Category::create([
            'name' => 'Camisetas',
            'slug' => 'camisetas',
            'description' => 'Prendas básicas de algodón orgánico rescatado con tintes y estampados sostenibles.',
            'image' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        ]);

        $catJeans = Category::create([
            'name' => 'Jeans',
            'slug' => 'jeans',
            'description' => 'Pantalones vaqueros rediseñados, intervenidos y adaptados a estilos contemporáneos.',
            'image' => 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80',
        ]);

        $catBolsos = Category::create([
            'name' => 'Bolsos',
            'slug' => 'bolsos',
            'description' => 'Bolsos tote y bandoleras confeccionadas con combinaciones de retazos textiles.',
            'image' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
        ]);

        $catChaquetas = Category::create([
            'name' => 'Chaquetas',
            'slug' => 'chaquetas',
            'description' => 'Chaquetas bomber y abrigos intervenidos mediante técnicas de patchwork.',
            'image' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
        ]);

        $catAccesorios = Category::create([
            'name' => 'Accesorios',
            'slug' => 'accesorios',
            'description' => 'Complementos únicos como sombreros, cinturones y collares upcycled.',
            'image' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        ]);

        $catVestidos = Category::create([
            'name' => 'Vestidos',
            'slug' => 'vestidos',
            'description' => 'Vestidos confeccionados a partir de cortes de denim y lino reciclado.',
            'image' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
        ]);

        $catCarteras = Category::create([
            'name' => 'Carteras',
            'slug' => 'carteras',
            'description' => 'Carteras de mano estructuradas con materiales textiles reforzados.',
            'image' => 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80',
        ]);

        // 7. Products (RF-008 to RF-017, matching design screenshots)
        $p1 = Product::create([
            'name' => 'Mochila Denim Revival',
            'slug' => 'mochila-denim-revival',
            'description' => 'Mochila urbana de alta resistencia con compartimento acolchado para laptop de hasta 15", forro interno impermeable y bolsillo frontal de acceso rápido. Confeccionada artesanalmente en nuestro atelier de Santa Cruz.',
            'category_id' => $catMochilas->id,
            'price' => 185.00,
            'original_price' => 240.00,
            'stock' => 8,
            'size' => 'Talla única',
            'color' => 'Azul Denim Oscuro',
            'material' => 'Denim',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Fabricada a partir de 2 jeans reutilizados',
            'badge' => 'Más vendido',
            'rating' => 4.80,
            'reviews_count' => 34,
            'is_featured' => true,
            'is_new' => false,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p1->id, 'image_url' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);
        ProductImage::create(['product_id' => $p1->id, 'image_url' => 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80', 'is_primary' => false]);

        $p2 = Product::create([
            'name' => 'Chaqueta Patchwork Bohème',
            'slug' => 'chaqueta-patchwork-boheme',
            'description' => 'Chaqueta ligera estilo bomber con cierre frontal metálico, puños elastizados y patrón geométrico de costura invisible. Cada unidad posee una combinación tonal irrepetible.',
            'category_id' => $catChaquetas->id,
            'price' => 320.00,
            'original_price' => null,
            'stock' => 4,
            'size' => 'M',
            'color' => 'Terracota / Ocre',
            'material' => 'Mezcla',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Ensamblada con retazos de 5 prendas distintas',
            'badge' => 'Edición limitada',
            'rating' => 4.90,
            'reviews_count' => 21,
            'is_featured' => true,
            'is_new' => false,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p2->id, 'image_url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p3 = Product::create([
            'name' => 'Bolso Cartera Terra',
            'slug' => 'bolso-cartera-terra',
            'description' => 'Bolso estructurado de mano con correa desmontable, broche magnético bañado en bronce antiguo y forro interior con divisor y tarjetero.',
            'category_id' => $catBolsos->id,
            'price' => 145.00,
            'original_price' => null,
            'stock' => 6,
            'size' => 'Talla única',
            'color' => 'Naranja Canela',
            'material' => 'Algodón',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Fabricado a partir de pantalones y camisas reutilizadas',
            'badge' => 'Nuevo',
            'rating' => 4.60,
            'reviews_count' => 48,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p3->id, 'image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p4 = Product::create([
            'name' => 'Camiseta Re-Basic Ecru',
            'slug' => 'camiseta-re-basic-ecru',
            'description' => 'Camiseta clásica de corte unisex elaborada con hilado regenerado 100% algodón. Suave al tacto y transpirable.',
            'category_id' => $catCamisetas->id,
            'price' => 85.00,
            'original_price' => 110.00,
            'stock' => 15,
            'size' => 'L',
            'color' => 'Blanco Hueso',
            'material' => 'Algodón',
            'transformation_type' => 'Reutilizado',
            'origin_story' => 'Recuperada y esterilizada con tintes botánicos',
            'badge' => 'Nuevo',
            'rating' => 4.70,
            'reviews_count' => 15,
            'is_featured' => false,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p4->id, 'image_url' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p5 = Product::create([
            'name' => 'Jean Upcycled Cargo Flare',
            'slug' => 'jean-upcycled-cargo-flare',
            'description' => 'Pantalón vaquero de tiro alto con corte acampanado y bolsillos cargo laterales adaptados de chamarras militares rescatadas.',
            'category_id' => $catJeans->id,
            'price' => 210.00,
            'original_price' => null,
            'stock' => 5,
            'size' => 'S',
            'color' => 'Azul Medio / Verde Oliva',
            'material' => 'Denim',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Confeccionado con 2 pantalones vaqueros vintage',
            'badge' => '¡Últimas!',
            'rating' => 4.85,
            'reviews_count' => 19,
            'is_featured' => false,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p5->id, 'image_url' => 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p6 = Product::create([
            'name' => 'Vestido Midi Denim Patch',
            'slug' => 'vestido-midi-denim-patch',
            'description' => 'Vestido casual sin mangas con escote cuadrado, falda en línea A y botonadura central confeccionado íntegramente con retazos de denim premium.',
            'category_id' => $catVestidos->id,
            'price' => 260.00,
            'original_price' => 310.00,
            'stock' => 3,
            'size' => 'M',
            'color' => 'Azul Índigo',
            'material' => 'Denim',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Creado a partir de 3 faldas vaqueras donadas',
            'badge' => 'Edición limitada',
            'rating' => 4.95,
            'reviews_count' => 12,
            'is_featured' => false,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p6->id, 'image_url' => 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p7 = Product::create([
            'name' => 'Gargantilla Re-Craft Minimal',
            'slug' => 'gargantilla-re-craft-minimal',
            'description' => 'Collar artesanal con colgante de piedra de río engarzada en alambre reciclado y cordoncillo trenzado a mano de orillo denim.',
            'category_id' => $catAccesorios->id,
            'price' => 55.00,
            'original_price' => null,
            'stock' => 12,
            'size' => 'Talla única',
            'color' => 'Plata / Índigo',
            'material' => 'Mezcla',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Hecho con herrajes reciclados y excedentes de taller',
            'badge' => 'Nuevo',
            'rating' => 4.90,
            'reviews_count' => 27,
            'is_featured' => false,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p7->id, 'image_url' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p8 = Product::create([
            'name' => 'Cartera Sobre Urban Canvas',
            'slug' => 'cartera-sobre-urban-canvas',
            'description' => 'Cartera estilo sobre para documentos y tablet, reforzada con forro de lona reciclada y cierre magnético discreto.',
            'category_id' => $catCarteras->id,
            'price' => 110.00,
            'original_price' => null,
            'stock' => 7,
            'size' => 'Talla única',
            'color' => 'Gris Marengo',
            'material' => 'Lana',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Elaborada a partir de abrigos de paño en desuso',
            'badge' => null,
            'rating' => 4.50,
            'reviews_count' => 9,
            'is_featured' => false,
            'is_new' => false,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p8->id, 'image_url' => 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p9 = Product::create([
            'name' => 'Chamarra Denim Trucker Re-Craft',
            'slug' => 'chamarra-denim-trucker-re-craft',
            'description' => 'Chamarra vaquera estilo trucker intervenida con apliques geométricos en espalda y bolsillos reforzados.',
            'category_id' => $catChaquetas->id,
            'price' => 295.00,
            'original_price' => 350.00,
            'stock' => 5,
            'size' => 'L',
            'color' => 'Azul Deslavado',
            'material' => 'Denim',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Rescatada de 2 chamarras vintage con acabados artesanales',
            'badge' => 'Tendencia',
            'rating' => 4.85,
            'reviews_count' => 14,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p9->id, 'image_url' => 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p10 = Product::create([
            'name' => 'Mochila Roll-Top Eco Canvas',
            'slug' => 'mochila-roll-top-eco-canvas',
            'description' => 'Mochila enrollable de gran capacidad confeccionada con lona militar recuperada y correas de algodón.',
            'category_id' => $catMochilas->id,
            'price' => 220.00,
            'original_price' => 270.00,
            'stock' => 6,
            'size' => 'Talla única',
            'color' => 'Verde Oliva / Mostaza',
            'material' => 'Algodón',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Hecha a partir de carpas de lona militar y excedentes textiles',
            'badge' => 'Sostenible',
            'rating' => 4.90,
            'reviews_count' => 19,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p10->id, 'image_url' => 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p11 = Product::create([
            'name' => 'Polera Gráfica Botanical Dye',
            'slug' => 'polera-grafica-botanical-dye',
            'description' => 'Polera de algodón recuperado teñida a mano con extractos de cáscara de cebolla y palta.',
            'category_id' => $catCamisetas->id,
            'price' => 95.00,
            'original_price' => null,
            'stock' => 11,
            'size' => 'M',
            'color' => 'Rosa Palo / Terracota',
            'material' => 'Algodón',
            'transformation_type' => 'Reutilizado',
            'origin_story' => 'Algodón 100% regenerado con tintes naturales',
            'badge' => 'Eco-Tinte',
            'rating' => 4.75,
            'reviews_count' => 11,
            'is_featured' => false,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p11->id, 'image_url' => 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p12 = Product::create([
            'name' => 'Pantalón Wide-Leg Denim Art',
            'slug' => 'pantalon-wide-leg-denim-art',
            'description' => 'Pantalón holgado de pierna ancha con paneles contrastantes de denim claro y oscuro.',
            'category_id' => $catJeans->id,
            'price' => 225.00,
            'original_price' => 260.00,
            'stock' => 4,
            'size' => 'L',
            'color' => 'Azul Dual Tone',
            'material' => 'Denim',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Combinación de dos jeans reciclados de tonalidades complementarias',
            'badge' => 'Exclusivo',
            'rating' => 4.88,
            'reviews_count' => 16,
            'is_featured' => true,
            'is_new' => false,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p12->id, 'image_url' => 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p13 = Product::create([
            'name' => 'Tote Bag Eco-Denim Maxi',
            'slug' => 'tote-bag-eco-denim-maxi',
            'description' => 'Bolso tote extra amplio con forro impermeable y bolsillos de parche frontales.',
            'category_id' => $catBolsos->id,
            'price' => 125.00,
            'original_price' => 150.00,
            'stock' => 9,
            'size' => 'Talla única',
            'color' => 'Azul Denim / Crudo',
            'material' => 'Denim',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Confeccionado con perneras de vaqueros donados',
            'badge' => 'Más vendido',
            'rating' => 4.80,
            'reviews_count' => 25,
            'is_featured' => false,
            'is_new' => false,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p13->id, 'image_url' => 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p14 = Product::create([
            'name' => 'Bucket Hat Denim Reversible',
            'slug' => 'bucket-hat-denim-reversible',
            'description' => 'Sombrero pescador de dos caras: un lado denim oscuro y el otro con estampado artesanal.',
            'category_id' => $catAccesorios->id,
            'price' => 75.00,
            'original_price' => null,
            'stock' => 15,
            'size' => 'Talla única',
            'color' => 'Índigo / Estampado',
            'material' => 'Mezcla',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Elaborado con recortes de telas sobrantes de corte',
            'badge' => 'Nuevo',
            'rating' => 4.92,
            'reviews_count' => 33,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p14->id, 'image_url' => 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p15 = Product::create([
            'name' => 'Vestido Camisero Upcycled Lino',
            'slug' => 'vestido-camisero-upcycled-lino',
            'description' => 'Vestido camisero fresco con lazo ajustable en cintura, botones de madera y detalle de bordado.',
            'category_id' => $catVestidos->id,
            'price' => 235.00,
            'original_price' => 280.00,
            'stock' => 4,
            'size' => 'S',
            'color' => 'Arena / Beige',
            'material' => 'Algodón',
            'transformation_type' => 'Innovado',
            'origin_story' => 'Creado a partir de 2 camisas de lino y algodón donadas',
            'badge' => 'Artesanal',
            'rating' => 4.88,
            'reviews_count' => 18,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p15->id, 'image_url' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        $p16 = Product::create([
            'name' => 'Mini Crossbody Cuero & Denim',
            'slug' => 'mini-crossbody-cuero-denim',
            'description' => 'Bolso bandolera compacto con cierre de cremallera metálica y correa ajustable.',
            'category_id' => $catCarteras->id,
            'price' => 160.00,
            'original_price' => 195.00,
            'stock' => 7,
            'size' => 'Talla única',
            'color' => 'Caramelo / Azul',
            'material' => 'Mezcla',
            'transformation_type' => 'Transformado',
            'origin_story' => 'Combinación de retazos de cuero curtido vegetal y denim recuperado',
            'badge' => 'Edición limitada',
            'rating' => 4.95,
            'reviews_count' => 29,
            'is_featured' => true,
            'is_new' => true,
            'is_active' => true,
            'is_qc_approved' => true,
        ]);
        ProductImage::create(['product_id' => $p16->id, 'image_url' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80', 'is_primary' => true]);

        // 8. Collections / Solicitudes de donación de ropa (RF-054 - RF-060)
        $col1 = Collection::create([
            'code' => 'REC-00045',
            'user_id' => $customer->id,
            'garment_types' => 'Jeans, Chaquetas y Camisas',
            'approx_quantity' => 6,
            'estimated_weight' => 3.50,
            'address_id' => $addr1->id,
            'pickup_date' => now()->subDays(5)->toDateString(),
            'pickup_slot' => 'Tarde (14:00 - 18:00)',
            'notes' => 'Ropa limpia en bolsa ecológica. Tocar timbre de planta baja.',
            'status' => 'Clasificada',
            'assigned_producer_id' => $producer->id,
            'actual_weight' => 3.80,
            'actual_quantity' => 6,
            'classification_type' => 'Transformable',
            'material_type' => 'Denim',
            'quality_grade' => 'Excelente',
            'points_awarded' => 190,
        ]);

        $col2 = Collection::create([
            'code' => 'REC-00046',
            'user_id' => $customer->id,
            'garment_types' => 'Poleras de algodón y vestidos',
            'approx_quantity' => 4,
            'estimated_weight' => 2.00,
            'address_id' => $addr1->id,
            'pickup_date' => now()->addDays(2)->toDateString(),
            'pickup_slot' => 'Mañana (09:00 - 12:00)',
            'notes' => 'Prendas sin roturas, listas para segundo ciclo.',
            'status' => 'Confirmada',
            'assigned_producer_id' => $producer->id,
            'points_awarded' => 0,
        ]);

        // 9. Production Order & Traceability (RF-076 - RF-085)
        $po1 = ProductionOrder::create([
            'code' => 'OP-000125',
            'producer_id' => $producer->id,
            'product_name' => 'Mochila Denim Revival',
            'category_id' => $catMochilas->id,
            'primary_material' => 'Denim',
            'target_quantity' => 5,
            'produced_quantity' => 5,
            'scrap_weight' => 0.40,
            'status' => 'Terminado',
            'qc_status' => 'Aprobado',
            'qc_notes' => 'Costuras reforzadas, cierres probados y aprobados para catálogo.',
            'material_notes' => 'Se utilizaron jeans de peso medio 12oz del lote REC-00045.',
            'finished_product_id' => $p1->id,
        ]);

        ProductionMaterial::create([
            'production_order_id' => $po1->id,
            'collection_id' => $col1->id,
            'material_description' => 'Jeans recolectados lote REC-00045',
            'weight_used' => 3.00,
        ]);

        // 10. Sample Customer Order (RF-026 - RF-037)
        $order1 = Order::create([
            'order_number' => 'RM-000152',
            'user_id' => $customer->id,
            'status' => 'En camino',
            'delivery_type' => 'Envío a domicilio',
            'shipping_address_id' => $addr1->id,
            'recipient_name' => 'Lucía Vargas',
            'recipient_phone' => '+591 77889900',
            'delivery_slot' => '14:00 - 18:00',
            'delivery_status' => 'En camino',
            'delivery_driver' => 'Marcos Morales (Eco-Delivery)',
            'subtotal' => 330.00,
            'shipping_cost' => 12.00,
            'discount_amount' => 33.00,
            'points_redeemed' => 100,
            'points_discount' => 10.00,
            'total' => 299.00,
            'payment_method' => 'QR',
            'payment_status' => 'Confirmado',
            'payment_reference' => 'BNB-QR-98432174',
            'notes' => 'Por favor llamar al llegar.',
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $p1->id,
            'product_name' => 'Mochila Denim Revival',
            'product_size' => 'Talla única',
            'product_color' => 'Azul Denim Oscuro',
            'quantity' => 1,
            'unit_price' => 185.00,
            'subtotal' => 185.00,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => $p3->id,
            'product_name' => 'Bolso Cartera Terra',
            'product_size' => 'Talla única',
            'product_color' => 'Naranja Canela',
            'quantity' => 1,
            'unit_price' => 145.00,
            'subtotal' => 145.00,
        ]);

        Payment::create([
            'order_id' => $order1->id,
            'method' => 'QR',
            'amount' => 299.00,
            'status' => 'Confirmado',
            'operation_number' => 'BNB-QR-98432174',
            'paid_at' => now()->subDay(),
        ]);

        // 11. Point Transactions (RF-061 - RF-065)
        PointTransaction::create([
            'user_id' => $customer->id,
            'points' => 190,
            'type' => 'donacion',
            'description' => 'Recolección entregada y clasificada #REC-00045 (3.8 kg)',
            'reference_type' => 'collection',
            'reference_id' => $col1->id,
        ]);

        PointTransaction::create([
            'user_id' => $customer->id,
            'points' => 30,
            'type' => 'compra',
            'description' => 'Puntos acumulados por compra #RM-000152',
            'reference_type' => 'order',
            'reference_id' => $order1->id,
        ]);

        PointTransaction::create([
            'user_id' => $customer->id,
            'points' => -100,
            'type' => 'canje',
            'description' => 'Descuento canjeado en pedido #RM-000152',
            'reference_type' => 'order',
            'reference_id' => $order1->id,
        ]);

        // 12. Reviews (RF-129, RF-130)
        Review::create([
            'product_id' => $p1->id,
            'user_id' => $customer->id,
            'rating' => 5,
            'comment' => 'Increíble calidad en las costuras y los detalles del denim reciclado. Me encanta saber que antes eran jeans reales.',
            'is_approved' => true,
        ]);
    }
}
