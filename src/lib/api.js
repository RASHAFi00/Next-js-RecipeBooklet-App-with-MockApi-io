const API_BASE = 'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen';

export async function fetchRecipes(filters = {}) {
  const params = new URLSearchParams();
  
  // Transform display rating (0-5) → MockAPI rating (0-100)
  if (filters.rating && filters.rating !== '') {
    const mockApiRating = Math.round(parseFloat(filters.rating) * 20);
    params.append('rating', mockApiRating.toString());
  }
  
  if (filters.search) params.append('search', filters.search);
  if (filters.prepareTime) params.append('prepareTime', filters.prepareTime);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.order) params.append('order', filters.order);

  const url = `${API_BASE}/recipes?${params}`;
  console.log('Fetching:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) return []; // Empty results = no match
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  // Transform MockAPI rating (1-100) → Display rating (1-5)
  return data.map(recipe => ({
    ...recipe,
    displayRating: (recipe.rating / 20).toFixed(1) // 80 → 4.0⭐
  }));
}
