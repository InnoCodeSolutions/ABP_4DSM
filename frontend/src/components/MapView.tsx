/*import React from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle, Platform } from "react-native";
import MapView, { Marker as MapMarker, Polyline } from "react-native-maps";
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
  scrollEnabled?: boolean; // Adicionado para suportar scrollEnabled
}

const defaultRegion = {
  latitude: -23.3036, // Jacareí center
  longitude: -45.9657,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CustomMapView: React.FC<MapViewProps> = ({
  markers = [],
  initialRegion = defaultRegion,
  style,
  route,
  onMarkerPress,
  scrollEnabled = true, // Valor padrão: true
}) => {
  // Process markers with fallback to 0 for null/undefined
  const validMarkers = markers
    .map((marker) => ({
      latitude: marker.latitude || 0,
      longitude: marker.longitude || 0,
      title: marker.title || "Unknown",
    }))
    .filter((marker) => !isNaN(marker.latitude) && !isNaN(marker.longitude));

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
        style={[styles.map, style]}
        initialRegion={computedRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        scrollEnabled={scrollEnabled} // Passa a propriedade scrollEnabled
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

export default CustomMapView;*/

import React from "react";
import { View, StyleSheet, Text, StyleProp, ViewStyle, Platform } from "react-native";
import MapView, { Marker as MapMarker, Polyline } from "react-native-maps";
import { GeoJSONRoute, Derivador } from "../service/deviceService";

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
  history?: Derivador[]; // Added history prop
  onMarkerPress?: (deviceId: string) => void;
  scrollEnabled?: boolean;
}

const defaultRegion = {
  latitude: -23.3036, // Jacareí center
  longitude: -45.9657,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CustomMapView: React.FC<MapViewProps> = ({
  markers = [],
  initialRegion = defaultRegion,
  style,
  route,
  history = [], // Default to empty array
  onMarkerPress,
  scrollEnabled = true,
}) => {
  // Process markers with fallback to 0 for null/undefined
  const validMarkers = markers
    .map((marker) => ({
      latitude: marker.latitude || 0,
      longitude: marker.longitude || 0,
      title: marker.title || "Unknown",
    }))
    .filter((marker) => !isNaN(marker.latitude) && !isNaN(marker.longitude));

  const computedRegion = validMarkers.length > 0
    ? {
        latitude: validMarkers.reduce((sum, m) => sum + m.latitude, 0) / validMarkers.length,
        longitude: validMarkers.reduce((sum, m) => sum + m.longitude, 0) / validMarkers.length,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      }
    : initialRegion;

  // Generate route coordinates from history if available, otherwise use route
  const routeCoordinates = history.length > 0
    ? history
        .filter((entry) => entry.latitude != null && entry.longitude != null)
        .map((entry) => ({
          latitude: entry.latitude!,
          longitude: entry.longitude!,
        }))
    : route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates
    ? route.features[0].geometry.coordinates.map(([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }))
    : [];

  console.log("MapView (Mobile): Rendering with", {
    hasRoute: !!route,
    hasHistory: history.length > 0,
    validMarkers: validMarkers.length,
    center: [computedRegion.latitude, computedRegion.longitude],
    routeCoordinatesCount: routeCoordinates.length,
    dataSource: history.length > 0 ? "history" : route ? "route" : "none",
  });

  try {
    return (
      <MapView
        style={[styles.map, style]}
        initialRegion={computedRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        scrollEnabled={scrollEnabled}
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
            onPress={() => {
              console.log("MapView (Mobile): Marker clicked:", marker.title);
              onMarkerPress && onMarkerPress(marker.title);
            }}
          />
        ))}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
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