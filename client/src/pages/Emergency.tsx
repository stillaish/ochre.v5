import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  AlertTriangle, 
  Shield, 
  Heart, 
  Users, 
  Baby,
  UserCheck,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { weatherAPI } from '../services/api';
import { EmergencyNumbers } from '../types';
import toast from 'react-hot-toast';

const Emergency: React.FC = () => {
  const [emergencyNumbers, setEmergencyNumbers] = useState<EmergencyNumbers | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyNumbers();
  }, []);

  const fetchEmergencyNumbers = async () => {
    try {
      setLoading(true);
      const response = await weatherAPI.getEmergencyNumbers();
      setEmergencyNumbers(response.data.emergencyNumbers);
    } catch (error) {
      console.error('Failed to fetch emergency numbers:', error);
      toast.error('Failed to load emergency numbers');
    } finally {
      setLoading(false);
    }
  };

  const emergencyServices = [
    {
      name: 'Police',
      number: emergencyNumbers?.police || '100',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'For crimes, accidents, and law enforcement',
      available: '24/7'
    },
    {
      name: 'Fire Department',
      number: emergencyNumbers?.fire || '101',
      icon: AlertTriangle,
      color: 'bg-red-500',
      description: 'For fires, rescue operations, and emergencies',
      available: '24/7'
    },
    {
      name: 'Ambulance',
      number: emergencyNumbers?.ambulance || '102',
      icon: Heart,
      color: 'bg-green-500',
      description: 'For medical emergencies and health crises',
      available: '24/7'
    },
    {
      name: 'Disaster Helpline',
      number: emergencyNumbers?.disasterHelpline || '108',
      icon: Users,
      color: 'bg-orange-500',
      description: 'For natural disasters and major emergencies',
      available: '24/7'
    },
    {
      name: 'Women Helpline',
      number: emergencyNumbers?.womenHelpline || '1091',
      icon: UserCheck,
      color: 'bg-pink-500',
      description: 'For women in distress and safety concerns',
      available: '24/7'
    },
    {
      name: 'Child Helpline',
      number: emergencyNumbers?.childHelpline || '1098',
      icon: Baby,
      color: 'bg-purple-500',
      description: 'For children in need of help and protection',
      available: '24/7'
    },
    {
      name: 'Senior Citizen Helpline',
      number: emergencyNumbers?.seniorCitizenHelpline || '14567',
      icon: UserCheck,
      color: 'bg-indigo-500',
      description: 'For senior citizens requiring assistance',
      available: '24/7'
    }
  ];

  const handleCall = (number: string, service: string) => {
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${number}`;
    } else {
      navigator.clipboard.writeText(number).then(() => {
        toast.success(`${service} number copied to clipboard: ${number}`);
      }).catch(() => {
        toast.error('Failed to copy number to clipboard');
      });
    }
  };

  const emergencyTips = [
    {
      title: 'Stay Calm',
      description: 'Take deep breaths and assess the situation calmly before taking action.',
      icon: '🧘'
    },
    {
      title: 'Call for Help',
      description: 'Immediately call the appropriate emergency number for your situation.',
      icon: '📞'
    },
    {
      title: 'Provide Location',
      description: 'Give clear details about your location and the nature of the emergency.',
      icon: '📍'
    },
    {
      title: 'Follow Instructions',
      description: 'Listen carefully to the operator and follow their guidance.',
      icon: '👂'
    },
    {
      title: 'Stay Safe',
      description: 'Prioritize your safety and the safety of others around you.',
      icon: '🛡️'
    },
    {
      title: 'Stay Connected',
      description: 'Keep your phone charged and stay in contact with emergency services.',
      icon: '📱'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergency information...</p>
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
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Phone className="w-7 h-7 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Emergency Services</h1>
              <p className="text-gray-600 mt-1">
                Quick access to emergency numbers and safety information for India
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Numbers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mr-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-500">{service.available}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">{service.number}</div>
                      <button
                        onClick={() => handleCall(service.number, service.name)}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Emergency Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{tip.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Disaster Preparedness */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Disaster Preparedness
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Know Your Location</h4>
                  <p className="text-sm text-gray-600">Always be aware of your exact location and nearby landmarks.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Emergency Kit</h4>
                  <p className="text-sm text-gray-600">Keep a basic emergency kit with water, food, and first aid supplies.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Communication Plan</h4>
                  <p className="text-sm text-gray-600">Have a family communication plan and emergency contacts ready.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/report"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                <span className="text-sm font-medium">Report a Hazard</span>
                <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
              </a>
              <a
                href="/map"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-sm font-medium">View Hazard Map</span>
                <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
              </a>
              <a
                href="/alerts"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium">Check Weather Alerts</span>
                <ExternalLink className="w-4 h-4 ml-auto text-gray-400" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Important Notice
              </h3>
              <p className="text-red-700 mb-3">
                These emergency numbers are for genuine emergencies only. Misuse of emergency services 
                is a criminal offense and can delay help for those who truly need it.
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Only call emergency numbers when there is a real emergency</li>
                <li>• Provide accurate information about your location and the situation</li>
                <li>• Stay on the line until the operator tells you to hang up</li>
                <li>• Keep emergency numbers saved in your phone for quick access</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;
