'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreateRecipePage() {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    prepareTime: '',
  });
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ title: '', description: '' }]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('/placeholder-recipe.jpg');
  const [error, setError] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const router = useRouter();
  const { user } = useAuth();



  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="text-2xl text-gray-600 animate-pulse">Loading kitchen...</div>
      </div>
    );
  }



  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const updateIngredient = (index, value) => {
    const newIngredients = ingredients.map((ing, i) =>
      i === index ? value : ing
    );
    setIngredients(newIngredients);
  };

  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const removeStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const updateStep = (index, field, value) => {
    const newSteps = steps.map((step, i) =>
      i === index ? { ...step, [field]: value } : step
    );
    setSteps(newSteps);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validIngredients = ingredients.filter(ing => ing.trim());
    if (validIngredients.length === 0) {
      setError('Add at least one ingredient');
      setLoading(false);
      return;
    }

    const validSteps = steps.filter(step => step.title.trim());
    if (validSteps.length === 0) {
      setError('Add at least one step');
      setLoading(false);
      return;
    }

    const stepsArray = validSteps.map(step => {
      const stepObj = {};
      stepObj[step.title.trim()] = step.description.trim();
      return stepObj;
    });

    const recipeData = {
      userId: user.id,
      title: formData.title.trim(),
      image: formData.image.trim(),
      description: formData.description.trim(),
      rating: 0,
      popularity: 0,
      ingredients: ingredients.filter(ing => ing.trim()),
      steps: stepsArray,
      prepareTime: formData.prepareTime.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(
        'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/recipes',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipeData),
        }
      );

      if (response.ok) {
        router.push('/recipes');
      } else {
        setError('Failed to create recipe');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isChef) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#FFD89C] py-12 px-4 rounded-4xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="flex gap-8 justify-center items-center text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#FD8D14] to-[#df2e38] bg-clip-text text-transparent bg-clip-text text-transparent mb-6">
            <img src="/media/img/recipe-book-svgrepo-com.svg" className="w-22 h-22" /> Create Recipe
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your culinary masterpiece!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-[#FFD9B7] rounded-3xl p-8 mb-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3 justify-center">
              Recipe Preview & Details
            </h2>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <label className="block text-xl font-semibold text-gray-700 mb-4">Recipe Image</label>
                <div className="w-full h-80 lg:h-96 rounded-2xl overflow-hidden transition-all shadow-2xl">
                  <img
                    src={imagePreview.length > 7 ? imagePreview : "placeholder.avif"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = '/media/img/placeholder.avif'}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-[#674636] rounded-xl bg-white/50 transition-all text-lg"
                    placeholder="https://example.com/recipe-image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Recipe Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 border border-[#674636] rounded-xl bg-white/50 transition-all text-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-5 py-4 border border-[#674636] rounded-xl bg-white/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-3">Prep Time</label>
                  <input
                    type="text"
                    name="prepareTime"
                    value={formData.prepareTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-5 py-4 border border-[#674636] rounded-xl bg-white/50 transition-all"
                    placeholder="30 minutes"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFD9B7] rounded-3xl p-8 mb-8 border border-orange-200/50 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">Ingredients</h3>
              <button
                type="button"
                onClick={addIngredient}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-400 bg-white"
                    placeholder={`Ingredient ${index + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <img src="/media/img/trash.svg" className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFD9B7] rounded-3xl p-8 mb-12 border border-purple-200/50 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">📋 Steps</h3>
              <button
                type="button"
                onClick={addStep}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Add Step
              </button>
            </div>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="bg-white/60 p-6 rounded-2xl border border-purple-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="px-3 py-1 text-red-500 hover:text-red-600 font-semibold rounded-lg hover:bg-red-50 text-sm"
                      >
                        <img src="/media/img/trash.svg" className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, 'title', e.target.value)}
                    placeholder="Step title"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                  <textarea
                    value={step.description}
                    onChange={(e) => updateStep(index, 'description', e.target.value)}
                    placeholder="Step description"
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-400 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-3xl text-lg mb-8 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            className="flex gap-6 items-center justify-center w-full lg:max-w-2xl lg:mx-auto h-16 bg-gradient-to-r from-[#FD8D14] to-[#df2e38] text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all mx-auto block"
          >
            <img src="/media/img/recipe-svgrepo-com.svg" className="w-12 h-12" />
            {loadingSubmit ? (
              <>
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish My Masterpiece!'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
