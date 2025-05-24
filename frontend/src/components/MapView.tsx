/*import React from "react";
import { Platform, View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import MapView, { Marker as MapMarker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { MapContainer, TileLayer, GeoJSON, Marker as LeafletMarker, Popup } from "react-leaflet";
import L from "leaflet";
import { GeoJSONRoute } from "../service/deviceService";


// Leaflet CSS is imported in frontend/index.tsx: import 'leaflet/dist/leaflet.css';

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
  route?: GeoJSONRoute;
}

const defaultRegion = {
  latitude: -23.3036, // Jacareí center
  longitude: -45.9657,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Custom Leaflet icon using FontAwesome (car icon)
const customIcon = L.divIcon({
  html: '<i class="fa fa-car" style="color: #FF0000; font-size: 24px;"></i>',
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});
// Fallback to default Leaflet icon
const fallbackIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const CustomMapView: React.FC<MapViewProps> = ({ markers = [], initialRegion = defaultRegion, style, route }) => {
  // Process markers with fallback to 0 for null/undefined
  const rawMarkers = [...markers]; // Copy for logging
  const validMarkers = markers.map(marker => ({
    latitude: marker.latitude || 0,
    longitude: marker.longitude || 0,
    title: marker.title || "Unknown",
  })).filter(
    marker => !isNaN(marker.latitude) && !isNaN(marker.longitude)
  );
  const computedRegion = validMarkers.length > 0
    ? {
        latitude: validMarkers.reduce((sum, m) => sum + m.latitude, 0) / validMarkers.length,
        longitude: validMarkers.reduce((sum, m) => sum + m.longitude, 0) / validMarkers.length,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      }
    : initialRegion;

  // Web rendering
  if (Platform.OS === "web") {
    console.log("MapView: Rendering for web", {
      hasRoute: !!route,
      rawMarkers: rawMarkers,
      validMarkers: validMarkers,
      center: [computedRegion.latitude, computedRegion.longitude],
    });
    try {
      // Render Leaflet map if route or valid markers exist
      if ((route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates) || validMarkers.length > 0) {
        console.log("MapView: Attempting Leaflet rendering");
        try {
          const center = route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates[0]
            ? [
                route.features[0].geometry.coordinates[0][1], // latitude
                route.features[0].geometry.coordinates[0][0], // longitude
              ]
            : [computedRegion.latitude, computedRegion.longitude];
          const iconToUse = document.querySelector(".fa") ? customIcon : fallbackIcon; // Check FontAwesome

          return (
            <View style={[styles.mapContainer, style]}>
              <MapContainer
                center={center as [number, number]}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates && (
                  <GeoJSON data={route} style={{ color: "#FF0000", weight: 3 }} />
                )}
                {validMarkers.map((marker, index) => (
                  <LeafletMarker
                    key={index}
                    position={[marker.latitude, marker.longitude]}
                    icon={iconToUse}
                  >
                    <Popup>{marker.title}</Popup>
                  </LeafletMarker>
                ))}
              </MapContainer>
            </View>
          );
        } catch (leafletError) {
          console.error("MapView: Leaflet rendering failed:", leafletError);
          // Fallback to iframe
        }
      }

      // Fallback to OpenStreetMap iframe
      console.log("MapView: Rendering iframe fallback due to no valid markers or route");
      const region = computedRegion;
      const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
        region.longitude - 0.05
      },${region.latitude - 0.05},${region.longitude + 0.05},${
        region.latitude + 0.05
      }&layer=mapnik&marker=${region.latitude},${region.longitude}`;

      return (
        <View style={[styles.mapContainer, style]}>
          <iframe
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              borderRadius: 10,
            }}
            src={mapUrl}
            title="OpenStreetMap"
          />
        </View>
      );
    } catch (err) {
      console.error("MapView: Failed to render map on web:", err);
      return (
        <View style={[styles.mapContainer, style]}>
          <Text style={{ color: "#fff" }}>Erro ao carregar o mapa na web.</Text>
        </View>
      );
    }
  }

  // Mobile rendering (Google Maps)
  console.log("MapView: Rendering for mobile", {
    hasRoute: !!route,
    rawMarkers: rawMarkers,
    validMarkers: validMarkers,
    center: [computedRegion.latitude, computedRegion.longitude],
  });
  try {
    return (
      <MapView
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={[styles.map, style]}
        initialRegion={computedRegion}
      >
        {validMarkers.map((marker, index) => (
          <MapMarker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            pinColor="#FF0000"
          />
        ))}
        {route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates && (
          <Polyline
            coordinates={route.features[0].geometry.coordinates.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            }))}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>
    );
  } catch (err) {
    console.error("MapView: Failed to render map on mobile:", err);
    return (
      <View style={[styles.mapContainer, style]}>
        <Text style={{ color: "#fff" }}>Erro ao carregar o mapa no mobile.</Text>
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
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default CustomMapView;*/


import React from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle, Platform } from "react-native";
import MapView, { Marker as MapMarker, Polyline } from "react-native-maps"; // REMOVIDO PROVIDER_GOOGLE
import { GeoJSONRoute } from "../service/deviceService";

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

const CustomMapView: React.FC<MapViewProps> = ({ markers = [], initialRegion = defaultRegion, style, route, onMarkerPress }) => {
  // Process markers with fallback to 0 for null/undefined
  const validMarkers = markers.map(marker => ({
    latitude: marker.latitude || 0,
    longitude: marker.longitude || 0,
    title: marker.title || "Unknown",
  })).filter(
    marker => !isNaN(marker.latitude) && !isNaN(marker.longitude)
  );

  const computedRegion = validMarkers.length > 0
    ? {
        latitude: validMarkers.reduce((sum, m) => sum + m.latitude, 0) / validMarkers.length,
        longitude: validMarkers.reduce((sum, m) => sum + m.longitude, 0) / validMarkers.length,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      }
    : initialRegion;

  console.log("MapView (Mobile): Rendering with", {
    hasRoute: !!route,
    validMarkers,
    center: [computedRegion.latitude, computedRegion.longitude],
  });

  try {
    return (
      <MapView
        // REMOVIDO: provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={[styles.map, style]}
        initialRegion={computedRegion}
        showsUserLocation={true} // Opcional: mostra a localização do usuário
        followsUserLocation={true} // Opcional: a câmera segue a localização do usuário
      >
        {validMarkers.map((marker, index) => (
          <MapMarker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            pinColor="#FF0000" // Cor do pino
            onPress={() => {
              console.log("MapView (Mobile): Marker clicked:", marker.title);
              onMarkerPress && onMarkerPress(marker.title);
            }}
          />
        ))}
        {route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates && (
          <Polyline
            coordinates={route.features[0].geometry.coordinates.map(([lng, lat]) => ({
              latitude: lat,
              longitude: lng,
            }))}
            strokeColor="#FF0000"
            strokeWidth={5}
          />
        )}
      </MapView>
    );
  } catch (err) {
    console.error("MapView (Mobile): Failed to render map:", err);
    return (
      <View style={[styles.mapContainer, style]}>
        <Text style={{ color: "#fff" }}>Erro ao carregar o mapa no mobile.</Text>
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
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default CustomMapView;