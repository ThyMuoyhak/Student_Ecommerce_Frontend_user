import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../api/auth';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await authAPI.updateProfile(formData);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-purple-100', text: 'text-purple-700', icon: ShieldCheckIcon };
      case 'user':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: UserIcon };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: UserIcon };
    }
  };

  const roleStyle = getRoleColor(user?.role);
  const RoleIcon = roleStyle.icon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6 text-center border-b border-gray-100">
              <div className={`w-24 h-24 rounded-2xl ${roleStyle.bg} flex items-center justify-center mx-auto mb-4`}>
                <RoleIcon className={`h-12 w-12 ${roleStyle.text}`} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.full_name}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium mt-3 ${roleStyle.bg} ${roleStyle.text}`}>
                <ShieldCheckIcon className="h-3 w-3" />
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-gray-700">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-gray-700">{user?.phone_number || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Member Since</p>
                  <p className="text-gray-700">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">
                  {isEditing ? 'Edit Profile' : 'Profile Information'}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-6">
              {!isEditing ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-base text-gray-900">{user?.full_name}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-base text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-base text-gray-900">{user?.phone_number || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Role</p>
                    <p className="text-base text-gray-900 capitalize">{user?.role || 'User'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          full_name: user?.full_name || '',
                          phone_number: user?.phone_number || '',
                        });
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Security Note</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  For security reasons, email address cannot be changed. Contact support if you need to update your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;