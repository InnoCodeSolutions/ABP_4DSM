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

import React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { GeoJSONRoute, Derivador } from '../service/deviceService';

// Define tipos para marcadores
interface MarkerType {
  latitude: number;
  longitude: number;
  title: string;
}

// Define props para o MapView
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
  history?: Derivador[];
  onMarkerPress?: (deviceId: string) => void;
  scrollEnabled?: boolean;
}

const defaultRegion = {
  latitude: -23.3036, // Jacareí
  longitude: -45.9657,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// HTML base para o Leaflet com OSM
const leafletHTML = (
  markers: MarkerType[],
  center: [number, number],
  zoom: number,
  routeCoordinates: [number, number][],
  scrollEnabled: boolean
) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body { margin: 0; padding: 0; }
    #map { width: 100%; height: 100vh; }
    .leaflet-container { background: #fff; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    // Inicializa o mapa
    var map = L.map('map', {
      center: [${center[0]}, ${center[1]}],
      zoom: ${zoom},
      scrollWheelZoom: ${scrollEnabled},
      dragging: ${scrollEnabled},
      zoomControl: true,
      doubleClickZoom: ${scrollEnabled},
      touchZoom: ${scrollEnabled},
      boxZoom: ${scrollEnabled},
      tap: ${scrollEnabled},
      gestureHandling: true
    });

    // Adiciona a camada do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    // Adiciona marcadores
    var markers = ${JSON.stringify(markers)};
    markers.forEach(function(marker) {
      var m = L.marker([marker.latitude, marker.longitude]).addTo(map);
      m.bindPopup(marker.title);
      m.on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'markerPress', title: marker.title }));
      });
    });

    // Adiciona a polilinha
    var routeCoordinates = ${JSON.stringify(routeCoordinates)};
    if (routeCoordinates.length > 0) {
      L.polyline(routeCoordinates, { color: '#FF0000', weight: 5 }).addTo(map);
    }

    // Ajusta o mapa para mostrar todos os marcadores
    if (markers.length > 0) {
      var group = L.featureGroup(markers.map(m => L.marker([m.latitude, m.longitude])));
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  </script>
</body>
</html>
`;

const CustomMapView: React.FC<MapViewProps> = ({
  markers = [],
  initialRegion = defaultRegion,
  style,
  route,
  history = [],
  onMarkerPress,
  scrollEnabled = true,
}) => {
  // Processa marcadores
  const validMarkers = markers
    .map((marker) => ({
      latitude: marker.latitude || 0,
      longitude: marker.longitude || 0,
      title: marker.title || 'Unknown',
    }))
    .filter((marker) => !isNaN(marker.latitude) && !isNaN(marker.longitude));

  // Calcula a região central
  const computedRegion = validMarkers.length > 0
    ? {
        latitude: validMarkers.reduce((sum, m) => sum + m.latitude, 0) / validMarkers.length,
        longitude: validMarkers.reduce((sum, m) => sum + m.longitude, 0) / validMarkers.length,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.latitudeDelta,
      }
    : initialRegion;

  // Converte latitudeDelta para zoom
  const zoomLevel = Math.round(Math.log(360 / initialRegion.latitudeDelta) / Math.LN2);

  // Processa as coordenadas da rota
  const routeCoordinates: [number, number][] = history.length > 0
    ? history
        .filter((entry) => entry.latitude != null && entry.longitude != null)
        .map((entry) => [entry.latitude!, entry.longitude!] as [number, number])
    : route && Array.isArray(route.features) && route.features[0]?.geometry.coordinates
    ? route.features[0].geometry.coordinates
        .filter((coord): coord is [number, number] => Array.isArray(coord) && coord.length === 2 && !isNaN(coord[0]) && !isNaN(coord[1]))
        .map(([lng, lat]) => [lat, lng] as [number, number])
    : [];

  console.log('MapView (Mobile): Rendering with', {
    hasRoute: !!route,
    hasHistory: history.length > 0,
    validMarkers: validMarkers.length,
    center: [computedRegion.latitude, computedRegion.longitude],
    routeCoordinatesCount: routeCoordinates.length,
    dataSource: history.length > 0 ? 'history' : route ? 'route' : 'none',
  });

  try {
    return (
      <WebView
        style={[styles.map, style]}
        source={{ html: leafletHTML(validMarkers, [computedRegion.latitude, computedRegion.longitude], zoomLevel, routeCoordinates, scrollEnabled) }}
        originWhitelist={['*']}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'markerPress' && onMarkerPress) {
              console.log('MapView (Mobile): Marker clicked:', data.title);
              onMarkerPress(data.title);
            }
          } catch (err) {
            console.error('MapView (Mobile): Error parsing WebView message:', err);
          }
        }}
        scrollEnabled={scrollEnabled}
        useWebKit={true} // Usa WKWebView no iOS para melhor performance
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        scalesPageToFit={true} // Permite zoom e ajuste de escala
        setSupportMultipleWindows={false}
        cacheEnabled={true}
        cacheMode={'LOAD_DEFAULT'}
      />
    );
  } catch (err) {
    console.error('MapView (Mobile): Failed to render map:', err);
    return (
      <View style={[styles.mapContainer, style]}>
        <Text style={{ color: '#fff' }}>Erro ao carregar o mapa no mobile.</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default CustomMapView;