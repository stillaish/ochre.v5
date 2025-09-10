export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  isAdmin: boolean;
}

export interface Hazard {
  id: string;
  userId: string;
  type: 'flood' | 'fire' | 'earthquake' | 'landslide' | 'storm' | 'other';
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'rejected';
  images: string[];
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  location: string;
  country: string;
  timestamp: string;
}

export interface WeatherForecast {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  hourly: {
    time: string;
    temperature: number;
    description: string;
    icon: string;
    windSpeed: number;
  }[];
}

export interface MarineData {
  windSpeed: number;
  windDirection: number;
  windGust: number;
  visibility: number;
  seaLevel: number;
  waveHeight: string;
  seaConditions: string;
  tideInfo: string;
  timestamp: string;
}

export interface WeatherAlert {
  id: string;
  type: 'cyclone' | 'storm' | 'heavy_rain' | 'flood_warning' | 'heat_wave' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

export interface EmergencyNumbers {
  police: string;
  fire: string;
  ambulance: string;
  disasterHelpline: string;
  womenHelpline: string;
  childHelpline: string;
  seniorCitizenHelpline: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  user?: User;
  token?: string;
  hazards?: Hazard[];
  hazard?: Hazard;
  weather?: WeatherData;
  forecast?: WeatherForecast[];
  marine?: MarineData;
  alerts?: WeatherAlert[];
  alert?: WeatherAlert;
  emergencyNumbers?: EmergencyNumbers;
  verification?: {
    verified: boolean;
    reason: string;
  };
  statistics?: {
    total: number;
    byStatus: {
      pending: number;
      verified: number;
      rejected: number;
    };
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recent: number;
  };
}
