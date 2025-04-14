import React, { useEffect, useState } from "react";
import { Platform, View, StyleSheet, Text } from "react-native";
import type { MapViewProps as RNMapViewProps, MapMarkerProps } from "react-native-maps";
import type * as ReactNativeMaps from "react-native-maps";

interface MapViewProps {
  markers?: { latitude: number; longitude: number; title: string }[];
}

const defaultRegion = {
  latitude: -22.9068,
  longitude: -43.1729,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

interface MapComponents {
  MapView: React.ComponentType<RNMapViewProps>;
  Marker: React.ComponentType<MapMarkerProps>;
}

const MapView: React.FC<MapViewProps> = ({ markers = [] }) => {
  const [mapComponents, setMapComponents] = useState<MapComponents | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      import("react-native-maps")
        .then((module: typeof ReactNativeMaps) => {
          const { default: MapView, Marker } = module;
          setMapComponents({ MapView, Marker });
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load react-native-maps:", err);
          setError("Erro ao carregar o mapa no mobile.");
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.mapContainer}>
        <Text style={{ color: "#fff" }}>Carregando mapa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.mapContainer}>
        <Text style={{ color: "#fff" }}>{error}</Text>
      </View>
    );
  }

  if (Platform.OS === "web") {
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      defaultRegion.longitude - 0.05
    },${defaultRegion.latitude - 0.05},${defaultRegion.longitude + 0.05},${
      defaultRegion.latitude + 0.05
    }&layer=mapnik&marker=${defaultRegion.latitude},${defaultRegion.longitude}`;

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

  if (mapComponents) {
    const { MapView: MapViewComponent, Marker: MarkerComponent } = mapComponents;
    return (
      <MapViewComponent style={styles.map} initialRegion={defaultRegion}>
        {markers.map((marker, index) => (
          <MarkerComponent
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
          />
        ))}
      </MapViewComponent>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%", // Ocupa o espaço do container pai
    height: "100%", // Respeita o height definido no HomePage
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

export default MapView;