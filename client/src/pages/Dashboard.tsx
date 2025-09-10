import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  CloudRain, 
  Phone, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hazardAPI, weatherAPI } from '../services/api';
import { Hazard, WeatherData, WeatherAlert } from '../types';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent hazards
      const hazardsResponse = await hazardAPI.getAll({ limit: 5 });
      setHazards(hazardsResponse.data.hazards || []);

      // Fetch weather data if user has location
      if (user?.location) {
        try {
          const weatherResponse = await weatherAPI.getCurrent(
            user.location.latitude,
            user.location.longitude
          );
          setWeather(weatherResponse.data.weather);
        } catch (error) {
          console.error('Failed to fetch weather:', error);
        }
      }

      // Fetch weather alerts
      try {
        const alertsResponse = await weatherAPI.getAlerts();
        setAlerts(alertsResponse.data.alerts || []);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
      default:
        return 'bg-green-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your area and across India.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hazards</p>
                <p className="text-2xl font-bold text-gray-900">{hazards.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hazards.filter(h => h.status === 'verified').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CloudRain className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Your Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {hazards.filter(h => h.userId === user?.id).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Hazards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Hazards</h2>
                <Link
                  to="/report"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Report New
                </Link>
              </div>
              <div className="p-6">
                {hazards.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hazards reported recently</p>
                    <Link
                      to="/report"
                      className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                      Be the first to report a hazard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hazards.map((hazard) => (
                      <div key={hazard.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hazard.status)}`}>
                                {getStatusIcon(hazard.status)}
                                <span className="ml-1 capitalize">{hazard.status}</span>
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getSeverityColor(hazard.severity)}`}>
                                {hazard.severity}
                              </span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 capitalize mb-1">
                              {hazard.type} - {hazard.location.address}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{hazard.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {new Date(hazard.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <Link
                            to={`/hazards/${hazard.id}`}
                            className="ml-4 text-primary-600 hover:text-primary-700"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Weather & Alerts Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Weather Card */}
            {weather && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Current Weather</h2>
                </div>
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {Math.round(weather.temperature)}°C
                    </div>
                    <div className="text-sm text-gray-600 capitalize mb-4">
                      {weather.description}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Feels like</p>
                        <p className="font-medium">{Math.round(weather.feelsLike)}°C</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Humidity</p>
                        <p className="font-medium">{weather.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Wind</p>
                        <p className="font-medium">{weather.windSpeed} m/s</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Visibility</p>
                        <p className="font-medium">{weather.visibility / 1000} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Weather Alerts</h2>
              </div>
              <div className="p-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-4">
                    <CloudRain className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No active weather alerts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="border border-orange-200 bg-orange-50 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="p-1 bg-orange-100 rounded">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-orange-900">
                              {alert.title}
                            </h3>
                            <p className="text-xs text-orange-700 mt-1">
                              {alert.description}
                            </p>
                            <p className="text-xs text-orange-600 mt-2">
                              Valid until: {new Date(alert.validUntil).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  to="/report"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium">Report Hazard</span>
                </Link>
                <Link
                  to="/map"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium">View Map</span>
                </Link>
                <Link
                  to="/alerts"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CloudRain className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium">View All Alerts</span>
                </Link>
                <Link
                  to="/emergency"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-5 h-5 text-orange-500 mr-3" />
                  <span className="text-sm font-medium">Emergency Numbers</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
