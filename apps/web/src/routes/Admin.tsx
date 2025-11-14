import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import api from '../lib/api';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  totalBlogPosts: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface Order {
  _id: string;
  items: Array<{
    title: string;
    quantity: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
  userId: {
    name: string;
    email: string;
  };
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [user, navigate, activeTab]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'dashboard' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded ${
                  activeTab === 'orders' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
              >
                View Store
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-4">
          {activeTab === 'dashboard' && (
            <div>
              {loading ? (
                <p>Loading...</p>
              ) : stats ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
                      <p className="text-3xl font-bold text-emerald-600">₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Total Orders</h3>
                      <p className="text-3xl font-bold">{stats.totalOrders}</p>
                      <p className="text-sm text-gray-500 mt-1">{stats.pendingOrders} pending</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
                      <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Products</h3>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Categories</h3>
                      <p className="text-2xl font-bold">{stats.totalCategories}</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                      <h3 className="text-gray-600 text-sm font-medium mb-2">Blog Posts</h3>
                      <p className="text-2xl font-bold">{stats.totalBlogPosts}</p>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">All Orders</h2>

              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-600">No orders yet.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{order.userId.name}</p>
                          <p className="text-sm text-gray-600">{order.userId.email}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{order.total}</p>
                          <p className="text-sm text-gray-600">ID: {order._id.slice(-6)}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm">
                            {item.title} x {item.quantity}
                          </p>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          className="border rounded px-3 py-1 text-sm"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
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
  );
}
