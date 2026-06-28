<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::where('activo', true)->orderBy('nombre')->get());
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }
}
