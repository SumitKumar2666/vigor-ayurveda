import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, MapPin, CreditCard, Lock, User, Phone, Home, Package, CheckCircle, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import api from '../lib/api';

interface ShippingAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        items: items.map((item) => ({
          productId: item._id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
      };

      const orderResponse = await api.post('/orders', orderData);
      const order = orderResponse.data;

      // Create Razorpay order
      const paymentResponse = await api.post('/payments/razorpay/order', {
        orderId: order._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || paymentResponse.data.key_id,
        amount: paymentResponse.data.amount * 100, // Convert to paise
        currency: paymentResponse.data.currency,
        name: 'Vigor Ayurveda',
        description: 'Order Payment',
        order_id: paymentResponse.data.order_id,
        handler: async function (response: any) {
          try {
            await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            clearCart();
            navigate('/account?tab=orders&success=true');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: shippingAddress.name,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#6B8E23', // sage-600
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom section-padding">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-earth-100 rounded-full mb-6 animate-scale-in">
            <ShoppingBag className="w-12 h-12 text-sage-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-4">Your Cart is Empty</h1>
          <button
            onClick={() => navigate('/shop')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-custom section-padding">
        <div className="max-w-md mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-turmeric-100 rounded-full mb-6 animate-scale-in">
            <Lock className="w-12 h-12 text-turmeric-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-4">Please Login to Continue</h1>
          <p className="text-sage-600 mb-8">You need to be logged in to complete your order</p>
          <button
            onClick={() => navigate('/auth')}
            className="btn-primary"
          >
            Login / Register
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom section-padding bg-earth-50 min-h-screen">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="w-8 h-8 text-sage-700" />
          <h1 className="text-3xl md:text-4xl font-bold text-sage-800">Secure Checkout</h1>
          <Lock className="w-5 h-5 text-turmeric-600" />
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage-600 text-white flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sage-800">Cart</p>
                <p className="text-xs text-sage-600">{items.length} items</p>
              </div>
            </div>

            <div className="h-1 flex-1 mx-2 bg-sage-200 rounded">
              <div className="h-full w-1/2 bg-sage-600 rounded"></div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-turmeric-500 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sage-800">Shipping</p>
                <p className="text-xs text-sage-600">Address</p>
              </div>
            </div>

            <div className="h-1 flex-1 mx-2 bg-sage-200 rounded"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-earth-300 text-sage-700 flex items-center justify-center font-bold">
                3
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sage-600">Payment</p>
                <p className="text-xs text-sage-500">Complete</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-sage-700" />
                <h2 className="text-2xl font-bold text-sage-800">Shipping Address</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-sage-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-sage-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter 10-digit mobile number"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-sage-700 mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Address Line 1*
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingAddress.addressLine1}
                    onChange={handleInputChange}
                    required
                    placeholder="House No., Building Name, Street"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-sage-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingAddress.addressLine2}
                    onChange={handleInputChange}
                    placeholder="Area, Colony, Landmark (Optional)"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-2">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-2">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-2">Pincode*</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    required
                    placeholder="6-digit pincode"
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 focus:border-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sage-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    readOnly
                    className="w-full border-2 border-sage-200 rounded-xl px-4 py-3 bg-earth-50 text-sage-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card shadow-soft sticky top-4 bg-gradient-to-br from-white to-earth-50 border-2 border-sage-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-6">
                <Package className="w-6 h-6 text-sage-700" />
                <h2 className="text-xl font-bold text-sage-800">Order Summary</h2>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between gap-4 pb-3 border-b border-sage-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sage-800 truncate">{item.title}</p>
                      <p className="text-xs text-sage-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-sage-700">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pt-4 border-t-2 border-sage-200">
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

                <div className="border-t-2 border-sage-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-sage-800">Total</span>
                    <span className="text-2xl font-bold text-turmeric-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="btn-primary w-full inline-flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Proceed to Pay</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-sage-600 justify-center">
                <Lock className="w-3 h-3" />
                <span>Payments secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
