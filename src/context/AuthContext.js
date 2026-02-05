'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/users?email=${email}&password=${password}`
      );

      if (response.ok) {
        const users = await response.json();
        if (users.length > 0) {
          const userData = users[0];

          const normalizedUser = {
            ...userData,
            isChef: userData.isChef === true || userData.role === 'chef'
          };

          const token = `${email}${password}`;
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(normalizedUser));
          setUser(normalizedUser);
          return { success: true };
        }
      }
      return { success: false, error: 'User not found. Please sign up!' };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const normalizedUserData = {
        ...userData,
        isChef: userData.isChef === 'chef',
        role: undefined
      };

      const response = await fetch(
        'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/users',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalizedUserData),
        }
      );

      if (response.ok) {
        const newUser = await response.json();
        const token = `${userData.email}${userData.password}`;

        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setUser(newUser);
        return { success: true };
      }
      return { success: false, error: 'Signup failed' };
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
