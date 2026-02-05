'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRecipes } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    rating: '',
    prepareTime: '',
    orderBy: 'rating',
    order: 'desc'
  });
  const router = useRouter();
  const { user } = useAuth();


  const loadRecipes = useCallback(async (page = 1, appliedFilters = filters) => {
    setLoading(true);

    try {
      let data;
      data = await fetchRecipes(appliedFilters, 1);
      if (page === 1) {
        const estimatedTotal = data.total;
        data.data = Array.from(data.data || []).filter(recipe => recipe && recipe.id).slice(0, 25)
        setTotalPages(Math.ceil(estimatedTotal / 25));
      } else {
        data = await fetchRecipes(appliedFilters, page, 25);
      }
      setRecipes(Array.isArray(data) ? data : (data.data || []));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);


  const applyFilters = useCallback(() => {
    setFilterLoading(true);
    setRecipes([]);
    setCurrentPage(1);


    fetchRecipes(filters)
      .then(data => {
        setRecipes(data.data);
        setCurrentPage(1);
      })
      .catch(err => {
        console.error('Filter error (ignored):', err.message);
      })
      .finally(() => setFilterLoading(false));
  }, [filters]);


  useEffect(() => {
    loadRecipes(currentPage);
  }, [currentPage, fetchRecipes]);

  const navigateToRecipe = (recipe) => {
    sessionStorage.setItem('allRecipes', JSON.stringify(recipes));
    sessionStorage.setItem('currentPage', currentPage.toString());
    router.push(`/recipes/${recipe.id}`);
  };

  console.log(totalPages);
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 overflow-auto lg:overflow-hidden bg-[#FFD89C] p-3 w-full h-full">

      <aside className="w-full lg:w-80 backdrop-blur-sm rounded-lg p-4 lg:p-6 shadow-xl lg:sticky lg:top-6 lg:self-start lg:shrink-0 order-1">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-gray-800">Filters</h2>
        <div className="space-y-4">
          <div>
            <input
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => applyFilters(), 500);
              }}
              className="w-full p-2.5 lg:p-3 rounded border border-[#674636] outline-none transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Rating</label>
            <input
              type="range" min="0" max="5" step="0.5"
              value={filters.rating || 0}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value || '' }))}
              className="w-full h-1.5 lg:h-2 bg-gray-200 rounded-lg cursor-pointer accent-color-[#674636}"
            />
            <span className="text-xs text-gray-500">{filters.rating || 'Any'}</span>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Prep Time</label>
            <input
              type="range" min="5" max="120" step="5"
              value={filters.prepareTime || 120}
              onChange={(e) => setFilters(prev => ({ ...prev, prepareTime: e.target.value || '' }))}
              className="w-full h-1.5 lg:h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500"
            />
            <span className="text-xs text-gray-500">{filters.prepareTime || 'Any'} min</span>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Sort By</label>
            <select value={filters.orderBy} onChange={(e) => setFilters(prev => ({ ...prev, orderBy: e.target.value }))}
              className="w-full p-2.5 border border-[#674636] rounded focus:border-blue-500 outline-none text-sm">
              <option value="rating">Rating</option>
              <option value="prepareTime">Prep Time</option>
              <option value="popularity">Popularity</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Order</label>
            <select value={filters.order} onChange={(e) => setFilters(prev => ({ ...prev, order: e.target.value }))}
              className="w-full p-2.5 border border-[#674636] rounded focus:border-blue-500 outline-none text-sm">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button onClick={applyFilters} disabled={filterLoading}
            className="w-full p-3 bg-[#674636] hover:bg-[#A9907E] text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer">
            {filterLoading ? 'Applying...' : 'Apply Filters'}
          </button>

          <button onClick={() => {
            setFilters({ search: '', rating: '', prepareTime: '', orderBy: 'rating', order: 'desc' });
            applyFilters();
          }} className="w-full p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-all">
            Clear Filters
          </button>
        </div>
      </aside>

      <main className="flex-1 space-y-4 lg:space-y-8 order-2 lg:overflow-y-auto h-full relative">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-8 gap-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-4 bg-gradient-to-r from-[#FD8D14] to-[#df2e38] bg-clip-text text-transparent">All Recipes</h1>
          <span className="text-xs lg:text-sm text-gray-500">{recipes.length} recipes</span>
        </header>

        {recipes.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            No recipes found matching your filters. Try adjusting them.
          </div>
        ) : (
          <div className="flex justify-evenly flex-wrap gap-4">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} isAuth={!!user} onRecipeClick={() => navigateToRecipe(recipe)} />
            ))}
          </div>
        )}


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 p-6">
            <button
              onClick={() => loadRecipes(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => loadRecipes(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum
                      ? 'bg-[#674636] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => loadRecipes(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>

            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}


      </main>


    </div>
  );

}




