'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isClient, setIsClient] = useState(true);
  const { user, loading, logout } = useAuth();
  const router = useRouter();


  const handleLogout = () => {
    logout();
    router.push('/');
  };


  if (loading || !isClient) {
    return (
      <nav className="fixed h-full z-50 shadow-2xl transition-all duration-300
                  lg:w-[var(--navbar-w)] lg:bg-[var(--page-bg)] lg:px-[var(--padding)] lg:py-8 lg:flex lg:flex-col lg:gap-4 lg:rounded-r-lg
                  w-[var(--navbar-w-mobile)] bg-[var(--page-bg)] px-4 py-6 flex flex-col gap-3 rounded-r-lg">

        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[var(--accent)] rounded mx-auto mb-6 lg:mb-8 
                                 border-4 border-[var(--pane-bg)] text-xs font-bold shadow-lg flex items-center justify-center">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed h-full z-50 shadow-2xl transition-all duration-300
                  lg:w-[var(--navbar-w)] lg:bg-[var(--page-bg)] lg:px-[var(--padding)] lg:py-8 lg:flex lg:flex-col lg:gap-4 lg:rounded-r-lg
                  w-[var(--navbar-w-mobile)] bg-[var(--page-bg)] px-1 py-6 flex flex-col gap-3 rounded-r-lg">

      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[#DF2E38] rounded-full mx-auto mb-6 lg:mb-8 
                                 border-4 border-[var(--pane-bg)] text-xs font-bold shadow-lg flex items-center justify-center">
        <img src="/media/img/meal-lunch-svgrepo-com.svg" />
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <NavLink href="/" icon="/media/img/home.svg" label="Home" />
        <NavLink href="/recipes" icon="/media/img/recipes.svg" label="Recipes" />

        {user?.isChef && (
          <NavLink
            href="/create"
            icon="/media/img/create.svg"
            label="Create Recipe"
          />
        )}

        <NavLink href="/favorites" icon="/media/img/favorites.svg" label="Favorites" />
        <NavLink href="/calculator" icon="/media/img/calc.svg" label="Calculator" disabled />
        <NavLink href="/community" icon="/media/img/community.svg" label="Community" disabled />
      </div>

      <div className="w-full space-y-3">
        {!user ? (
          <>
            <Link
              href="/login"
              className="min-w-12 p-1 bg-[#ef4444] font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-4"
            >
              <img src="/media/img/profile-2.svg" className="block w-8 h-8" />
              <span className="block">Login</span>
            </Link>

            <Link
              href="/signup"
              className="min-w-12 p-1 bg-[#FFB100] font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-4"
            
            >
              <img src="/media/img/signup.svg" className="w-8 h-8" />
              <span>SignUp</span>
            </Link>
          </>
        ) : (
          <div className="space-y-4 text-center">
            <div className="flex flex-col lg:flex-row justify-center items-center lg:gap-4 p-1 bg-white/50 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center">
                {user.isChef? <img src="/media/img/recipe-svgrepo-com.svg" className="w-8 h-8" /> : <img src="/media/img/fried-chicken-meal-svgrepo-com" className="" />}
              </div>
              <span className="font-bold"> {user.isChef? "Master Chef" : "Master Cook"} </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm border border-red-400/30"
            >
              Logout
            </button>
          </div>
        )}
      </div>


    </nav>
  );
}


function NavLink({ href, icon, label, disabled }) {
  return (
    <a href={disabled ? '#' : href} className={`
      py-3 px-3 lg:px-4 rounded flex items-center gap-4 font-medium transition-all duration-200 hover:scale-[1.02]
      text-white/80 hover:bg-white/10 hover:text-white shadow-md
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="w-10 h-10 p-2 bg-white rounded-full lg:w-8 lg:h-8 flex items-center justify-center text-xs font-bold ">
        <img src={icon} className="w-10 h-10" />
      </div>
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}