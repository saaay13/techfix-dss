<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::orderBy('nombre')->get());
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return response()->json([
            'message' => 'Categoría creada exitosamente.',
            'category' => $category,
        ], 201);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return response()->json([
            'message' => 'Categoría actualizada exitosamente.',
            'category' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->update(['activo' => false]);
        return response()->json([
            'message' => 'Categoría desactivada exitosamente.',
        ]);
    }
}
