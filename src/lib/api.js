const MOCKAPI_BASE = 'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen/'; // Replace with YOUR project ID

export async function fetchRecipes(page = 1, limit = 25, filters = {}) {
  const params = new URLSearchParams({ 
    page: page.toString(), 
    limit: limit.toString(),
    ...filters 
  });
  
  const response = await fetch(`${MOCKAPI_BASE}/recipes?${params}`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

export async function fetchUsers(email, password) {
  const response = await fetch(`${MOCKAPI_BASE}/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  const users = await response.json();
  return users.find(u => u.email === email && u.password === password);
}

export async function createUser(userData) {
  const response = await fetch(`${MOCKAPI_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}
