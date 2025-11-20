import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cart';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const shipping = subtotal > 999 ? 0 : 99; // Free shipping above ₹999
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-earth-100 rounded-full mb-6 animate-scale-in">
            <ShoppingBag className="w-12 h-12 text-sage-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-sage-800 mb-4">Your Cart is Empty</h1>
          <p className="text-sage-600 mb-8 text-lg">Discover our collection of authentic Ayurvedic products!</p>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding bg-earth-50 min-h-screen">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-sage-700" />
          <h1 className="text-3xl md:text-4xl font-bold text-sage-800">Shopping Cart</h1>
          <span className="bg-turmeric-100 text-turmeric-700 px-3 py-1 rounded-full text-sm font-semibold">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="card hover:shadow-xl transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative overflow-hidden rounded-xl bg-earth-100 flex-shrink-0">
                    <img
                      src={item.images?.[0] || item.image || '/placeholder-product.jpg'}
                      alt={item.title}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-sage-800 mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-turmeric-600 font-bold text-xl mb-3">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 bg-earth-50 rounded-lg p-1 border border-sage-200">
                        <button
                          onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-100 text-sage-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-sage-800 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-sage-100 text-sage-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="flex items-center gap-2 text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Remove</span>
                      </button>

                      <div className="ml-auto text-right">
                        <p className="text-xs text-sage-600 mb-1">Subtotal</p>
                        <p className="font-bold text-xl text-sage-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="card bg-earth-100">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card shadow-soft sticky top-4 bg-gradient-to-br from-white to-earth-50 border-2 border-sage-200">
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-6 h-6 text-sage-700" />
                <h2 className="text-xl font-bold text-sage-800">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sage-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sage-700">
                  <span>Tax (18% GST)</span>
                  <span className="font-semibold">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sage-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                {subtotal < 999 && (
                  <div className="bg-turmeric-50 border-l-4 border-turmeric-500 p-3 rounded-r-lg animate-pulse">
                    <p className="text-sm text-turmeric-800 font-medium">
                      Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!
                    </p>
                  </div>
                )}

                <div className="border-t-2 border-sage-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-sage-800">Total</span>
                    <span className="text-2xl font-bold text-turmeric-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-4 flex items-center gap-2 text-sm text-sage-600 justify-center">
                <Package className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
