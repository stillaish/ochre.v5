import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Bell, Save, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

interface ProfileForm {
  name: string;
  phone: string;
  address: string;
  alertSubscriptions: string[];
}

interface UserReport {
  id: string;
  type: string;
  description: string;
  location: {
    address: string;
  };
  severity: string;
  status: string;
  createdAt: string;
  aiVerification: {
    score: number;
    reasons: string[];
  };
}

const Profile = () => {
  const { state: authState, updateProfile } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>();

  const alertTypes = [
    { value: 'weather', label: 'Weather Alerts', description: 'Severe weather warnings and forecasts' },
    { value: 'earthquake', label: 'Earthquake Alerts', description: 'Seismic activity notifications' },
    { value: 'flood', label: 'Flood Warnings', description: 'Flood alerts and water level updates' },
    { value: 'cyclone', label: 'Cyclone Alerts', description: 'Tropical cyclone and storm warnings' },
    { value: 'fire', label: 'Fire Alerts', description: 'Wildfire and fire emergency notifications' },
    { value: 'landslide', label: 'Landslide Warnings', description: 'Slope instability and landslide alerts' },
  ];

  useEffect(() => {
    if (authState.user) {
      reset({
        name: authState.user.name,
        phone: authState.user.phone || '',
        address: authState.user.location.address || '',
        alertSubscriptions: authState.user.alertSubscriptions || [],
      });
      fetchUserReports();
    }
  }, [authState.user, reset]);

  const fetchUserReports = async () => {
    try {
      setReportsLoading(true);
      const response = await axios.get('http://localhost:3001/api/hazards/my-reports', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setUserReports(response.data.reports || []);
    } catch (error) {
      console.error('Error fetching user reports:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load your reports',
      });
    } finally {
      setReportsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      setLoading(true);
      await updateProfile({
        name: data.name,
        phone: data.phone,
        location: {
          ...authState.user?.location,
          address: data.address,
        },
        alertSubscriptions: data.alertSubscriptions,
      });
      
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReportStats = () => {
    return {
      total: userReports.length,
      verified: userReports.filter(r => r.status === 'verified').length,
      pending: userReports.filter(r => r.status === 'pending').length,
      rejected: userReports.filter(r => r.status === 'rejected').length,
    };
  };

  const stats = getReportStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {authState.user?.name}
              </h1>
              <p className="text-gray-600">{authState.user?.email}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Read Only)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={authState.user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      {...register('address')}
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Alert Subscriptions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Bell className="inline h-4 w-4 mr-1" />
                    Alert Subscriptions
                  </label>
                  <div className="space-y-3">
                    {alertTypes.map((alertType) => (
                      <div key={alertType.value} className="flex items-start space-x-3">
                        <div className="flex items-center h-5">
                          <input
                            {...register('alertSubscriptions')}
                            type="checkbox"
                            value={alertType.value}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <label className="text-sm font-medium text-gray-900">
                            {alertType.label}
                          </label>
                          <p className="text-xs text-gray-600">{alertType.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Report Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                  <div className="text-sm text-gray-600">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              My Reports
            </h3>

            {reportsLoading ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Loading your reports...</p>
              </div>
            ) : userReports.length > 0 ? (
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full mt-3 ${getSeverityColor(report.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900 capitalize">
                          {report.type} Hazard
                        </h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                          <span className="ml-1">{report.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {report.description.length > 200 
                          ? `${report.description.substring(0, 200)}...` 
                          : report.description
                        }
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{report.location.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                      {report.aiVerification && (
                        <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                          <div className="text-xs text-gray-600">
                            <strong>AI Score:</strong> {report.aiVerification.score}/100
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {report.aiVerification.reasons.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h4>
                <p className="text-gray-600 mb-4">
                  You haven't submitted any hazard reports yet.
                </p>
                <motion.a
                  href="/report"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report a Hazard</span>
                </motion.a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;