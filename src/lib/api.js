const API_BASE = 'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen';

export async function fetchRecipes(filters = {}) {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.rating) params.append('rating', filters.rating);
  if (filters.prepareTime) params.append('prepareTime', filters.prepareTime);
  if (filters.ingredientsCount) params.append('ingredientsCount', filters.ingredientsCount);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.order) params.append('order', filters.order);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const url = `${API_BASE}/recipes?${params}`;
  console.log('Fetching:', url); // Debug
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

export async function fetchUser(email, password) {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const users = await response.json();
  return users.find(u => u.email === email && u.password === password);
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}
