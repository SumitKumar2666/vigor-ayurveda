import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { api } from '../lib/api';

interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  price: number;
  mrp: number;
  images: string[];
  stock: number;
  categoryId: {
    name: string;
    slug: string;
  };
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${slug}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      navigate('/cart');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!product) {
    return <div className="container mx-auto px-4 py-8">Product not found</div>;
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="mb-4 text-emerald-600 hover:text-emerald-700">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="text-sm text-emerald-600 mb-2">{product.categoryId.name}</div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-emerald-600">₹{product.price}</span>
            <span className="text-xl text-gray-400 line-through">₹{product.mrp}</span>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
              {discount}% OFF
            </span>
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-semibold">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-xl font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>

          {/* Benefits */}
          {product.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3">Key Benefits:</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-1">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ingredients */}
          {product.ingredients.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-3">Ingredients:</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">• {ingredient}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
