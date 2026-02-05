const API_BASE = 'https://697a4f180e6ff62c3c5914b5.mockapi.io/api/kitchen';

export async function fetchRecipes(filters = {}, page = 1, limit = null) {
  const params = new URLSearchParams();
  
  if (filters.rating && filters.rating !== '') {
    const mockApiRating = Math.round(parseFloat(filters.rating) * 20);
    params.append('rating', mockApiRating.toString());
  }
  
  if (filters.search) params.append('search', filters.search);
  if (filters.prepareTime) params.append('prepareTime', filters.prepareTime);
  if (filters.orderBy) params.append('orderBy', filters.orderBy);
  if (filters.order) params.append('order', filters.order);

  params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const url = `${API_BASE}/recipes?${params}`;
  console.log('Fetching:', url);
  
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) return { data: [], total: 0 };
    throw new Error(`HTTP ${response.status}`);
  }
  
  const data = await response.json();
  
  const transformedData = data.map(recipe => ({
    ...recipe,
    displayRating: (recipe.rating / 20).toFixed(1)
  }));

  return {
    data: transformedData,
    total: data.length * page,
    page,
    limit
  };
}
