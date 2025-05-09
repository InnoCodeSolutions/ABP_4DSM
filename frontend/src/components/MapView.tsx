import React from "react";
import { Platform, View, StyleSheet, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
}

const defaultRegion = {
  latitude: -22.9068,
  longitude: -43.1729,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const CustomMapView: React.FC<MapViewProps> = ({ markers = [], initialRegion = defaultRegion }) => {
  // Render map for web
  if (Platform.OS === "web") {
    const region = initialRegion || defaultRegion;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      region.longitude - 0.05
    },${region.latitude - 0.05},${region.longitude + 0.05},${
      region.latitude + 0.05
    }&layer=mapnik&marker=${region.latitude},${region.longitude}`;

    return (
      <View style={styles.mapContainer}>
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
  }

  // Render map for mobile (Android/iOS)
  try {
    return (
      <MapView
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
          />
        ))}
      </MapView>
    );
  } catch (err) {
    console.error("Failed to render map on mobile:", err);
    return (
      <View style={styles.mapContainer}>
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