'use client';
import { useRouter } from 'next/navigation';

export function useRecipeNavigation(recipes, currentPage = 1) {
  const router = useRouter();
  
  const navigateToRecipe = (recipe) => {
    sessionStorage.setItem('allRecipes', JSON.stringify(recipes));
    sessionStorage.setItem('currentPage', currentPage.toString());
    router.push(`/recipes/${recipe.id}`);
  };
  
  return { navigateToRecipe };
}
