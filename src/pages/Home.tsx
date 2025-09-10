import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, AlertTriangle, Map, Phone, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HazardMap from '../components/HazardMap';

const Home = () => {
  const { state } = useAuth();

  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Hazard Reporting',
      description: 'Report disasters and hazards instantly with AI verification',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Map,
      title: 'Interactive Hazard Maps',
      description: 'View live hazard locations and safe zones across India',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      title: 'Weather Monitoring',
      description: 'Get real-time weather data and severe weather alerts',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Phone,
      title: 'Emergency Contacts',
      description: 'Quick access to Indian emergency services and helplines',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const stats = [
    { label: 'Verified Reports', value: '1,247', icon: CheckCircle },
    { label: 'Active Users', value: '5,892', icon: Users },
    { label: 'Response Time', value: '<5 min', icon: Clock },
    { label: 'Coverage', value: '28 States', icon: Map },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <Shield className="h-20 w-20 mx-auto mb-4 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              DisasterWatch India
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Protecting communities through real-time disaster monitoring, 
              AI-powered verification, and rapid emergency response
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-x-4"
          >
            {state.user ? (
              <Link
                to="/dashboard"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors inline-flex items-center space-x-2"
              >
                <Map className="h-5 w-5" />
                <span>View Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors inline-flex items-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
                <Link
                  to="/alerts"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors inline-flex items-center space-x-2"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>View Alerts</span>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <Icon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Disaster Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology and community-driven reporting to keep India safe
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className={`${feature.bgColor} p-3 rounded-lg inline-block mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Map Preview Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="py-20 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Hazard Monitoring
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real-time visualization of verified hazards and safe zones across India
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <HazardMap height="500px" showFilters={true} />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white"
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Help Keep India Safe?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of citizens contributing to disaster preparedness and response
          </p>
          {!state.user && (
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors inline-flex items-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span>Sign Up Now</span>
            </Link>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;