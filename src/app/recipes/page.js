'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchRecipes } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    prepareTime: '',
    ingredientsCount: '',
    orderBy: 'rating',
    order: 'desc'
  });
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const loadRecipes = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      const newPage = resetPage ? 1 : page;
      const data = await fetchRecipes({ ...filters, page: newPage });
      setRecipes(resetPage ? data : [...recipes, ...data]);
      if (resetPage) setPage(1);
      else setPage(p => p + 1);
    } catch (err) {
      console.error(err);
      alert('Failed to load recipes: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [filters, page, recipes]);

  useEffect(() => {
    loadRecipes(true);
  }, [loadRecipes]);

  const applyFilters = () => {
    loadRecipes(true); // Reset to page 1
  };

  if (loading && recipes.length === 0) {
    return <div className="text-center p-8 md:p-12 text-gray-600">Loading recipes...</div>;
  }

  return (
    <div className="w-full h-full space-y-6 md:space-y-8">
      {/* FILTERS */}
      <aside className="md:w-80 md:sticky md:top-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-xl border border-white/50 order-1 md:order-none">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">Filters</h2>
        <div className="space-y-4">
          <div>
            <input 
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              className="w-full p-2.5 md:p-3 rounded border border-gray-300 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-600">Rating</label>
            <input type="range" min="0" max="5" step="0.5" value={filters.rating || 0} 
                   onChange={(e) => setFilters({...filters, rating: e.target.value})}
                   className="w-full h-1.5 md:h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
            <span className="text-xs text-gray-500">{filters.rating || 0}</span>
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-600">Prep Time</label>
            <input type="range" min="5" max="120" step="5" value={filters.prepareTime || 120} 
                   onChange={(e) => setFilters({...filters, prepareTime: e.target.value})}
                   className="w-full h-1.5 md:h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
            <span className="text-xs text-gray-500">{filters.prepareTime || 120} min</span>
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-2 text-gray-600">Sort By</label>
            <select 
              value={filters.orderBy} 
              onChange={(e) => setFilters({...filters, orderBy: e.target.value})}
              className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
            >
              <option value="rating">Rating</option>
              <option value="prepareTime">Prep Time</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs md:text-sm font-medium mb-1.5 text-gray-600">Order</label>
            <select 
              value={filters.order} 
              onChange={(e) => setFilters({...filters, order: e.target.value})}
              className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          
          <button 
            onClick={applyFilters}
            className="w-full p-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-all shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </aside>
      
      {/* RECIPES */}
      <div className="flex-1 min-h-[60vh] space-y-4 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Recipes</h1>
          <span className="text-xs md:text-sm text-gray-500">{recipes.length} recipes</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} isAuth={!!user} />
          ))}
        </div>
        
        <div className="text-center py-8 md:py-12">
          <button 
            onClick={() => loadRecipes(false)}
            disabled={loading}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-emerald-500 text-white rounded-lg font-medium 
                      hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, isAuth }) {
  return (
    <div className="group bg-white rounded-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border hover:border-blue-200">
      <div className="w-full h-32 md:h-48 bg-gradient-to-br from-blue-50 to-emerald-50 rounded mb-3 md:mb-4 flex items-center justify-center text-xs md:text-sm text-gray-500 border-2 border-dashed border-blue-200">
        [IMAGE]
      </div>
      <h3 className="font-bold text-base md:text-xl mb-2 line-clamp-2">{recipe.title}</h3>
      <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">{recipe.description}</p>
      <div className="flex items-center justify-between mb-6">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-semibold">
          ⭐ {recipe.rating} ({recipe.popularity})
        </span>
        <span className="text-sm font-semibold text-gray-700">{recipe.prepareTime} min</span>
      </div>
      <button className="w-full p-2.5 md:p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2 border hover:border-blue-300">
        <span className="text-lg">❤️</span>
        {isAuth ? 'Add to Favorites' : 'Sign in to save'}
      </button>
    </div>
  );
}
