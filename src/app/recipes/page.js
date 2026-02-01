'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchRecipes } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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


  // Debounced filter apply
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
        console.error('Filter error (ignored):', err.message); // SILENT FAIL
        // Don't reset recipes on filter fail - keep existing
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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-full max-w-7xl mx-auto p-4">
      {/* FILTERS - Full width mobile, sidebar desktop */}
      <aside className="lg:w-80 lg:sticky lg:top-6 lg:self-start bg-white/90 backdrop-blur-sm rounded-lg p-4 lg:p-6 shadow-xl border border-white/50 lg:shrink-0 order-1">
        <h2 className="text-lg lg:text-xl font-bold mb-4 lg:mb-6 text-gray-800">Filters</h2>
        {/* ALL YOUR FILTER CONTENT HERE - COPY FROM YOUR CURRENT FILE */}
        <div className="space-y-4">
          {/* Search input */}
          <div>
            <input
              placeholder="Search recipes..."
              value={filters.search}
              onChange={(e) => {
                setFilters(prev => ({ ...prev, search: e.target.value }));
                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => applyFilters(), 500);
              }}
              className="w-full p-2.5 lg:p-3 rounded border border-gray-300 focus:border-blue-500 outline-none transition-all text-sm"
            />
          </div>

          {/* Rating slider */}
          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Rating</label>
            <input
              type="range" min="0" max="5" step="0.5"
              value={filters.rating || 0}
              onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value || '' }))}
              className="w-full h-1.5 lg:h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500"
            />
            <span className="text-xs text-gray-500">{filters.rating || 'Any'}</span>
          </div>

          {/* Prep time slider */}
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

          {/* Sort selects */}
          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Sort By</label>
            <select value={filters.orderBy} onChange={(e) => setFilters(prev => ({ ...prev, orderBy: e.target.value }))}
              className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm">
              <option value="rating">Rating</option>
              <option value="prepareTime">Prep Time</option>
              <option value="popularity">Popularity</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label className="block text-xs lg:text-sm font-medium mb-1.5 text-gray-600">Order</label>
            <select value={filters.order} onChange={(e) => setFilters(prev => ({ ...prev, order: e.target.value }))}
              className="w-full p-2.5 border border-gray-300 rounded focus:border-blue-500 outline-none text-sm">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <button onClick={applyFilters} disabled={filterLoading}
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50">
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

      {/* RECIPES - Scrolls independently */}
      <main className="flex-1 lg:min-h-[70vh] space-y-4 lg:space-y-8 order-2 overflow-y-auto">
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 lg:mb-8 gap-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">All Recipes</h1>
          <span className="text-xs lg:text-sm text-gray-500">{recipes.length} recipes</span>
        </header>

        {/* Grid */}
        {recipes.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-500">
            No recipes found matching your filters. Try adjusting them.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} isAuth={!!user} onRecipeClick={() => navigateToRecipe(recipe)} />
            ))}
          </div>
        )}


        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 p-6">
            {/* Previous Button */}
            <button
              onClick={() => loadRecipes(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => loadRecipes(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${currentPage === pageNum
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            {/* Next Button */}
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

function RecipeCard({ recipe, isAuth, onRecipeClick }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const ingredientCount = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.length
    : (recipe.ingredients ? Object.keys(recipe.ingredients).length : 0);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuth) {
      alert('Please sign in to save favorites!');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      const newFavorites = favorites.filter(id => id !== recipe.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(recipe.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorited(!isFavorited);
  };



  return (
    <div
      className="group bg-white rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100 hover:border-blue-200 flex flex-col h-full"
      onClick={onRecipeClick}
    >
      {/* Image */}
      <div className="w-full h-40 md:h-48 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl mb-6 flex items-center justify-center text-sm text-gray-500 border-2 border-dashed border-blue-200 group-hover:border-blue-300 transition-colors">
        [IMAGE: {recipe.image}]
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 mb-6">
        <h3 className="font-bold text-lg md:text-xl line-clamp-2 leading-tight">{recipe.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{recipe.description}</p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-xl font-semibold">
            ⭐ {recipe.displayRating}
          </span>
          <span className="text-sm font-semibold text-gray-700">{recipe.prepareTime} min</span>
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs rounded-xl font-semibold">
            {ingredientCount} ingredients
          </span>
        </div>
      </div>

      {/* FAVORITE BUTTON - ml-auto pushes right */}
      <div className="flex items-center mt-auto pt-4">
        <button
          onClick={toggleFavorite}
          className="ml-auto p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all group-hover:scale-110 border border-gray-200 hover:border-blue-300 flex items-center justify-center w-14 h-14"
          title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className={`text-xl transition-all ${isFavorited
            ? 'text-red-500 scale-110 drop-shadow-lg'
            : 'text-gray-400 hover:text-red-400'
            }`}>
            {isFavorited ? '💖' : '🤍'}
          </span>
        </button>
      </div>
    </div>
  );
}


