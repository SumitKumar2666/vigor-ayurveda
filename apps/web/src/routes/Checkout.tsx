import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import { api } from '../lib/api';

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
          color: '#059669',
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
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate('/shop')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Login to Continue</h1>
        <button
          onClick={() => navigate('/auth')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
        >
          Login / Register
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name*</label>
                <input
                  type="text"
                  name="name"
                  value={shippingAddress.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number*</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address Line 1*</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={shippingAddress.addressLine1}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={shippingAddress.addressLine2}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City*</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State*</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={shippingAddress.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  readOnly
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>
                    {item.title} x {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
