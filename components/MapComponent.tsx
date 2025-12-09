import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
  label: string;
}

interface MapComponentProps {
  locations: Location[];
  center?: [number, number];
}

const MapComponent: React.FC<MapComponentProps> = ({ locations, center }) => {
  const defaultCenter: [number, number] = center || (locations.length > 0 ? [locations[0].lat, locations[0].lng] : [51.505, -0.09]);

  return (
    <div className="w-full h-full overflow-hidden bg-slate-100 relative z-0">
      <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]} icon={icon}>
            <Popup>
              <div className="text-slate-900 font-sans font-semibold text-sm">
                {loc.label}
                <br />
                <span className="text-xs text-slate-500 font-normal">Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;