'use client';

import { useState, useEffect } from 'react';
import { fetchRecipes } from '@/lib/api';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // useEffect: Runs when component mounts OR dependencies change
  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        const data = await fetchRecipes(page);
        if (page === 1) {
          setRecipes(data); // Replace for page 1
        } else {
          setRecipes(prev => [...prev, ...data]); // Append for pagination
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadRecipes();
  }, [page]); // Re-run when 'page' changes

  if (error) return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  if (loading && recipes.length === 0) return <div className="text-center p-8">Loading recipes...</div>;

  return (
    <div className="flex gap-8 max-w-7xl h-full">
      {/* FILTER ASIDE */}
      <aside className="w-80 bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-xl sticky top-6 h-fit border border-white/50">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Filters</h2>
        <div className="space-y-4">
          <input 
            placeholder="Search by name..." 
            className="w-full p-3 rounded border border-gray-300 focus:border-blue-500 outline-none transition-all"
          />
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Rating</label>
            <input type="range" min="0" max="5" step="0.5" defaultValue="0" 
                   className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">Prep Time</label>
            <input type="range" min="5" max="120" step="5" defaultValue="120" 
                   className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
          </div>
        </div>
      </aside>
      
      {/* RECIPES GRID */}
      <div className="flex-1 min-h-[60vh]">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Recipes</h1>
          <span className="text-sm text-gray-500">{recipes.length} recipes loaded</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <div className="text-center mt-12">
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Loading...' : 'Load More Recipes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe }) {
  return (
    <div className="group bg-white rounded-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-transparent hover:border-blue-200 overflow-hidden">
      <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-emerald-50 
                     rounded-lg mb-4 overflow-hidden flex items-center justify-center 
                     text-sm text-gray-500 border-2 border-dashed border-blue-200 group-hover:border-blue-300">
        [IMAGE: {recipe.image}]
      </div>
      <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 leading-tight">
        {recipe.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
        {recipe.description}
      </p>
      <div className="flex items-center justify-between mb-6">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
          ⭐ {recipe.rating} ({recipe.popularity})
        </span>
        <span className="text-sm font-semibold text-gray-700">{recipe.prepareTime} min</span>
      </div>
      <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium 
                        transition-all group-hover:scale-[1.02] border border-blue-200 hover:border-blue-300 flex items-center justify-center gap-2">
        <span className="text-xl">❤️</span>
        Add to Favorites
      </button>
    </div>
  );
}
