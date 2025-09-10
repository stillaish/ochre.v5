import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { 
  AlertTriangle, 
  MapPin, 
  Filter, 
  Layers,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { hazardAPI, weatherAPI } from '../services/api';
import { Hazard, WeatherAlert } from '../types';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom marker icons
const createCustomIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const hazardIcons = {
  flood: createCustomIcon('#3B82F6'),
  fire: createCustomIcon('#EF4444'),
  earthquake: createCustomIcon('#8B5CF6'),
  landslide: createCustomIcon('#F59E0B'),
  storm: createCustomIcon('#10B981'),
  other: createCustomIcon('#6B7280')
};

const statusIcons = {
  verified: CheckCircle,
  rejected: XCircle,
  pending: Clock
};

const statusColors = {
  verified: 'text-green-600',
  rejected: 'text-red-600',
  pending: 'text-yellow-600'
};

// Component to update map view when hazards change
const MapUpdater: React.FC<{ hazards: Hazard[] }> = ({ hazards }) => {
  const map = useMap();
  
  useEffect(() => {
    if (hazards.length > 0) {
      const bounds = hazards.map(hazard => [hazard.location.latitude, hazard.location.longitude] as LatLngTuple);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [hazards, map]);
  
  return null;
};

const Map: React.FC = () => {
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    severity: 'all'
  });
  const [showHazards, setShowHazards] = useState(true);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);

  // Default center for India
  const defaultCenter: LatLngTuple = [20.5937, 78.9629];
  const defaultZoom = 5;

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      
      // Fetch all hazards
      const hazardsResponse = await hazardAPI.getAll({ limit: 100 });
      setHazards(hazardsResponse.data.hazards || []);

      // Fetch weather alerts
      const alertsResponse = await weatherAPI.getAlerts();
      setAlerts(alertsResponse.data.alerts || []);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      toast.error('Failed to load map data');
    } finally {
      setLoading(false);
    }
  };

  const filteredHazards = useMemo(() => {
    return hazards.filter(hazard => {
      if (filters.type !== 'all' && hazard.type !== filters.type) return false;
      if (filters.status !== 'all' && hazard.status !== filters.status) return false;
      if (filters.severity !== 'all' && hazard.severity !== filters.severity) return false;
      return true;
    });
  }, [hazards, filters]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hazard Map</h1>
                <p className="text-gray-600">View hazards and alerts across India</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredHazards.length} hazards • {alerts.length} alerts
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-80 bg-white shadow-lg overflow-y-auto"
        >
          <div className="p-6">
            {/* Filters */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </h3>
              
              <div className="space-y-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hazard Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Types</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="landslide">Landslide</option>
                    <option value="storm">Storm</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="all">All Severity</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                Layers
              </h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showHazards}
                    onChange={(e) => setShowHazards(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Hazards</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAlerts}
                    onChange={(e) => setShowAlerts(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Weather Alerts</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showSafeZones}
                    onChange={(e) => setShowSafeZones(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Safe Zones</span>
                </label>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Legend
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Hazard Types</p>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Flood</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Fire</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span>Earthquake</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Landslide</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Storm</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                      <span>Other</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Hazards List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Hazards
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredHazards.slice(0, 10).map((hazard) => {
                  const StatusIcon = statusIcons[hazard.status];
                  return (
                    <div key={hazard.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {hazard.type}
                            </span>
                            <StatusIcon className={`w-3 h-3 ${statusColors[hazard.status]}`} />
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {hazard.location.address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(hazard.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(hazard.severity)}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1"
        >
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater hazards={filteredHazards} />
            
            {/* Hazard Markers */}
            {showHazards && filteredHazards.map((hazard) => (
              <Marker
                key={hazard.id}
                position={[hazard.location.latitude, hazard.location.longitude]}
                icon={hazardIcons[hazard.type]}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {hazard.type}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        hazard.status === 'verified' ? 'bg-green-100 text-green-800' :
                        hazard.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {hazard.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{hazard.description}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {hazard.location.address}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Severity: {hazard.severity}</span>
                      <span>{new Date(hazard.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Weather Alert Markers */}
            {showAlerts && alerts.map((alert) => (
              <Marker
                key={alert.id}
                position={[alert.location.latitude, alert.location.longitude]}
                icon={createCustomIcon('#F59E0B')}
              >
                <Popup>
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <p className="text-xs text-gray-500 mb-2">
                      {alert.location.address}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Severity: {alert.severity}</span>
                      <span>Until: {new Date(alert.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Safe Zones (example circles around major cities) */}
            {showSafeZones && (
              <>
                <Circle
                  center={[28.6139, 77.2090]}
                  radius={50000}
                  pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                />
                <Circle
                  center={[19.0760, 72.8777]}
                  radius={50000}
                  pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                />
                <Circle
                  center={[12.9716, 77.5946]}
                  radius={50000}
                  pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                />
              </>
            )}
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default Map;
