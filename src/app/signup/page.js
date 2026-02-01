'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [role, setRole] = useState('cook');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = {
      ...formData,
      role: role === 'chef' ? 'chef' : 'cook',
      createdAt: new Date().toISOString()
    };

    const result = await signup(userData);
    setLoading(false);
    
    if (result.success) {
      router.push('/recipes');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Join the Kitchen
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Create your account to start cooking!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* CONTAINER 1: USER DATA FIELDS */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/30 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              👤 Personal Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/50 transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/50 transition-all"
                  placeholder="Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/50 transition-all"
                  placeholder="john.doe@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-3 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* CONTAINER 2: ROLE SELECTION */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 mb-8 border border-white/30 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              🎭 Choose Your Role
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setRole('chef')}
                className={`group p-8 rounded-2xl border-4 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  role === 'chef'
                    ? 'border-emerald-500 bg-emerald-100 shadow-xl'
                    : 'border-gray-200 hover:border-emerald-400 bg-white/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform">
                    👨‍🍳
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Master Chef</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Create & share your original recipes with the world
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('cook')}
                className={`group p-8 rounded-2xl border-4 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                  role === 'cook'
                    ? 'border-blue-500 bg-blue-100 shadow-xl'
                    : 'border-gray-200 hover:border-blue-400 bg-white/50'
                }`}
              >
                <div className="text-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform">
                    🍳
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Home Cook</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Explore amazing recipes and cook delicious meals
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* FULL WIDTH BUTTONS - OUTSIDE CONTAINERS */}
          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 via-emerald-600 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                '🍳 Join the Kitchen!'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="w-full h-14 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-lg rounded-2xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Already have an account? Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
