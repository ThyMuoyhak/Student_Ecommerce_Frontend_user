import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usersAPI } from '../../api/users';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await usersAPI.getById(id);
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await usersAPI.toggleStatus(user.id);
      toast.success(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchUser();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link to="/users" className="text-primary-600 hover:text-primary-700 flex items-center mb-2">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{user.phone_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{user.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined Date</p>
              <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <StatusBadge status={user.role} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
            </div>
            <div className="pt-4 flex gap-3">
              <button onClick={handleToggleStatus} className="btn-secondary">
                {user.is_active ? 'Deactivate User' : 'Activate User'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;