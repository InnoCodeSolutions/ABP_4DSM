// src/components/LeafletMap.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Importe os ícones manualmente
import icon from "../assets/leaflet/marker-icon.png";
import icon2x from "../assets/leaflet/marker-icon-2x.png";
import shadow from "../assets/leaflet/marker-shadow.png";

type Props = {
  device: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

// Corrige os ícones do Leaflet para o React (Expo Web)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon2x,
  iconUrl: icon,
  shadowUrl: shadow,
});

const LeafletMap: React.FC<Props> = ({ device }) => {
  return (
    <div
      style={{
        height: 300,
        width: "90%",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[device.latitude, device.longitude]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={[device.latitude, device.longitude]}>
          <Popup>{device.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
