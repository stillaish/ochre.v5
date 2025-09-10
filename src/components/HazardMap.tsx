import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom marker icons
const createCustomIcon = (color: string, type: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="16" y="20" font-family="Arial" font-size="16" fill="white" text-anchor="middle">
          ${type.charAt(0).toUpperCase()}
        </text>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const hazardIcons = {
  earthquake: createCustomIcon('#dc2626', 'E'),
  flood: createCustomIcon('#2563eb', 'F'),
  cyclone: createCustomIcon('#7c3aed', 'C'),
  fire: createCustomIcon('#ea580c', 'Fi'),
  landslide: createCustomIcon('#8b5cf6', 'L'),
  drought: createCustomIcon('#ca8a04', 'D'),
  storm: createCustomIcon('#4f46e5', 'S'),
  other: createCustomIcon('#6b7280', 'O'),
};

const statusColors = {
  verified: '#059669',
  pending: '#d97706',
  rejected: '#dc2626',
};

interface HazardData {
  id: string;
  type: string;
  description: string;
  location: {
    coordinates: [number, number];
    address: string;
  };
  severity: string;
  status: string;
  createdAt: string;
  reportedBy: string;
  affectedPeople?: number;
  isEmergency: boolean;
}

interface HazardMapProps {
  center?: LatLngTuple;
  zoom?: number;
  height?: string;
  showFilters?: boolean;
}

const HazardMap: React.FC<HazardMapProps> = ({ 
  center = [20.5937, 78.9629], // Center of India
  zoom = 5,
  height = '400px',
  showFilters = true
}) => {
  const [hazards, setHazards] = useState<HazardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'verified',
  });
  const [selectedHazard, setSelectedHazard] = useState<HazardData | null>(null);

  useEffect(() => {
    fetchHazards();
  }, [filters]);

  const fetchHazards = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/hazards', {
        params: {
          type: filters.type,
          status: filters.status,
          limit: 100,
        }
      });
      setHazards(response.data.hazards || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch hazard data');
      console.error('Error fetching hazards:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Types</option>
              <option value="earthquake">Earthquake</option>
              <option value="flood">Flood</option>
              <option value="cyclone">Cyclone</option>
              <option value="fire">Fire</option>
              <option value="landslide">Landslide</option>
              <option value="drought">Drought</option>
              <option value="storm">Storm</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {hazards.length} hazard{hazards.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      <div className="relative">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height, width: '100%', borderRadius: '8px' }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {hazards.map((hazard) => (
            <Marker
              key={hazard.id}
              position={[hazard.location.coordinates[1], hazard.location.coordinates[0]]}
              icon={hazardIcons[hazard.type as keyof typeof hazardIcons] || hazardIcons.other}
              eventHandlers={{
                click: () => setSelectedHazard(hazard),
              }}
            >
              <Popup>
                <div className="p-2 min-w-64">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {hazard.type} Hazard
                    </h3>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(hazard.status)}
                      <span className="text-xs capitalize text-gray-600">
                        {hazard.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{hazard.description}</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><strong>Location:</strong> {hazard.location.address}</p>
                    <p><strong>Reported by:</strong> {hazard.reportedBy}</p>
                    <p><strong>Date:</strong> {formatDate(hazard.createdAt)}</p>
                    <p><strong>Severity:</strong> 
                      <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                        hazard.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        hazard.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        hazard.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {hazard.severity}
                      </span>
                    </p>
                    {hazard.affectedPeople && (
                      <p><strong>Affected People:</strong> {hazard.affectedPeople}</p>
                    )}
                    {hazard.isEmergency && (
                      <p className="text-red-600 font-medium">🚨 EMERGENCY</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-2"
              />
              <p className="text-sm text-gray-600">Loading hazard data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 rounded-lg p-3 z-20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Map Legend</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(hazardIcons).map(([type, icon]) => (
            <div key={type} className="flex items-center space-x-2">
              <img src={icon.options.iconUrl} alt={type} className="w-4 h-4" />
              <span className="text-xs text-gray-600 capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HazardMap;