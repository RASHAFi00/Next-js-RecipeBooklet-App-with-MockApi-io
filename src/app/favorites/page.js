'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RecipeCard from '@/components/RecipeCard'; // Adjust path if needed

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const RECIPES_PER_PAGE = 25;

  // Load favorites from localStorage + filter recipes
  const loadFavorites = useCallback(() => {
    setLoading(true);
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const allRecipes = JSON.parse(sessionStorage.getItem('allRecipes') || '[]');
      
      // Filter recipes that match favorite IDs
      const favoriteList = allRecipes.filter(recipe => 
        favorites.includes(recipe.id)
      );
      
      setFavoriteRecipes(favoriteList);
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      setFavoriteRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Client-side pagination for favorites
  const paginatedFavorites = favoriteRecipes.slice(
    (currentPage - 1) * RECIPES_PER_PAGE,
    currentPage * RECIPES_PER_PAGE
  );
  
  const totalPages = Math.ceil(favoriteRecipes.length / RECIPES_PER_PAGE);

  // Navigate to recipe detail
  const navigateToRecipe = (recipe) => {
    sessionStorage.setItem('allRecipes', JSON.stringify(favoriteRecipes));
    router.push(`/recipes/${recipe.id}`);
  };

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Your Favorites
          </h1>
          <p className="text-xl text-gray-600">
            {favoriteRecipes.length} recipes saved
          </p>
          {favoriteRecipes.length === 0 && (
            <p className="text-lg text-gray-500 mt-4">
              No favorites yet. Save some recipes from the{' '}
              <button 
                onClick={() => router.push('/recipes')}
                className="text-blue-500 hover:underline font-semibold"
              >
                Recipes page
              </button>
              !
            </p>
          )}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {paginatedFavorites.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isAuth={!!user}
              onRecipeClick={() => navigateToRecipe(recipe)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      currentPage === pageNum
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

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>

            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
