import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Thermometer, Wind, Droplets, Clock, MapPin, RefreshCw } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import HazardMap from '../components/HazardMap';
import axios from 'axios';

interface HazardAlert {
  id: string;
  type: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  severity: string;
  status: string;
  createdAt: string;
  isEmergency: boolean;
}

const Alerts = () => {
  const { state: weatherState, fetchAlerts } = useWeather();
  const [hazardAlerts, setHazardAlerts] = useState<HazardAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 28.7041,
    lng: 77.1025,
    name: 'Delhi, India'
  });

  useEffect(() => {
    fetchAllAlerts();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAllAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const fetchAllAlerts = async () => {
    try {
      setLoading(true);
      
      // Fetch weather alerts
      await fetchAlerts(selectedLocation.lat, selectedLocation.lng);
      
      // Fetch hazard alerts (high severity and emergency ones)
      const hazardResponse = await axios.get('http://localhost:3001/api/hazards', {
        params: {
          status: 'verified',
          limit: 20,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          radius: 100000, // 100km radius
        }
      });
      
      // Filter for high severity and emergency hazards
      const filteredHazards = hazardResponse.data.hazards.filter((hazard: HazardAlert) => 
        hazard.severity === 'high' || hazard.severity === 'critical' || hazard.isEmergency
      );
      
      setHazardAlerts(filteredHazards);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching alerts:', error);
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'heat_wave':
        return <Thermometer className="h-5 w-5 text-red-600" />;
      case 'high_wind':
        return <Wind className="h-5 w-5 text-blue-600" />;
      case 'heavy_rain':
        return <Droplets className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
    }
  };

  const getHazardIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      earthquake: '🌍',
      flood: '🌊',
      cyclone: '🌪️',
      fire: '🔥',
      landslide: '⛰️',
      drought: '🏜️',
      storm: '⛈️',
      other: '⚠️',
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-300 text-green-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const majorCities = [
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  ];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Live Alerts & Warnings
              </h1>
              <p className="text-gray-600">
                Real-time weather alerts and hazard warnings for {selectedLocation.name}
              </p>
            </div>
            <motion.button
              onClick={fetchAllAlerts}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Location Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Location</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {majorCities.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedLocation(city)}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  selectedLocation.name === city.name
                    ? 'bg-red-50 border-red-300 text-red-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weather Alerts */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Thermometer className="h-5 w-5 text-red-600 mr-2" />
                Weather Alerts
              </h3>
              
              <div className="space-y-4">
                {weatherState.alerts.length > 0 ? (
                  weatherState.alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-2 ${
                        alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                        alert.severity === 'medium' ? 'bg-amber-50 border-amber-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {alert.title}
                          </h4>
                          <p className="text-sm text-gray-700 mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {formatDate(alert.startTime)} - {formatDate(alert.endTime)}
                            </span>
                          </div>
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No weather alerts for this location</p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Last updated: {lastRefresh.toLocaleTimeString('en-IN')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hazard Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                High Priority Hazard Alerts
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {hazardAlerts.length > 0 ? (
                  hazardAlerts.map((hazard) => (
                    <div
                      key={hazard.id}
                      className={`p-4 rounded-lg border-2 ${getSeverityColor(hazard.severity)}`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getHazardIcon(hazard.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 capitalize">
                              {hazard.type} {hazard.isEmergency && '🚨 EMERGENCY'}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(hazard.severity)}`}>
                              {hazard.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {hazard.description.length > 150 
                              ? `${hazard.description.substring(0, 150)}...` 
                              : hazard.description
                            }
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{hazard.location.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(hazard.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p>No high priority hazard alerts in this area</p>
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
              Alert Locations Map
            </h3>
            <HazardMap 
              height="500px" 
              center={[selectedLocation.lat, selectedLocation.lng]}
              zoom={8}
              showFilters={true}
            />
          </div>
        </motion.div>

        {/* Emergency Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8"
        >
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Guidelines
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-red-800 mb-2">During Alerts:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Stay indoors and avoid unnecessary travel</li>
                  <li>• Keep emergency supplies readily available</li>
                  <li>• Monitor official announcements regularly</li>
                  <li>• Follow local authority instructions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-2">Emergency Contacts:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Police: <strong>100</strong></li>
                  <li>• Fire: <strong>101</strong></li>
                  <li>• Ambulance: <strong>108</strong></li>
                  <li>• Disaster Helpline: <strong>1078</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Alerts;