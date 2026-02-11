'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function FavoriteButton({ recipeId}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { user } = useAuth();
  const isAuth = !!user

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favorites.includes(recipeId));
  }, [recipeId]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (!isAuth) {
      alert('Please sign in to save favorites!');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorited) {
      const newFavorites = favorites.filter(id => id !== recipeId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(recipeId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={"rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 w-12 h-12 grid place-content-center"}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className={`text-xl transition-all ${
        isFavorited
          ? 'text-red-500 scale-110 drop-shadow-lg'
          : 'text-gray-400 hover:text-red-400'
      }`}>
        <img src={isFavorited? "/media/img/favorite-true.svg" : "/media/img/favorite.svg"} className="w-6 h-6" />
      </span>
    </button>
  );
}
