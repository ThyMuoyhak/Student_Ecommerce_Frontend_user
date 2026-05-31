import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../../api/orders';
import { 
  ArrowLeftIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ClockIcon,
  CubeIcon,
  UserIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon,
  XMarkIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await ordersAPI.getById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Change order status to ${newStatus.toUpperCase()}?`)) return;
    
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(id, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: ClockIcon };
      case 'paid':
      case 'processing':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', icon: CubeIcon };
      case 'shipped':
        return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500', icon: TruckIcon };
      case 'delivered':
        return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: CheckCircleIcon };
      case 'cancelled':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', icon: XMarkIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-500', icon: CubeIcon };
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseUrl}${normalizedPath}`;
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Helper to check if status can be changed to a new status
  const canChangeTo = (currentStatus, newStatus) => {
    const orderFlow = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: [],
    };
    return orderFlow[currentStatus]?.includes(newStatus) || false;
  };

  if (loading) return <Loader />;
  if (!order) return null;

  const statusStyle = getStatusColor(order.status);
  const StatusIcon = statusStyle.icon;
  const itemCount = order.items?.length || 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors mb-3">
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back to Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Order #{order.order_number}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${statusStyle.bg} ${statusStyle.border} border`}>
            <StatusIcon className={`h-5 w-5 ${statusStyle.text}`} />
            <span className={`text-sm font-medium capitalize ${statusStyle.text}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{itemCount} items in this order</p>
                </div>
                <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              {order.items?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No items found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.items?.map((item, idx) => {
                    const imageUrl = getImageUrl(item.product_image);
                    const itemPrice = item.discount_price || item.unit_price;
                    
                    return (
                      <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                          {imageUrl ? (
                            <img 
                              src={imageUrl} 
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x80?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <CubeIcon className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Size: {item.product_size} | Color: {item.product_color}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-semibold text-gray-900">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ${itemPrice.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Status Update Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-900">Update Status</h2>
            </div>
            <div className="p-5">
              <select
                value={order.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={updating}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-sm"
              >
                {statusOptions.map(option => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={!canChangeTo(order.status, option.value) && order.status !== option.value}
                  >
                    {option.label}
                    {!canChangeTo(order.status, option.value) && order.status !== option.value && ' (not allowed)'}
                  </option>
                ))}
              </select>
              {updating && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </p>
              )}
              {order.status === 'delivered' && (
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3" />
                  Order has been delivered
                </p>
              )}
              {order.status === 'cancelled' && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <XMarkIcon className="h-3 w-3" />
                  Order has been cancelled
                </p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Customer Information</h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm text-gray-900 mt-0.5">{order.user?.full_name || 'Guest'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-900 mt-0.5 break-all">{order.user?.email || 'No email'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm text-gray-900 mt-0.5">{order.phone_number || 'No phone'}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Shipping Address</h2>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                {order.shipping_address || 'No address provided'}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Order Summary</h2>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="text-sm text-gray-900">${order.total_amount?.toFixed(2)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Discount</span>
                  <span className="text-sm text-red-600">-${order.discount_amount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm text-gray-500">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">${order.final_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-900">Order Notes</h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 italic">"{order.notes}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;