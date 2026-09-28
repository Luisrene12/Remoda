<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Category;
use App\Models\Review;
use App\Models\Favorite;

class ProductController extends Controller
{
    // RF-008 to RF-013: Catalog, Search, Filter, Sort
    public function index(Request $request)
    {
        // Build a unique cache key from all filter parameters
        $cacheKey = 'products:' . md5(json_encode($request->only(
            ['category', 'material', 'max_price', 'search', 'size', 'sort']
        )));

        $result = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Product::with(['category', 'images', 'primaryImage'])
                ->where('is_active', true);

            // Filter by category (RF-010, RF-012)
            if ($request->filled('category') && strtolower($request->category) !== 'todas') {
                $catParam = strtolower(trim($request->category));
                $query->where(function ($sq) use ($catParam) {
                    if (is_numeric($catParam)) {
                        $sq->where('category_id', intval($catParam));
                    }
                    $method = is_numeric($catParam) ? 'orWhereHas' : 'whereHas';
                    $sq->$method('category', function ($q) use ($catParam) {
                        $q->whereRaw('LOWER(slug) = ?', [$catParam])
                          ->orWhereRaw('LOWER(name) = ?', [$catParam])
                          ->orWhereRaw('LOWER(slug) LIKE ?', ["%{$catParam}%"])
                          ->orWhereRaw('LOWER(name) LIKE ?', ["%{$catParam}%"]);
                    });
                });
            }

            // Filter by material (RF-012)
            if ($request->filled('material') && strtolower($request->material) !== 'todos') {
                $matParam = strtolower(trim($request->material));
                $query->whereRaw('LOWER(material) = ?', [$matParam]);
            }

            // Filter by max price (RF-012)
            if ($request->filled('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Filter by search term (RF-011)
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('origin_story', 'like', "%{$search}%");
                });
            }

            // Filter by size (RF-012, RF-017)
            if ($request->filled('size')) {
                $query->where('size', $request->size);
            }

            // Sort (RF-013)
            $sort = $request->get('sort', 'recientes');
            switch ($sort) {
                case 'precio_menor': $query->orderBy('price', 'asc'); break;
                case 'precio_mayor': $query->orderBy('price', 'desc'); break;
                case 'mas_vendidos': $query->orderBy('rating', 'desc'); break;
                default: $query->orderBy('id', 'desc'); break;
            }

            $products = $query->get();
            return ['products' => $products, 'total' => $products->count()];
        });

        return response()->json($result)
            ->header('Cache-Control', 'public, max-age=60')
            ->header('X-Cache-Key', substr($cacheKey, 9, 8));
    }

    // RF-008: Home Sections — cached 2 min
    public function homeData()
    {
        $data = Cache::remember('home:data', 120, function () {
            $featured = Product::with(['category', 'images', 'primaryImage'])
                ->where('is_active', true)->where('is_featured', true)->take(6)->get();

            $newProducts = Product::with(['category', 'images', 'primaryImage'])
                ->where('is_active', true)->where('is_new', true)->take(6)->get();

            $categories = Category::where('is_active', true)->withCount('products')->get();

            return [
                'featured'     => $featured,
                'new_products' => $newProducts,
                'categories'   => $categories,
                'stats'        => [
                    'recollected_kg'    => '1.250kg',
                    'reused_kg'         => '850kg',
                    'created_products'  => '250+',
                    'donated_garments'  => '100',
                ],
            ];
        });

        return response()->json($data)
            ->header('Cache-Control', 'public, max-age=120');
    }

    // RF-014 to RF-017: Detail with Traceability & Reviews
    public function show($id)
    {
        $product = Product::with([
            'category',
            'images',
            'reviews.user',
            'productionOrder.materials.collection'
        ])->findOrFail($id);

        return response()->json(['product' => $product]);
    }

    // RF-093, RF-095: Admin Product CRUD
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
            'material' => 'nullable|string',
            'transformation_type' => 'nullable|string',
            'origin_story' => 'nullable|string',
            'badge' => 'nullable|string',
            'image_url' => 'nullable|string',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
        ]);

        $slug = Str::slug($validated['name']) . '-' . rand(100, 999);
        $product = Product::create(array_merge($validated, ['slug' => $slug, 'is_active' => true]));

        if (!empty($request->image_url)) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $request->image_url,
                'is_primary' => true,
            ]);
        }

        Cache::flush();

        return response()->json([
            'message' => 'Producto creado con éxito',
            'product' => $product->load(['category', 'images']),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id',
            'price' => 'sometimes|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'size' => 'nullable|string',
            'color' => 'nullable|string',
            'material' => 'nullable|string',
            'transformation_type' => 'nullable|string',
            'origin_story' => 'nullable|string',
            'badge' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'is_new' => 'nullable|boolean',
            'image_url' => 'nullable|string',
        ]);

        $product->update($validated);

        if (array_key_exists('image_url', $validated)) {
            $product->images()->update(['is_primary' => false]);
            if (!empty($validated['image_url'])) {
                $product->images()->updateOrCreate(
                    ['image_url' => $validated['image_url']],
                    ['is_primary' => true]
                );
            }
        }

        Cache::flush();

        return response()->json([
            'message' => 'Producto actualizado correctamente',
            'product' => $product->load(['category', 'images']),
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        Cache::flush();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }

    // RF-129, RF-130: Add Review
    public function addReview(Request $request, $productId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string',
        ]);

        $review = Review::create([
            'product_id' => $productId,
            'user_id' => $validated['user_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'is_approved' => true,
        ]);

        // Recalculate product rating
        $product = Product::find($productId);
        $avgRating = Review::where('product_id', $productId)->avg('rating');
        $reviewsCount = Review::where('product_id', $productId)->count();
        $product->update([
            'rating' => round($avgRating, 2),
            'reviews_count' => $reviewsCount,
        ]);

        return response()->json([
            'message' => 'Reseña enviada con éxito',
            'review' => $review->load('user'),
        ], 201);
    }

    // RF-023 to RF-025: Wishlist / Favorites
    public function toggleFavorite(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
        ]);

        $fav = Favorite::where('user_id', $request->user_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($fav) {
            $fav->delete();
            $favorited = false;
        } else {
            Favorite::create([
                'user_id' => $request->user_id,
                'product_id' => $request->product_id,
            ]);
            $favorited = true;
        }

        return response()->json([
            'favorited' => $favorited,
            'favorites' => Favorite::where('user_id', $request->user_id)->pluck('product_id'),
        ]);
    }

    // Category CRUD (RF-010, RF-094)
    public function categories()
    {
        $categories = Category::withCount('products')->orderBy('display_order')->orderBy('name', 'asc')->get();
        return response()->json(['categories' => $categories]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'display_order' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:20',
            'banner_image' => 'nullable|string',
            'season' => 'nullable|string|max:40',
            'material' => 'nullable|string|max:60',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        $slug = Str::slug($validated['name']);
        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'image' => $validated['image'] ?? 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
            'is_active' => true,
            'display_order' => $validated['display_order'] ?? 0,
            'color' => $validated['color'] ?? '#1E5128',
            'banner_image' => $validated['banner_image'] ?? null,
            'season' => $validated['season'] ?? null,
            'material' => $validated['material'] ?? null,
            'meta_title' => $validated['meta_title'] ?? null,
            'meta_description' => $validated['meta_description'] ?? null,
        ]);

        Cache::flush();

        return response()->json([
            'message' => 'Categoría creada con éxito',
            'category' => $category,
        ], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
            'color' => 'nullable|string|max:20',
            'banner_image' => 'nullable|string',
            'season' => 'nullable|string|max:40',
            'material' => 'nullable|string|max:60',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
        ]);

        if (!empty($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        $category->update($validated);
        Cache::flush();

        return response()->json([
            'message' => 'Categoría actualizada correctamente',
            'category' => $category,
        ]);
    }

    public function destroyCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        Cache::flush();
        return response()->json(['message' => 'Categoría eliminada']);
    }

    /**
     * Upload an image from file or base64 (e.g. pasted directly from clipboard)
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg,bmp,avif|max:20480',
            'image_base64' => 'nullable|string',
        ]);

        $destinationPath = public_path('uploads/products');
        if (!file_exists($destinationPath)) {
            @mkdir($destinationPath, 0777, true);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $fileName = 'prod_' . time() . '_' . Str::random(8) . '.' . strtolower($extension);
            $file->move($destinationPath, $fileName);
            $url = '/uploads/products/' . $fileName;

            return response()->json([
                'message' => 'Imagen subida exitosamente',
                'url' => $url,
            ]);
        }

        if (!empty($request->image_base64)) {
            $base64 = $request->image_base64;
            $type = 'jpg';
            if (preg_match('/^data:image\/([a-zA-Z0-9\+\-]+)/', $base64, $match)) {
                $rawType = strtolower($match[1]);
                if (str_contains($rawType, 'png')) $type = 'png';
                elseif (str_contains($rawType, 'webp')) $type = 'webp';
                elseif (str_contains($rawType, 'gif')) $type = 'gif';
                elseif (str_contains($rawType, 'svg')) $type = 'svg';
                else $type = 'jpg';
            }
            if (str_contains($base64, 'base64,')) {
                $base64 = explode('base64,', $base64)[1];
            }
            $data = base64_decode($base64);
            if ($data !== false) {
                $fileName = 'prod_' . time() . '_' . Str::random(8) . '.' . $type;
                file_put_contents($destinationPath . '/' . $fileName, $data);
                $url = '/uploads/products/' . $fileName;

                return response()->json([
                    'message' => 'Imagen pegada y subida exitosamente',
                    'url' => $url,
                ]);
            }
        }

        return response()->json(['message' => 'No se proporcionó una imagen válida'], 422);
    }
}
