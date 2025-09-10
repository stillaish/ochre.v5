import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ChevronUp, ChevronDown } from 'lucide-react';

const EmergencyContacts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyNumbers = [
    {
      service: 'Police',
      number: '100',
      description: 'For any emergency requiring police assistance',
    },
    {
      service: 'Fire Brigade',
      number: '101',
      description: 'Fire emergencies and rescue operations',
    },
    {
      service: 'Ambulance',
      number: '108',
      description: 'Medical emergencies and ambulance services',
    },
    {
      service: 'Disaster Helpline',
      number: '1078',
      description: 'National disaster management helpline',
    },
    {
      service: 'Women Helpline',
      number: '1091',
      description: 'Women in distress helpline',
    },
    {
      service: 'Child Helpline',
      number: '1098',
      description: 'Child rescue and emergency services',
    },
  ];

  const handleCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="bg-white border-t-2 border-red-200 shadow-2xl max-h-96 overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                🚨 Emergency Contacts - India
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyNumbers.map((contact) => (
                  <motion.button
                    key={contact.number}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCall(contact.number)}
                    className="flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-gray-900">
                          {contact.service}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {contact.description}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {contact.number}
                    </div>
                  </motion.button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center mt-4">
                Tap any number to call immediately. These numbers work across India.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 flex items-center justify-center space-x-2 transition-colors ${
          isOpen ? 'rounded-none' : 'rounded-t-lg'
        }`}
      >
        <Phone className="h-5 w-5" />
        <span className="font-semibold">Emergency Numbers</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <ChevronUp className="h-5 w-5" />
        )}
      </motion.button>
    </div>
  );
};

export default EmergencyContacts;