import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, getProductsByCategory } from '../Api/ProductsApi';
import { useCart } from '../Context/CartContext';
import '../styles/productdetails.css';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product by ID
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error('Failed to load product:', error);
      }
    };
    loadProduct();
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    const loadRelated = async () => {
      if (product?.category) {
        try {
          const relatedRes = await getProductsByCategory(product.category);
          const filtered = relatedRes.data.filter((p) => p.id !== product.id);
          setRelatedProducts(filtered);
        } catch (error) {
          console.error('Failed to load related products:', error);
        }
      }
    };
    loadRelated();
  }, [product?.category, product?.id]); // FIX: Added product?.id

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
      alert('Product added to cart!');
    } catch (err) {
      console.error('Add to cart failed:', err);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      navigate('/checkout', { state: { product }, replace: false });
    }
  };

  if (!product) return <div>Loading product...</div>;

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <img
          src={product.img || 'https://via.placeholder.com/300x200'}
          alt={product.name}
        />
        <div className="product-details-content">
          <h2>{product.name}</h2>
          <p className="brand">Brand: {product.brand || 'Not specified'}</p>
          <p className="description">{product.description}</p>
          <p className="price">₹{product.price.toLocaleString('en-IN')}</p>

          <p className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="product-action-buttons">
            <button disabled={product.stock <= 0} onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button disabled={product.stock <= 0} onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products-section">
        <h3>Related Products</h3>
        <div className="related-products-grid">
          {relatedProducts.length > 0 ? (
            relatedProducts.map((rp) => (
              <div
                key={rp.id}
                className="related-product-card"
                onClick={() => navigate(`/product/${rp.id}`)}
              >
                <img
                  src={rp.img || 'https://via.placeholder.com/200x150'}
                  alt={rp.name}
                />
                <p>{rp.name}</p>
                <p className="price">₹{rp.price.toLocaleString('en-IN')}</p>
              </div>
            ))
          ) : (
            <p>No related products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
