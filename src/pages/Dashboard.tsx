import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Thermometer, Wind, Droplets, Eye, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWeather } from '../contexts/WeatherContext';
import { useNotification } from '../contexts/NotificationContext';
import HazardMap from '../components/HazardMap';
import axios from 'axios';

interface RecentHazard {
  id: string;
  type: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  status: string;
  createdAt: string;
  severity: string;
}

const Dashboard = () => {
  const { state: authState } = useAuth();
  const { state: weatherState, fetchWeather, fetchAlerts } = useWeather();
  const { addNotification } = useNotification();
  const [recentHazards, setRecentHazards] = useState<RecentHazard[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    myReports: 0,
    verifiedReports: 0,
    pendingReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.user) {
      fetchDashboardData();
      // Fetch weather for user's location
      const [lng, lat] = authState.user.location.coordinates;
      fetchWeather(lat, lng);
      fetchAlerts(lat, lng);
    }
  }, [authState.user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent hazards
      const hazardsResponse = await axios.get('http://localhost:3001/api/hazards', {
        params: { limit: 10, status: 'all' }
      });
      setRecentHazards(hazardsResponse.data.hazards || []);

      // Fetch user's reports for stats
      const myReportsResponse = await axios.get('http://localhost:3001/api/hazards/my-reports', {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const myReports = myReportsResponse.data.reports || [];

      setStats({
        totalReports: hazardsResponse.data.count || 0,
        myReports: myReports.length,
        verifiedReports: myReports.filter((r: any) => r.status === 'verified').length,
        pendingReports: myReports.filter((r: any) => r.status === 'pending').length,
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      addNotification({
        type: 'error',
        title: 'Dashboard Error',
        message: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {authState.user?.name}
          </h1>
          <p className="text-gray-600">
            Your disaster management dashboard - stay informed and stay safe
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Verified</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">My Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.myReports}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Thermometer className="h-5 w-5 text-red-600 mr-2" />
                Weather Information
              </h3>
              
              {weatherState.weather ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">{weatherState.weather.location.name}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {weatherState.weather.current.temperature}°C
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      {weatherState.weather.current.description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Thermometer className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Feels like {weatherState.weather.current.feelsLike}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 text-blue-400 mr-2" />
                      <span>{weatherState.weather.current.humidity}% humidity</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{weatherState.weather.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{Math.round(weatherState.weather.current.visibility / 1000)} km</span>
                    </div>
                  </div>

                  {weatherState.alerts.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-amber-800 mb-2">
                        Weather Alerts
                      </h4>
                      {weatherState.alerts.slice(0, 2).map((alert) => (
                        <div key={alert.id} className="text-xs text-amber-700 mb-1">
                          {alert.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Loading weather data...</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Hazards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                Recent Hazard Reports
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentHazards.length > 0 ? (
                  recentHazards.map((hazard) => (
                    <div
                      key={hazard.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(hazard.severity)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {hazard.type} Hazard
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(hazard.status)}`}>
                            {hazard.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {hazard.description.length > 100 
                            ? `${hazard.description.substring(0, 100)}...` 
                            : hazard.description
                          }
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="mr-4">{hazard.location.address}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(hazard.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No recent hazard reports</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              Live Hazard Map
            </h3>
            <HazardMap 
              height="600px" 
              center={authState.user ? [
                authState.user.location.coordinates[1], 
                authState.user.location.coordinates[0]
              ] : undefined}
              zoom={6}
              showFilters={true}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;