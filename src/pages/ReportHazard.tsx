import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { AlertTriangle, MapPin, Calendar, User, Phone, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import axios from 'axios';

interface HazardReportForm {
  type: string;
  description: string;
  severity: string;
  location: string;
  latitude: string;
  longitude: string;
  affectedPeople: number;
  contactPhone: string;
  contactEmail: string;
  isEmergency: boolean;
}

const ReportHazard = () => {
  const { state: authState } = useAuth();
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<HazardReportForm>();

  const watchedType = watch('type');
  const watchedSeverity = watch('severity');

  const hazardTypes = [
    { value: 'earthquake', label: 'Earthquake', icon: '🌍' },
    { value: 'flood', label: 'Flood', icon: '🌊' },
    { value: 'cyclone', label: 'Cyclone/Hurricane', icon: '🌪️' },
    { value: 'fire', label: 'Fire', icon: '🔥' },
    { value: 'landslide', label: 'Landslide', icon: '⛰️' },
    { value: 'drought', label: 'Drought', icon: '🏜️' },
    { value: 'storm', label: 'Storm', icon: '⛈️' },
    { value: 'other', label: 'Other', icon: '⚠️' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', description: 'Minor impact, no immediate danger', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', description: 'Moderate impact, some precautions needed', color: 'text-yellow-600' },
    { value: 'high', label: 'High', description: 'Significant impact, immediate action required', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', description: 'Severe impact, emergency response needed', color: 'text-red-600' },
  ];

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setValue('latitude', latitude.toString());
          setValue('longitude', longitude.toString());
          setLocationLoading(false);
          addNotification({
            type: 'success',
            title: 'Location Retrieved',
            message: 'Your current location has been captured',
          });
        },
        (error) => {
          setLocationLoading(false);
          addNotification({
            type: 'error',
            title: 'Location Error',
            message: 'Unable to get your current location. Please enter manually.',
          });
        }
      );
    } else {
      setLocationLoading(false);
      addNotification({
        type: 'error',
        title: 'Geolocation Not Supported',
        message: 'Your browser does not support geolocation',
      });
    }
  };

  const onSubmit = async (data: HazardReportForm) => {
    try {
      setLoading(true);
      
      const hazardData = {
        type: data.type,
        description: data.description,
        severity: data.severity,
        location: {
          type: 'Point',
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
          address: data.location,
        },
        affectedPeople: data.affectedPeople || 0,
        contactInfo: {
          phone: data.contactPhone,
          email: data.contactEmail,
        },
        isEmergency: data.isEmergency || false,
      };

      const response = await axios.post('http://localhost:3001/api/hazards', hazardData, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });

      addNotification({
        type: 'success',
        title: 'Report Submitted',
        message: `Your ${data.type} report has been submitted for verification`,
      });

      // Show AI verification results
      if (response.data.hazard.aiVerification) {
        const verification = response.data.hazard.aiVerification;
        addNotification({
          type: verification.status === 'verified' ? 'success' : 
                verification.status === 'rejected' ? 'error' : 'warning',
          title: `AI Verification: ${verification.status}`,
          message: `Confidence Score: ${verification.score}/100. ${verification.reasons.join(', ')}`,
          duration: 10000,
        });
      }

      // Reset form or redirect
      // You might want to redirect to dashboard or clear the form
      
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: error.response?.data?.message || 'Failed to submit hazard report',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Report a Hazard
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help keep your community safe by reporting disasters, hazards, and emergencies. 
              Your report will be verified by our AI system and shared with relevant authorities.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded-xl shadow-lg space-y-8"
        >
          {/* Hazard Type */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Type of Hazard *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hazardTypes.map((type) => (
                <div key={type.value}>
                  <input
                    {...register('type', { required: 'Please select a hazard type' })}
                    type="radio"
                    value={type.value}
                    id={type.value}
                    className="sr-only"
                  />
                  <label
                    htmlFor={type.value}
                    className={`cursor-pointer flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                      watchedType === type.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="text-sm font-medium text-center">{type.label}</span>
                  </label>
                </div>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Provide detailed information about what you observed. Be specific about what happened, when, and any immediate impacts.
            </p>
            <textarea
              {...register('description', {
                required: 'Please provide a description',
                minLength: { value: 20, message: 'Description must be at least 20 characters' },
                maxLength: { value: 1000, message: 'Description must be less than 1000 characters' },
              })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Describe the hazard in detail..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-4">
              Severity Level *
            </label>
            <div className="space-y-3">
              {severityLevels.map((level) => (
                <div key={level.value}>
                  <input
                    {...register('severity', { required: 'Please select severity level' })}
                    type="radio"
                    value={level.value}
                    id={level.value}
                    className="sr-only"
                  />
                  <label
                    htmlFor={level.value}
                    className={`cursor-pointer flex items-start p-4 border-2 rounded-lg transition-colors ${
                      watchedSeverity === level.value
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className={`font-semibold ${level.color}`}>{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            {errors.severity && (
              <p className="mt-2 text-sm text-red-600">{errors.severity.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="location" className="block text-lg font-semibold text-gray-900 mb-2">
                Location *
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  {...register('location', { required: 'Please provide location' })}
                  type="text"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter address or landmark"
                />
                <motion.button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <MapPin className="h-4 w-4" />
                  <span>{locationLoading ? 'Getting...' : 'Current'}</span>
                </motion.button>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude *
              </label>
              <input
                {...register('latitude', { required: 'Latitude is required' })}
                type="number"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., 28.7041"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude *
              </label>
              <input
                {...register('longitude', { required: 'Longitude is required' })}
                type="number"
                step="any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="e.g., 77.1025"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="affectedPeople" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Affected People
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('affectedPeople', { min: 0 })}
                  type="number"
                  min="0"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Number of people affected"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('contactPhone')}
                  type="tel"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Your contact number"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              {...register('contactEmail')}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Your email address"
            />
          </div>

          {/* Emergency Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              {...register('isEmergency')}
              type="checkbox"
              id="isEmergency"
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isEmergency" className="text-sm">
              <span className="font-medium text-gray-900">This is an emergency situation</span>
              <p className="text-gray-600">
                Check this if immediate emergency response is required (life-threatening situation, active disaster, etc.)
              </p>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg text-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Submitting Report...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5" />
                  <span>Submit Hazard Report</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your report will be processed through our AI verification system 
              to check for accuracy and relevance. Verified reports will be shared with relevant 
              authorities and displayed on our public map to help keep communities informed.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default ReportHazard;