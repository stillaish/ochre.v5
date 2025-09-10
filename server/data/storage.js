// In-memory data storage for users and hazards
let users = [];
let hazards = [];
let weatherAlerts = [];

// Sample emergency numbers for India
const emergencyNumbers = {
  police: '100',
  fire: '101',
  ambulance: '102',
  disasterHelpline: '108',
  womenHelpline: '1091',
  childHelpline: '1098',
  seniorCitizenHelpline: '14567'
};

// Sample initial data
const initializeData = () => {
  // Add a sample admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  users.push({
    id: '1',
    email: 'admin@hazardapp.com',
    password: hashedPassword,
    name: 'Admin User',
    phone: '+91-9876543210',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'New Delhi, India'
    },
    createdAt: new Date().toISOString(),
    isAdmin: true
  });

  // Add sample hazards
  hazards.push({
    id: '1',
    userId: '1',
    type: 'flood',
    description: 'Heavy flooding in low-lying areas near Yamuna river',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'New Delhi, India'
    },
    severity: 'high',
    status: 'verified',
    images: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    verifiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    verifiedBy: 'AI_VERIFICATION'
  });

  hazards.push({
    id: '2',
    userId: '1',
    type: 'fire',
    description: 'Building fire reported in commercial area',
    location: {
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Mumbai, India'
    },
    severity: 'medium',
    status: 'pending',
    images: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    verifiedAt: null,
    verifiedBy: null
  });

  // Add sample weather alerts
  weatherAlerts.push({
    id: '1',
    type: 'cyclone',
    title: 'Cyclone Warning',
    description: 'Cyclone approaching coastal areas of Odisha',
    severity: 'high',
    location: {
      latitude: 20.2961,
      longitude: 85.8245,
      address: 'Odisha, India'
    },
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    createdAt: new Date().toISOString()
  });

  console.log('📊 Data initialized with sample users, hazards, and alerts');
};

// User management functions
const addUser = (userData) => {
  const newUser = {
    id: (users.length + 1).toString(),
    ...userData,
    createdAt: new Date().toISOString(),
    isAdmin: false
  };
  users.push(newUser);
  return newUser;
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  return users.find(user => user.id === id);
};

const updateUser = (id, updates) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  }
  return null;
};

// Hazard management functions
const addHazard = (hazardData) => {
  const newHazard = {
    id: (hazards.length + 1).toString(),
    ...hazardData,
    createdAt: new Date().toISOString(),
    status: 'pending',
    verifiedAt: null,
    verifiedBy: null
  };
  hazards.push(newHazard);
  return newHazard;
};

const getAllHazards = () => {
  return hazards.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getHazardsByUser = (userId) => {
  return hazards.filter(hazard => hazard.userId === userId);
};

const updateHazard = (id, updates) => {
  const hazardIndex = hazards.findIndex(hazard => hazard.id === id);
  if (hazardIndex !== -1) {
    hazards[hazardIndex] = { ...hazards[hazardIndex], ...updates };
    return hazards[hazardIndex];
  }
  return null;
};

const getHazardById = (id) => {
  return hazards.find(hazard => hazard.id === id);
};

// Weather alert management functions
const addWeatherAlert = (alertData) => {
  const newAlert = {
    id: (weatherAlerts.length + 1).toString(),
    ...alertData,
    createdAt: new Date().toISOString()
  };
  weatherAlerts.push(newAlert);
  return newAlert;
};

const getActiveWeatherAlerts = () => {
  const now = new Date();
  return weatherAlerts.filter(alert => 
    new Date(alert.validFrom) <= now && new Date(alert.validUntil) >= now
  );
};

const getAllWeatherAlerts = () => {
  return weatherAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// AI Verification logic
const verifyHazard = (hazard) => {
  const now = new Date();
  const hazardTime = new Date(hazard.createdAt);
  const hoursDiff = (now - hazardTime) / (1000 * 60 * 60);

  // Check if hazard is recent (within 24 hours)
  if (hoursDiff > 24) {
    return { verified: false, reason: 'Hazard report is too old (more than 24 hours)' };
  }

  // Check if location is within India (approximate bounds)
  const { latitude, longitude } = hazard.location;
  if (latitude < 6.0 || latitude > 37.0 || longitude < 68.0 || longitude > 97.0) {
    return { verified: false, reason: 'Location is outside India' };
  }

  // Check for duplicate reports from same user within 1 hour
  const recentHazards = hazards.filter(h => 
    h.userId === hazard.userId && 
    h.type === hazard.type &&
    Math.abs(new Date(h.createdAt) - hazardTime) < 60 * 60 * 1000 // 1 hour
  );
  
  if (recentHazards.length > 0) {
    return { verified: false, reason: 'Duplicate report from same user' };
  }

  // Check for irrelevant keywords
  const irrelevantKeywords = ['test', 'fake', 'spam', 'joke', 'prank'];
  const description = hazard.description.toLowerCase();
  if (irrelevantKeywords.some(keyword => description.includes(keyword))) {
    return { verified: false, reason: 'Report contains irrelevant content' };
  }

  // If all checks pass, verify the hazard
  return { verified: true, reason: 'Hazard verified by AI' };
};

module.exports = {
  initializeData,
  // User functions
  addUser,
  findUserByEmail,
  findUserById,
  updateUser,
  // Hazard functions
  addHazard,
  getAllHazards,
  getHazardsByUser,
  updateHazard,
  getHazardById,
  verifyHazard,
  // Weather alert functions
  addWeatherAlert,
  getActiveWeatherAlerts,
  getAllWeatherAlerts,
  // Emergency numbers
  emergencyNumbers
};
