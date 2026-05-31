import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    paid: { color: 'bg-blue-100 text-blue-800', label: 'Paid' },
    processing: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
    shipped: { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
    delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
    admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
    user: { color: 'bg-blue-100 text-blue-800', label: 'User' },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;