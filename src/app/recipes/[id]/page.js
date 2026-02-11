'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import FavoriteButton from '@/components/FavoriteButton';

export default function RecipeDetail({ recipes = [] }) {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [cooking, setCooking] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const storedRecipes = sessionStorage.getItem('allRecipes');
    if (storedRecipes) {
      try {
        const allRecipes = JSON.parse(storedRecipes);
        const currentRecipe = allRecipes.find(r => r.id === params.id);
        if (currentRecipe) {
          setRecipe(currentRecipe);
          return;
        }
      } catch (e) {
        console.log('Stored recipes invalid, falling back to API');
      }
    }

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/recipes/${params.id}`);
        if (response.ok) {
          const recipeData = await response.json();
          setRecipe(recipeData);
        }
      } catch (error) {
        console.error('API fetch failed:', error);
      }
    };

    fetchRecipe();
  }, [params.id]);



  const handleCook = async () => {
    if (cooking) return;
    setCooking(true);

    try {
      const response = await fetch(`https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/recipes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...recipe, popularity: (recipe.popularity || 0) + 1 })
      });

      if (response.ok) {
        setRecipe({ ...recipe, popularity: (recipe.popularity || 0) + 1 });
      }
    } catch (error) {
      console.error('Failed to update popularity:', error);
    } finally {
      setCooking(false);
    }
  };

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h1>
        <button
          onClick={() => router.push('/recipes')}
          className="cursor-pointer px-6 py-2 bg-[#FD8D14] text-white rounded-xl hover:bg-[#C51605] transition-all"
        >
          Back to recipes
        </button>
      </div>
    );
  }

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ingredient, index) => ({
      name: ingredient.name || ingredient,
      amount: ingredient.amount || ''
    }))
    : (recipe.ingredients ? Object.entries(recipe.ingredients).map(([key, value]) => ({
      name: key,
      amount: value
    })) : []);

  const steps = recipe.steps ? Object.values(recipe.steps).map((step, index) => ({
    number: step.number || (index + 1),
    stepTitle: Object.keys(step)[0] || step.title,
    stepDescription: step[Object.keys(step)[0]] || step.description
  })) : [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:px-8 space-y-10">
      <div className="bg-[#FFD89C] backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-10 border border-white/50">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
          <div className="flex-shrink-0 w-full lg:w-80 h-52 lg:h-64 flex items-center justify-center border-blue-200">
            <img src={recipe.image || "/placeholder.svg"} className="block rounded-lg" />
          </div>
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{recipe.title}</h1>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-[#FCB454] text-blue-700 text-sm rounded-xl font-semibold">⭐ {recipe.displayRating}</span>
              <span className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm rounded-xl font-semibold flex items-center gap-1">
                {recipe.popularity || 0} cooked
              </span>
              <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-xl font-semibold">{recipe.prepareTime} min</span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">{recipe.description}</p>
            <button
              onClick={handleCook}
              disabled={cooking}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#df2e38] hover:bg-[#FD8D14] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              <span> <img src="/media/img/tray-meal-svgrepo-com.svg" className="block w-10 h-10" /> </span>
              I Cooked This! (+1)
              {cooking && <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin ml-1" />}
            </button>

            <div className="flex fle-wrap gap-2 lg:gap-4 items-center justify-center">
              <button
                onClick={() => {
                  router.push(`/recipes`);
                }}
                className="cursor-pointer px-8 py-3 bg-[#FD8D14] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Back to All Recipes
              </button>

                <FavoriteButton recipeId={recipe.id} />
            </div>

          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className=" w-15 h-15 bg-[#FFD89C] text-white rounded-full flex items-center justify-center text-xl font-bold"> <img src="/media/img/recipe-svgrepo-com(2).svg" className="w-10 h-10" /> </span>
          Ingredients ({ingredients.length})
        </h2>
        <div className="flex flex-col gap-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center gap-4 p-5 bg-[#FFD9B7] backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-white/50 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 bg-[#FFB100] text-white rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg text-gray-900">{ingredient.name}</div>
                {ingredient.amount && <div className="text-gray-600">{ingredient.amount}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-15 h-15 bg-[#FFD89C] text-white rounded-full flex items-center justify-center text-xl font-bold"> <img src="/media/img/frying-pan-and-fried-egg-svgrepo-com.svg" className="w-10 h-10" /> </span>
          Cooking Steps ({steps.length})
        </h2>
        <div className="flex flex-col gap-6">
          {steps.map((step, index) => (
            <div key={index} className="p-6 bg-[#FFD9B7] backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl border border-white/50 hover:-translate-y-1 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 mt-1">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.stepTitle}</h3>
                  <p className="text-gray-700 leading-relaxed">{step.stepDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-12">
        <button
          onClick={() => {
            router.push(`/recipes`);
          }}
          className="cursor-pointer px-8 py-3 bg-[#FD8D14] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          Back to All Recipes
        </button>
      </div>
    </div>
  );
}
