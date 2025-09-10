import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Shield, 
  CloudRain, 
  Users,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: AlertTriangle,
      title: 'Report Hazards',
      description: 'Quickly report natural disasters, accidents, and other hazards in your area.',
      color: 'text-red-500'
    },
    {
      icon: MapPin,
      title: 'Interactive Maps',
      description: 'View real-time hazard locations and safe zones on interactive maps.',
      color: 'text-blue-500'
    },
    {
      icon: CloudRain,
      title: 'Weather Alerts',
      description: 'Get instant weather warnings and forecasts for your location.',
      color: 'text-green-500'
    },
    {
      icon: Phone,
      title: 'Emergency Services',
      description: 'Quick access to emergency numbers and disaster helplines.',
      color: 'text-orange-500'
    },
    {
      icon: Shield,
      title: 'AI Verification',
      description: 'Advanced AI automatically verifies hazard reports for accuracy.',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Community Safety',
      description: 'Join a community dedicated to keeping India safe and informed.',
      color: 'text-indigo-500'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Reports Submitted' },
    { number: '95%', label: 'AI Accuracy' },
    { number: '24/7', label: 'Monitoring' },
    { number: 'All India', label: 'Coverage' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Keep India Safe
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Report hazards, get weather alerts, and access emergency services 
              to help protect your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/dashboard" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link to="/map" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                    View Map
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We Keep You Safe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to stay informed and safe.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className={`w-12 h-12 ${feature.color} mb-4`}>
                    <Icon className="w-8 h-8" />
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
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens working together to keep India safe. 
              Your report could save lives.
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  Start Reporting
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/emergency" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                  Emergency Numbers
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">HazardApp</span>
              </div>
              <p className="text-gray-400">
                Keeping India safe through community reporting and AI verification.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/map" className="text-gray-400 hover:text-white transition-colors">Map</Link></li>
                <li><Link to="/emergency" className="text-gray-400 hover:text-white transition-colors">Emergency</Link></li>
                {user && (
                  <>
                    <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                    <li><Link to="/report" className="text-gray-400 hover:text-white transition-colors">Report</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Police: 100</li>
                <li>Fire: 101</li>
                <li>Ambulance: 102</li>
                <li>Disaster: 108</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                For support and inquiries, please contact us through the app.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HazardApp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
