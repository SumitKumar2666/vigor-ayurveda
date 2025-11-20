import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, Star, Leaf, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { ProductDetailSkeleton } from '../components/LoadingSkeleton';
import { IMAGES } from '../lib/images';
import api from '../lib/api';

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
  const [selectedImage, setSelectedImage] = useState(0);
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
      // Add the product the specified number of times
      for (let i = 0; i < quantity; i++) {
        addToCart({
          _id: product._id,
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images[0] || '',
          images: product.images
        });
      }
      navigate('/cart');
    }
  };

  const getProductImage = (product: Product, index: number = 0) => {
    if (product.images && product.images[index]) {
      return product.images[index];
    }
    const title = product.title?.toLowerCase() || '';
    if (title.includes('ashwagandha')) return IMAGES.products.ashwagandha;
    if (title.includes('shilajit')) return IMAGES.products.shilajit;
    if (title.includes('gokshura')) return IMAGES.products.gokshura;
    if (title.includes('morning')) return IMAGES.products.morningStack;
    if (title.includes('power')) return IMAGES.products.powerStack;
    if (title.includes('vitality')) return IMAGES.products.vitalityStack;
    return IMAGES.products.ashwagandha;
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container-custom section-padding text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const displayImages = product.images.length > 0
    ? product.images
    : [getProductImage(product, 0), getProductImage(product, 0), getProductImage(product, 0)];

  return (
    <div className="min-h-screen bg-earth-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sage-600 hover:text-sage-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="animate-fade-in">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-soft p-6 mb-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-sage-50 to-earth-50">
                  <img
                    src={displayImages[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {displayImages.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-sage-600 shadow-md'
                          : 'border-transparent hover:border-sage-300'
                      }`}
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slide-up">
            <div className="mb-4">
              <span className="text-sm text-turmeric-600 font-bold uppercase tracking-wide">
                {product.categoryId.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sage-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" className="text-turmeric-500" />
                ))}
              </div>
              <span className="text-gray-600 text-sm">(4.9 out of 5)</span>
            </div>

            {/* Price */}
            <div className="bg-sage-50 rounded-xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-sage-700">₹{product.price}</span>
                {product.mrp > product.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.mrp}</span>
                    <span className="bg-terracotta-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed mb-8 text-lg">{product.description}</p>

            {/* Stock Status */}
            <div className="bg-white rounded-xl p-4 mb-6 border border-sage-200">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="bg-green-100 rounded-full p-1" size={20} />
                  <span className="font-semibold">In Stock - {product.stock} available</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-700">
                  <span className="font-semibold">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-sage-900">Quantity:</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-sage-300 rounded-lg hover:bg-sage-50 font-semibold text-lg transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-sage-900 min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 border-2 border-sage-300 rounded-lg hover:bg-sage-50 font-semibold text-lg transition-colors"
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
              className="w-full btn-primary text-lg py-4 mb-6 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ShoppingBag size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-3 bg-white rounded-lg border border-sage-100">
                <Leaf className="mx-auto text-sage-600 mb-1" size={24} />
                <p className="text-xs font-semibold text-gray-700">100% Natural</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-sage-100">
                <Shield className="mx-auto text-sage-600 mb-1" size={24} />
                <p className="text-xs font-semibold text-gray-700">Lab Tested</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-sage-100">
                <Truck className="mx-auto text-sage-600 mb-1" size={24} />
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-sage-100">
                <RotateCcw className="mx-auto text-sage-600 mb-1" size={24} />
                <p className="text-xs font-semibold text-gray-700">30-Day Return</p>
              </div>
            </div>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="bg-white rounded-xl p-6 mb-6 shadow-soft">
                <h3 className="text-2xl font-bold mb-4 text-sage-900 flex items-center gap-2">
                  <div className="bg-sage-100 p-2 rounded-lg">
                    ✨
                  </div>
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="text-sage-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-2xl font-bold mb-4 text-sage-900 flex items-center gap-2">
                  <div className="bg-sage-100 p-2 rounded-lg">
                    🌿
                  </div>
                  Ingredients
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-sage-600 font-bold">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
