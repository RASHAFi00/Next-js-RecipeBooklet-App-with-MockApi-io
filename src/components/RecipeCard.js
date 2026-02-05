'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import FavoriteButton from '@/components/FavoriteButton';
import Image from 'next/image';

export default function RecipeCard({ recipe, isAuth, onRecipeClick }) {
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
      className="w-60 group bg-[#F1BA88] rounded-xl p-2 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:border-blue-200 flex flex-col h-full"
      onClick={onRecipeClick}
    >
      <div className="w-full h-40 md:h-48 bg-gradient-to-br from-[#FFE52A] to-[#FCB53B] rounded-xl mb-4 flex items-center justify-center text-sm text-gray-500 group-hover:border-blue-300 transition-colors">
        <img
          src={ (recipe.image.length<10)? "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/f33d5e96-f960-486f-94ac-cbabe3074ead/Derivates/0454bd7c-c1e3-4010-9a74-39aa130417ba.jpg" : recipe.image }
          alt="Card Img Preview"
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      <div className="flex-1 space-y-4 mb-4">
        <h3 className="font-bold text-lg md:text-xl line-clamp-2 leading-tight mb-2">{recipe.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{recipe.description}</p>

        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1.5 bg-[#FFD586] text-blue-700 text-xs rounded-xl font-semibold">
            ⭐ {recipe.displayRating}
          </span>
          <span className="text-sm font-semibold text-gray-700">{recipe.prepareTime} min</span>
          <span className="px-3 py-1.5 bg-[#FCB454] text-[#E52020] text-xs rounded-xl font-semibold">
            {ingredientCount} ingredients
          </span>
        </div>
      </div>

      <div className="flex items-center mt-auto ml-auto">
        <FavoriteButton recipeId={recipe.id}/>
      </div>
    </div>
  );
}