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
      <nav className="fixed h-full z-50 shadow-2xl border-r border-white/10 transition-all duration-300
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
    <nav className="fixed h-full z-50 shadow-2xl border-r border-white/10 transition-all duration-300
                  lg:w-[var(--navbar-w)] lg:bg-[var(--page-bg)] lg:px-[var(--padding)] lg:py-8 lg:flex lg:flex-col lg:gap-4 lg:rounded-r-lg
                  w-[var(--navbar-w-mobile)] bg-[var(--page-bg)] px-4 py-6 flex flex-col gap-3 rounded-r-lg">

      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-[var(--accent)] rounded mx-auto mb-6 lg:mb-8 
                                 border-4 border-[var(--pane-bg)] text-xs font-bold shadow-lg flex items-center justify-center">
        [LOGO]
      </div>

      <div className="flex-1 flex flex-col gap-2 lg:gap-2">
        <NavLink href="/" icon="🏠" label="Home" />
        <NavLink href="/recipes" icon="🍳" label="Recipes" />
        <NavLink href="/favorites" icon="❤️" label="Favorites" />
        <NavLink href="/calculator" icon="🧮" label="Calculator" disabled />
        <NavLink href="/community" icon="👥" label="Community" disabled />
      </div>

      {/* AUTH SECTION - PREMIUM KITCHEN STYLE */}
      <div className="p-6 border-t border-gray-100/50 mt-auto space-y-3">
        {!user ? (
          <>
            {/* LOGIN BUTTON - Gradient + Shadow */}
            <Link
              href="/login"
              className="w-full block p-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-center backdrop-blur-sm border border-blue-500/30 flex items-center justify-center gap-2 h-14"
            >
              <span className="text-xl">🔐</span>
              Login
            </Link>

            {/* SEPARATOR */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />

            {/* SIGNUP BUTTON - Larger + More Prominent */}
            <Link
              href="/signup"
              className="w-full block p-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center backdrop-blur-sm border border-emerald-500/40 flex items-center justify-center gap-3 h-16"
            >
              <span className="text-2xl">🍳</span>
              Join the Kitchen!
            </Link>
          </>
        ) : (
          <div className="space-y-4 text-center">
            {/* USER INFO CARD */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl border border-blue-100/50 shadow-lg backdrop-blur-sm">
              <div className="font-bold text-xl text-gray-900 mb-2 truncate">
                👋 {user.firstName}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${user.role === 'chef'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                {user.role === 'chef' ? '👨‍🍳 Master Chef' : '🍳 Home Cook'}
              </div>
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm border border-red-400/30"
            >
              <span className="text-xl">🚪</span>
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
      py-3 px-3 lg:px-4 rounded flex items-center gap-3 font-medium transition-all duration-200 hover:scale-[1.02]
      text-white/80 hover:bg-white/10 hover:text-white shadow-md
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}>
      <div className="w-6 h-6 lg:w-6 lg:h-6 bg-[var(--accent)]/30 backdrop-blur-sm rounded flex items-center justify-center text-xs font-bold min-w-[24px]">
        {icon}
      </div>
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}