import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useCartStore } from '../store/cart';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    api.get(`/products?${params}`).then((res: any) => setProducts(res.data));
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shop Our Stacks</h1>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
            <Link to={`/product/${product.slug}`}>
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-emerald-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                </div>
              </div>
            </Link>
            <div className="p-4 pt-0">
              <button
                onClick={() => addToCart({ ...product, quantity: 1 })}
                className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}