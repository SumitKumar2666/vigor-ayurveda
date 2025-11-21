import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, Package, LogOut, ShoppingBag, MapPin, Phone, Mail, Shield, Calendar, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import api from '../lib/api';

interface Order {
  _id: string;
  items: Array<{
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    name: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function Account() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, navigate, activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-turmeric-100 text-turmeric-800 border-turmeric-200',
      PROCESSING: 'bg-sage-100 text-sage-800 border-sage-200',
      SHIPPED: 'bg-blue-100 text-blue-800 border-blue-200',
      DELIVERED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-terracotta-100 text-terracotta-800 border-terracotta-200',
    };
    return colors[status] || 'bg-earth-100 text-sage-800 border-earth-200';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      PENDING: Clock,
      PROCESSING: Package,
      SHIPPED: Truck,
      DELIVERED: CheckCircle,
      CANCELLED: XCircle,
    };
    const Icon = icons[status] || Clock;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="container-custom section-padding bg-earth-50 min-h-screen">
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-sage-700" />
          <h1 className="text-3xl md:text-4xl font-bold text-sage-800">My Account</h1>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="card shadow-soft sticky top-4 animate-slide-up">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === 'profile'
                      ? 'bg-gradient-to-r from-sage-600 to-sage-700 text-white shadow-md'
                      : 'text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-sage-600 to-sage-700 text-white shadow-md'
                      : 'text-sage-700 hover:bg-sage-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>My Orders</span>
                </button>
                <div className="pt-4 border-t-2 border-sage-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-terracotta-600 hover:bg-terracotta-50 transition-all font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            {activeTab === 'profile' && (
              <div className="card shadow-soft animate-slide-up">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-sage-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sage-500 to-sage-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-sage-800">{user.name}</h2>
                    <p className="text-sage-600">Personal Information</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-earth-50 rounded-xl border-2 border-sage-100">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-5 h-5 text-sage-600" />
                      <label className="text-sm font-semibold text-sage-700">Full Name</label>
                    </div>
                    <p className="text-lg font-medium text-sage-800">{user.name}</p>
                  </div>

                  <div className="p-4 bg-earth-50 rounded-xl border-2 border-sage-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-sage-600" />
                      <label className="text-sm font-semibold text-sage-700">Email Address</label>
                    </div>
                    <p className="text-lg font-medium text-sage-800 break-all">{user.email}</p>
                  </div>

                  {user.phone && (
                    <div className="p-4 bg-earth-50 rounded-xl border-2 border-sage-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-sage-600" />
                        <label className="text-sm font-semibold text-sage-700">Phone Number</label>
                      </div>
                      <p className="text-lg font-medium text-sage-800">{user.phone}</p>
                    </div>
                  )}

                  <div className="p-4 bg-earth-50 rounded-xl border-2 border-sage-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-sage-600" />
                      <label className="text-sm font-semibold text-sage-700">Account Type</label>
                    </div>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-turmeric-100 to-turmeric-200 text-turmeric-800 px-4 py-2 rounded-full text-sm font-semibold border-2 border-turmeric-300">
                      <Shield className="w-4 h-4" />
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card shadow-soft animate-slide-up">
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-sage-100">
                  <div className="flex items-center gap-2">
                    <Package className="w-6 h-6 text-sage-700" />
                    <h2 className="text-2xl font-bold text-sage-800">Order History</h2>
                  </div>
                  {orders.length > 0 && (
                    <span className="bg-turmeric-100 text-turmeric-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                    </span>
                  )}
                </div>

                {searchParams.get('success') === 'true' && (
                  <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 animate-scale-in">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Order placed successfully!</p>
                      <p className="text-sm">Thank you for your purchase. We'll process your order shortly.</p>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sage-600">Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-earth-100 rounded-full mb-6 animate-scale-in">
                      <ShoppingBag className="w-12 h-12 text-sage-600" />
                    </div>
                    <h3 className="text-xl font-bold text-sage-800 mb-3">No Orders Yet</h3>
                    <p className="text-sage-600 mb-6">Start shopping to see your orders here!</p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order, index) => (
                      <div
                        key={order._id}
                        className="border-2 border-sage-200 rounded-xl p-6 bg-gradient-to-br from-white to-earth-50 hover:shadow-lg transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b-2 border-sage-100">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-sage-600" />
                              <p className="text-sm font-mono text-sage-600">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-sage-600">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                          <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center gap-4 p-3 bg-white rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-sage-800">{item.title}</p>
                                <p className="text-sm text-sage-600">Quantity: {item.quantity}</p>
                              </div>
                              <span className="font-semibold text-turmeric-600">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="border-t-2 border-sage-200 pt-4 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-sage-800">Total Amount</span>
                            <span className="text-2xl font-bold text-turmeric-600">₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-earth-100 p-4 rounded-xl border-2 border-sage-100">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-5 h-5 text-sage-700" />
                            <p className="font-semibold text-sage-800">Delivery Address</p>
                          </div>
                          <div className="text-sm text-sage-700 space-y-1">
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Phone className="w-4 h-4" />
                              <p>{order.shippingAddress.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
