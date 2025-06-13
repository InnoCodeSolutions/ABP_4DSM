import React from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native"; // Mantém para StyleSheet
import { MapContainer, TileLayer, GeoJSON, Marker as LeafletMarker, Popup } from "react-leaflet";
import L from "leaflet";
import { GeoJSONRoute } from "../service/deviceService";

// IMPORTANTE:
// Certifique-se de que os ícones do Leaflet estejam acessíveis.
// Seu script `scripts/copy-leaflet-icons.js` deve garantir isso.
// Verifique se o CSS do Leaflet está sendo importado em `index.ts` ou `App.tsx` para web.
// Ex: `import 'leaflet/dist/leaflet.css';`

// Define types for markers
interface MarkerType {
  latitude: number;
  longitude: number;
  title: string;
}

// Define props for MapView
interface MapViewProps {
  markers?: MarkerType[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  style?: StyleProp<ViewStyle>;
  route?: GeoJSONRoute | null | undefined;
  onMarkerPress?: (deviceId: string) => void;
}

const defaultRegion = {
  latitude: -23.3036, // Jacareí center
  longitude: -45.9657,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Custom Leaflet icon using FontAwesome (car icon)
// O FontAwesome deve ser carregado globalmente no HTML ou via import.
// Para web, você pode incluir o CDN do FontAwesome no `index.html` gerado pelo Expo.
// Ex: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
const customIcon = L.divIcon({
  html: '<i class="fa fa-car" style="color: #FF0000; font-size: 24px;"></i>',
  className: "custom-div-icon", // Adicione uma classe para estilização se necessário
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

// Fallback to default Leaflet icon (certifique-se de que os ícones estejam acessíveis)
const fallbackIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const CustomMapView: React.FC<MapViewProps> = ({ markers = [], initialRegion = defaultRegion, style, route, onMarkerPress }) => {
  const validMarkers = markers.map(marker => ({
    latitude: marker.latitude || 0,
    longitude: marker.longitude || 0,
    title: marker.title || "Unknown",
  })).filter(
    marker => !isNaN(marker.latitude) && !isNaN(marker.longitude)
  );

  const computedCenter: [number, number] = validMarkers.length > 0
    ? [
        validMarkers.reduce((sum, m) => sum + m.latitude, 0) / validMarkers.length,
        validMarkers.reduce((sum, m) => sum + m.longitude, 0) / validMarkers.length,
      ]
    : [initialRegion.latitude, initialRegion.longitude];

  console.log("MapView (Web): Rendering with", {
    hasRoute: !!route,
    validMarkers,
    center: computedCenter,
  });

  // Determinar o ícone a ser usado. Para web, podemos verificar se o FontAwesome está carregado
  // de forma mais robusta, ou apenas usar o fallback se o customIcon não for definido.
  const iconToUse = window.document.querySelector(".fa") ? customIcon : fallbackIcon; // 'window.document' para explicitar contexto global

  try {
    return (
      <View style={[styles.mapContainer, style]}>
        <MapContainer
          center={computedCenter}
          zoom={13}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates && (
            <GeoJSON
              data={route}
              style={{ color: "#FF0000", weight: 5, opacity: 0.8 }}
            />
          )}
          {validMarkers.map((marker, index) => (
            <LeafletMarker
              key={index}
              position={[marker.latitude, marker.longitude]}
              icon={iconToUse}
              eventHandlers={{
                click: () => {
                  console.log("MapView (Web): Marker clicked:", marker.title);
                  onMarkerPress && onMarkerPress(marker.title);
                },
              }}
            >
              <Popup>{marker.title}</Popup>
            </LeafletMarker>
          ))}
        </MapContainer>
      </View>
    );
  } catch (err) {
    console.error("MapView (Web): Failed to render map:", err);
    return (
      <View style={[styles.mapContainer, style]}>
        <Text style={{ color: "#fff" }}>Erro ao carregar o mapa na web.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomMapView;