'use client';
import { useAuth } from '@/context/AuthContext';

export default function ClientAuthNav() {
  const { user, logout } = useAuth();

  return user ? (
    <a href="#" onClick={(e) => { 
      e.preventDefault(); 
      logout(); 
    }} className="text-red-400 flex items-center gap-3 font-medium hover:bg-white/10 p-3 rounded transition-all hover:scale-[1.02]">
      <div className="w-6 h-6 bg-red-500/30 backdrop-blur-sm rounded flex items-center justify-center text-xs font-bold">
        🚪
      </div>
      <span className="hidden lg:inline">Logout</span>
    </a>
  ) : (
    <a href="/login" className="text-blue-400 flex items-center gap-3 font-medium hover:bg-white/10 p-3 rounded transition-all hover:scale-[1.02]">
      <div className="w-6 h-6 bg-blue-500/30 backdrop-blur-sm rounded flex items-center justify-center text-xs font-bold">
        👤
      </div>
      <span className="hidden lg:inline">Login</span>
    </a>
  );
}
