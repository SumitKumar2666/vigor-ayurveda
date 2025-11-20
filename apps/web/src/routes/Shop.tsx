import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Star, Search, Filter } from 'lucide-react';
import api from '../lib/api';
import { useCartStore } from '../store/cart';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { IMAGES } from '../lib/images';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'stacks', label: 'Stacks' },
  { id: 'single', label: 'Single Herbs' },
  { id: 'bestsellers', label: 'Best Sellers' },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    setLoading(true);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    api
      .get(`/products?${params}`)
      .then((res: any) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('search', searchQuery);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images[0]) {
      return product.images[0];
    }
    // Map product categories to placeholder images
    const title = product.title?.toLowerCase() || '';
    if (title.includes('ashwagandha')) return IMAGES.products.ashwagandha;
    if (title.includes('shilajit')) return IMAGES.products.shilajit;
    if (title.includes('gokshura')) return IMAGES.products.gokshura;
    if (title.includes('morning')) return IMAGES.products.morningStack;
    if (title.includes('power')) return IMAGES.products.powerStack;
    if (title.includes('vitality')) return IMAGES.products.vitalityStack;
    return IMAGES.products.ashwagandha;
  };

  const calculateDiscount = (price: number, mrp: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sage-700 to-sage-600 text-white py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Our Ayurvedic Stacks</h1>
            <p className="text-xl text-sage-50">
              Premium formulations crafted with traditional wisdom and modern science
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <Filter size={20} className="text-gray-500 hidden md:block" />
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-sage-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{products.length}</span> products
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any, index: number) => (
                  <div
                    key={product._id}
                    className="card group overflow-hidden animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link to={`/product/${product.slug}`}>
                      <div className="relative aspect-square bg-gradient-to-br from-sage-50 to-earth-50 overflow-hidden">
                        <img
                          src={getProductImage(product)}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.mrp > product.price && (
                          <div className="absolute top-3 right-3 bg-terracotta-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            {calculateDiscount(product.price, product.mrp)}% OFF
                          </div>
                        )}
                        {product.bestseller && (
                          <div className="absolute top-3 left-3 bg-turmeric-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                            <Star size={14} fill="currentColor" />
                            Bestseller
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2">
                          <span className="text-xs text-sage-600 font-semibold uppercase tracking-wide">
                            {product.category || 'Ayurvedic Stack'}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-sage-900 group-hover:text-sage-600 transition-colors line-clamp-2">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.shortDescription || product.description}
                        </p>

                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-sage-700">₹{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                          )}
                        </div>

                        {/* Benefits tags */}
                        {product.benefits && product.benefits.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.benefits.slice(0, 2).map((benefit: string, i: number) => (
                              <span
                                key={i}
                                className="text-xs bg-sage-50 text-sage-700 px-2 py-1 rounded-full"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="px-5 pb-5">
                      <button
                        onClick={() => addToCart({ ...product, quantity: 1 })}
                        className="w-full btn-primary flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Benefits Banner */}
      <section className="bg-sage-700 text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl mb-2">🚚</div>
              <h4 className="font-bold mb-1">Free Shipping</h4>
              <p className="text-sage-100 text-sm">On orders above ₹999</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-bold mb-1">Secure Payment</h4>
              <p className="text-sage-100 text-sm">100% secure transactions</p>
            </div>
            <div>
              <div className="text-3xl mb-2">↩️</div>
              <h4 className="font-bold mb-1">30-Day Returns</h4>
              <p className="text-sage-100 text-sm">Money-back guarantee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}