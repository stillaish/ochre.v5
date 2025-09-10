import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { hazardAPI } from '../services/api';
import { Hazard } from '../types';
import toast from 'react-hot-toast';

interface HazardFormData {
  type: 'flood' | 'fire' | 'earthquake' | 'landslide' | 'storm' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
}

const ReportHazard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number, address: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{verified: boolean, reason: string} | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<HazardFormData>({
    defaultValues: {
      type: 'other',
      severity: 'medium',
      images: []
    }
  });

  const selectedType = watch('type');

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          setValue('location', {
            latitude,
            longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          });
          toast.success('Location detected successfully!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data: HazardFormData) => {
    try {
      setIsSubmitting(true);
      setVerificationResult(null);

      if (!userLocation) {
        toast.error('Please get your location first');
        return;
      }

      const hazardData = {
        ...data,
        location: userLocation
      };

      const response = await hazardAPI.create(hazardData);
      
      if (response.data.hazard) {
        setVerificationResult(response.data.verification);
        
        if (response.data.verification?.verified) {
          toast.success('Hazard report submitted and verified successfully!');
        } else {
          toast.error(`Hazard report submitted but rejected: ${response.data.verification?.reason}`);
        }
        
        // Redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Failed to submit hazard report:', error);
      const message = error.response?.data?.message || 'Failed to submit hazard report';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hazardTypes = [
    { value: 'flood', label: 'Flood', icon: '🌊', description: 'Water overflow or accumulation' },
    { value: 'fire', label: 'Fire', icon: '🔥', description: 'Fire incidents or wildfires' },
    { value: 'earthquake', label: 'Earthquake', icon: '🌍', description: 'Seismic activity or ground shaking' },
    { value: 'landslide', label: 'Landslide', icon: '⛰️', description: 'Land movement or rock falls' },
    { value: 'storm', label: 'Storm', icon: '⛈️', description: 'Severe weather conditions' },
    { value: 'other', label: 'Other', icon: '⚠️', description: 'Other hazards not listed above' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600', description: 'Minor impact, no immediate danger' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', description: 'Moderate impact, caution advised' },
    { value: 'high', label: 'High', color: 'text-orange-600', description: 'Significant impact, avoid area' },
    { value: 'critical', label: 'Critical', color: 'text-red-600', description: 'Severe impact, immediate danger' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report a Hazard</h1>
              <p className="text-gray-600 mt-1">
                Help keep your community safe by reporting hazards in your area.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Hazard Details</h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Hazard Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Hazard Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hazardTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedType === type.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          {...register('type', { required: 'Please select a hazard type' })}
                          type="radio"
                          value={type.value}
                          className="sr-only"
                        />
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{type.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {type.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {type.description}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.type && (
                    <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                {/* Severity Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Severity Level *
                  </label>
                  <div className="space-y-2">
                    {severityLevels.map((severity) => (
                      <label
                        key={severity.value}
                        className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          {...register('severity', { required: 'Please select severity level' })}
                          type="radio"
                          value={severity.value}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${severity.color}`}>
                              {severity.label}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {severity.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.severity && (
                    <p className="mt-2 text-sm text-red-600">{errors.severity.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', {
                      required: 'Please provide a description',
                      minLength: {
                        value: 10,
                        message: 'Description must be at least 10 characters'
                      },
                      maxLength: {
                        value: 500,
                        message: 'Description must be less than 500 characters'
                      }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Describe the hazard in detail. Include what you observed, when it happened, and any immediate dangers..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get My Location
                    </button>
                    {userLocation && (
                      <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                        {userLocation.address}
                      </div>
                    )}
                  </div>
                  {!userLocation && (
                    <p className="mt-2 text-sm text-gray-500">
                      Click "Get My Location" to automatically detect your current location
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || !userLocation}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Report...
                      </div>
                    ) : (
                      'Submit Hazard Report'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Verification Result & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Verification Result */}
            {verificationResult && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Verification Result</h3>
                </div>
                <div className="p-6">
                  <div className={`flex items-center p-4 rounded-lg ${
                    verificationResult.verified 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {verificationResult.verified ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mr-3" />
                    )}
                    <div>
                      <p className={`font-medium ${
                        verificationResult.verified ? 'text-green-900' : 'text-red-900'
                      }`}>
                        {verificationResult.verified ? 'Verified' : 'Rejected'}
                      </p>
                      <p className={`text-sm ${
                        verificationResult.verified ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {verificationResult.reason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Verification Info */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">AI Verification</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Recent Reports</p>
                      <p className="text-xs text-gray-600">Reports within 24 hours are prioritized</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Location Check</p>
                      <p className="text-xs text-gray-600">Must be within India's boundaries</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Content Analysis</p>
                      <p className="text-xs text-gray-600">Checks for relevant and accurate information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-900 mb-2">
                    Emergency Situation?
                  </h3>
                  <p className="text-sm text-red-700 mb-3">
                    If this is an emergency requiring immediate assistance, please call:
                  </p>
                  <div className="space-y-1 text-sm text-red-800">
                    <p><strong>Police:</strong> 100</p>
                    <p><strong>Fire:</strong> 101</p>
                    <p><strong>Ambulance:</strong> 102</p>
                    <p><strong>Disaster Helpline:</strong> 108</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportHazard;
