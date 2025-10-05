import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { useCartStore } from '../store/cart';

export const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    api.get(`/products?${params}`).then((res) => setProducts(res.data));
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shop Our Stacks</h1>
      
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
            <Link to={`/product/${product.slug}`}>
              <div className="aspect-square bg-gray-100"></div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold">₹{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                </div>
              </div>
            </Link>
            <div className="p-4 pt-0">
              <button
                onClick={() => addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.images[0],
                })}
                className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};