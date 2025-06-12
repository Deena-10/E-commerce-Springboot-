// src/Api/ProductsApi.js
export async function fetchProductById(productId) {
  const response = await fetch(`http://localhost:8080/api/products/${productId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return await response.json();
}
