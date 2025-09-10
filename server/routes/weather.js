const express = require('express');
const axios = require('axios');
const { 
  addWeatherAlert, 
  getActiveWeatherAlerts, 
  getAllWeatherAlerts,
  emergencyNumbers 
} = require('../data/storage');
const { validate, weatherAlertSchema } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get current weather by coordinates
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const weatherData = {
      temperature: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      visibility: response.data.visibility,
      windSpeed: response.data.wind.speed,
      windDirection: response.data.wind.deg,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      location: response.data.name,
      country: response.data.sys.country,
      timestamp: new Date().toISOString()
    };

    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Weather API error:', error);
    if (error.response?.status === 401) {
      res.status(500).json({ message: 'Invalid weather API key' });
    } else if (error.response?.status === 404) {
      res.status(404).json({ message: 'Weather data not found for this location' });
    } else {
      res.status(500).json({ message: 'Failed to fetch weather data' });
    }
  }
});

// Get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { lat, lon, days = 5 } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    // Group forecasts by date and get daily summaries
    const dailyForecasts = {};
    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          hourly: []
        };
      }
      
      dailyForecasts[date].hourly.push({
        time: new Date(item.dt * 1000).toTimeString().slice(0, 5),
        temperature: item.main.temp,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        windSpeed: item.wind.speed
      });
    });

    const forecast = Object.values(dailyForecasts).slice(0, parseInt(days));
    res.json({ forecast });
  } catch (error) {
    console.error('Forecast API error:', error);
    res.status(500).json({ message: 'Failed to fetch weather forecast' });
  }
});

// Get coastal/marine weather data
router.get('/marine', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'Weather API key not configured' });
    }

    // Check if location is near coast (simplified check)
    const isNearCoast = checkIfNearCoast(parseFloat(lat), parseFloat(lon));
    
    if (!isNearCoast) {
      return res.json({ 
        message: 'Location is not near the coast',
        marine: null 
      });
    }

    // For coastal areas, get additional marine data
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const marineData = {
      windSpeed: response.data.wind.speed,
      windDirection: response.data.wind.deg,
      windGust: response.data.wind.gust || 0,
      visibility: response.data.visibility,
      seaLevel: response.data.main.sea_level,
      waveHeight: estimateWaveHeight(response.data.wind.speed), // Estimated
      seaConditions: getSeaConditions(response.data.wind.speed),
      tideInfo: 'Tide information not available in free API',
      timestamp: new Date().toISOString()
    };

    res.json({ marine: marineData });
  } catch (error) {
    console.error('Marine weather error:', error);
    res.status(500).json({ message: 'Failed to fetch marine weather data' });
  }
});

// Get active weather alerts
router.get('/alerts', (req, res) => {
  try {
    const { location } = req.query;
    let alerts = getActiveWeatherAlerts();

    // Filter by location if provided
    if (location) {
      const [lat, lon] = location.split(',').map(Number);
      alerts = alerts.filter(alert => 
        isWithinRadius(alert.location.latitude, alert.location.longitude, lat, lon, 100) // 100km radius
      );
    }

    res.json({ alerts });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create weather alert (admin only)
router.post('/alerts', authenticateToken, requireAdmin, validate(weatherAlertSchema), (req, res) => {
  try {
    const alert = addWeatherAlert(req.body);
    res.status(201).json({
      message: 'Weather alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all weather alerts (admin only)
router.get('/admin/alerts', authenticateToken, requireAdmin, (req, res) => {
  try {
    const alerts = getAllWeatherAlerts();
    res.json({ alerts });
  } catch (error) {
    console.error('Get all alerts error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get emergency numbers
router.get('/emergency', (req, res) => {
  res.json({ emergencyNumbers });
});

// Helper functions
function checkIfNearCoast(lat, lon) {
  // Simplified check - in real app, you'd use proper coastline data
  // This checks if location is within ~50km of Indian coastline
  const coastalRegions = [
    { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
    { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
    { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
    { lat: 22.5726, lon: 88.3639, name: 'Kolkata' },
    { lat: 8.5241, lon: 76.9366, name: 'Thiruvananthapuram' }
  ];

  return coastalRegions.some(region => 
    isWithinRadius(lat, lon, region.lat, region.lon, 50)
  );
}

function isWithinRadius(lat1, lon1, lat2, lon2, radiusKm) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance <= radiusKm;
}

function estimateWaveHeight(windSpeed) {
  // Simplified wave height estimation based on wind speed
  if (windSpeed < 5) return '0.1-0.3m';
  if (windSpeed < 10) return '0.3-0.6m';
  if (windSpeed < 15) return '0.6-1.2m';
  if (windSpeed < 20) return '1.2-2.0m';
  return '2.0m+';
}

function getSeaConditions(windSpeed) {
  if (windSpeed < 5) return 'Calm';
  if (windSpeed < 10) return 'Slight';
  if (windSpeed < 15) return 'Moderate';
  if (windSpeed < 20) return 'Rough';
  return 'Very Rough';
}

module.exports = router;