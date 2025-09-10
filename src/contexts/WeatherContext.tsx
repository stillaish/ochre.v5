import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

interface WeatherData {
  location: {
    name: string;
    country: string;
    coordinates: [number, number];
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    description: string;
    icon: string;
    condition: string;
  };
  timestamp: string;
}

interface WeatherAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface MarineData {
  isCoastal: boolean;
  marine?: {
    waveHeight: number;
    waveDirection: number;
    swellHeight: number;
    waterTemperature: number;
    tideLevel: number;
    seaCondition: string;
  };
}

interface WeatherState {
  weather: WeatherData | null;
  alerts: WeatherAlert[];
  marine: MarineData | null;
  loading: boolean;
  error: string | null;
}

type WeatherAction = 
  | { type: 'LOADING' }
  | { type: 'SET_WEATHER'; payload: WeatherData }
  | { type: 'SET_ALERTS'; payload: WeatherAlert[] }
  | { type: 'SET_MARINE'; payload: MarineData }
  | { type: 'ERROR'; payload: string };

const initialState: WeatherState = {
  weather: null,
  alerts: [],
  marine: null,
  loading: false,
  error: null,
};

const weatherReducer = (state: WeatherState, action: WeatherAction): WeatherState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_WEATHER':
      return { ...state, weather: action.payload, loading: false };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'SET_MARINE':
      return { ...state, marine: action.payload };
    case 'ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const WeatherContext = createContext<{
  state: WeatherState;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
  fetchAlerts: (lat: number, lon: number) => Promise<void>;
  fetchMarineData: (lat: number, lon: number) => Promise<void>;
} | null>(null);

const API_BASE_URL = 'http://localhost:3001/api';

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await axios.get(`${API_BASE_URL}/weather/current`, {
        params: { lat, lon }
      });
      dispatch({ type: 'SET_WEATHER', payload: response.data.weather });
    } catch (error: any) {
      dispatch({
        type: 'ERROR',
        payload: error.response?.data?.message || 'Failed to fetch weather data'
      });
    }
  };

  const fetchAlerts = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/alerts`, {
        params: { lat, lon }
      });
      dispatch({ type: 'SET_ALERTS', payload: response.data.alerts });
    } catch (error: any) {
      console.error('Failed to fetch weather alerts:', error);
    }
  };

  const fetchMarineData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/marine`, {
        params: { lat, lon }
      });
      dispatch({ type: 'SET_MARINE', payload: response.data });
    } catch (error: any) {
      console.error('Failed to fetch marine data:', error);
    }
  };

  // Auto-fetch weather for Delhi on component mount (demo)
  useEffect(() => {
    fetchWeather(28.7041, 77.1025); // Delhi coordinates
    fetchAlerts(28.7041, 77.1025);
    fetchMarineData(28.7041, 77.1025);
  }, []);

  return (
    <WeatherContext.Provider value={{ state, fetchWeather, fetchAlerts, fetchMarineData }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
};