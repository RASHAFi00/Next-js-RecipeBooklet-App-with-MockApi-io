'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    setLoading(false);
    if (result.success) {
      router.push('/recipes');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFD89C] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-[#FFD9B7] rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#df2e38] to-[#FD8D14] bg-clip-text text-transparent mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your kitchen account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#674636] rounded-xl focus:ring-2 focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#674636] rounded-xl focus:ring-2 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#df2e38] to-[#FD8D14] hover:from-[#FD8D14] hover:to-[#df2e38] text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-sm">
          New to the kitchen?{' '}
          <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Sign up here!
          </a>
        </p>
      </div>
    </div>
  );
}
