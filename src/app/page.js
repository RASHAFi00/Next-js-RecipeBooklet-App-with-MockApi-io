'use client';
import { useState, useEffect } from 'react';
import { fetchRecipes } from '@/lib/api';
import RecipeCard from '@/components/RecipeCard';
import Link from 'next/link';

export default function Home() {
  const [topRecipes, setTopRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadTopRecipes() {
      try {
        const data = await fetchRecipes({
          orderBy: 'rating',
          order: 'desc',
          limit: 15,
          page: 1
        });
        setTopRecipes(data);
      } catch (error) {
        console.error('Failed to load top recipes:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTopRecipes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-500 animate-pulse">Loading top recipes...</div>
      </div>
    );
  }

  console.log(" TRUE FORM : " , topRecipes.data);
  const top5Slides = topRecipes.data.slice(0, 5);
  const remaining10 = topRecipes.data.slice(5, 15);

  // const top5Slides = [];
  // const remaining10 = [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE580] via-[#EBE1D1] to-[#FFFDE1]">
      <section className="pt-24 pb-20 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-[#FD8D14] to-[#df2e38] bg-clip-text text-transparent bg-clip-text text-transparent mb-6 leading-tight">
          Recipe Kitchen
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover amazing recipes from our community of chefs.
          Sign in to save favorites or share your own creations!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

          <Link
            href="/recipes"
            className="px-12 py-5 bg-gradient-to-r from-[#FE5D26] to-[#FF3F33] text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
              Browse All Recipes
          </Link>



          <a
            href="/login"
            className="px-12 py-5 border-4 border-[#FF9B00] text-[#FF9B00] font-bold text-xl rounded-3xl hover:bg-[#FF9B00] hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Sign In
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Top Rated Recipes
          </h2>
          <div className="w-24 h-1 bg-[#CF0F0F] mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="relative max-w-6xl mx-auto min-h-[700px] sm:h-[700px] md:h-[700px] overflow-hidden rounded-3xl shadow-2xl bg-[#FCB53B">
          <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {top5Slides.map((recipe, index) => (
              <div key={recipe.id} className=" this-slide w-full h-full flex-shrink-0 group">
                <div className="h-full flex items-center justify-center px-6 sm:px-4 lg:px-20">
                  <div className="w-full max-w-4xl flex flex-col lg:flex-row sm:gap-6 lg:gap-12 items-center group-hover:scale-[1.02] transition-all duration-500">
                    <div className="flex-shrink-0 w-80 h-60 w-full lg:w-96 lg:h-96 flex items-center justify-center group-hover:shadow-3xl transition-all duration-700">
                      <img src={ (recipe.image.length<10)? "/media/img/placeholder.svg" : recipe.image } className="block rounded-xl shadow-xl" onError={(e)=> e.target.src="/media/img/placeholder.svg"} />
                    </div>

                    <div className="flex-1 text-center lg:text-left space-y-6 lg:max-w-lg">
                      <div className="inline-flex items-center gap-2 mb-3 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xl rounded-2xl shadow-xl">
                        <span className="bg-white p-1 rounded-full"> <img src="/media/img/star.svg" className="block w-6 h-6" /> </span>
                        {recipe.displayRating} - Top Pick!
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight line-clamp-2 mb-2">
                        {recipe.title}
                      </h3>

                      <p className="text-lg text-gray-600 leading-relaxed line-clamp-3 mb-2">
                        {recipe.description}
                      </p>

                      <div className="flex sm:flex-col flex-row flex-wrap gap-2">
                        <a
                          href={`/recipes/${recipe.id}`}
                          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#FE5D26] to-[#FF3F33] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                          View Recipe
                        </a>
                        <span className="px-4 py-2.5 text-xl font-bold text-gray-700 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center">
                          {recipe.popularity || 0} cooked
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {top5Slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'w-8 bg-white shadow-lg scale-110'
                    : 'bg-white/60 hover:bg-white hover:scale-110'
                  }`}
              />
            ))}
          </div>

          <div className="absolute top-8 right-8 w-24 h-2 bg-white/20 rounded-full shadow-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FE5D26] to-[#FF3F33] shadow-lg rounded-full transition-all duration-10000 ease-linear"
              style={{ width: `${((10000 - ((10000 / 5) * (4 - currentSlide % 5))) / 10000) * 100}%` }}
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            More Top Rated Recipes
          </h2>
          <div className="w-24 h-1 bg-[#CF0F0F] mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center">
          {remaining10.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/recipes" className="inline-flex items-center gap-3 px-12 py-5 bg-[#CF0F0F] text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all duration-300">
            View All Recipes
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-t from-[#FBE580] to-[#FFFDE1] py-20 px-6 rounded-4xl">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#FFE52A] via-[#F79A19] to-[#CF0F0F] p-1 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-3xl font-bold"> <img src="/media/img/meal-lunch-svgrepo-com.svg" /> </span>
          </div>

          <h3 className="text-3xl font-bold mb-6">Recipe Kitchen</h3>

          <div className="max-w-2xl mx-auto space-y-4 text-lg leading-relaxed text-gray-800">
            <p>
              This experimental app showcases the power of <strong>AI-assisted development</strong> combined with modern web technologies.
            </p>
            <p>
              Built with <strong>React + Next.js + Tailwind CSS</strong>, powered by <strong>MockAPI</strong> for real-time data,
              and featuring <strong>AI-generated UI components</strong> for rapid prototyping.
            </p>
            <p>
              Explore <strong>Recipes</strong>, save <strong>Favorites</strong>, track <strong>Popularity</strong>,
              and soon <strong>create your own recipes</strong> as a logged-in chef!
            </p>
          </div>

          <div className="flex flex-wrap gap-6 justify-center pt-8 border-t border-white/20">
            <Link href="/recipes" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/50 transition-all font-medium">Recipes</Link>
            <Link href="/favorites" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/50 transition-all font-medium">Favorites</Link>
            <Link href="/login" className="px-6 py-3 bg-[#F79A19] hover:bg-[#CF0F0F] hover:text-white rounded-xl transition-all font-medium">Sign In</Link>
          </div>

          <p className="text-sm text-gray-500">&copy; 2026 Recipe Kitchen - AI-Powered Cooking Experiment</p>
        </div>
      </footer>
    </div>
  );
}
