import React, { useEffect, useState } from "react";
import { View, Platform, StyleSheet, Image } from "react-native";
import {
  Derivador,
  fetchDerivadores,
  fetchDeviceHistory,
} from "../service/deviceService";

import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from "react-leaflet";
import L from "leaflet";

// Ícone padrão do marcador
const customIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png", // pega da pasta public
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Função que cria ícone com nome visível acima
const createLabelWithIcon = (label: string) =>
  new L.DivIcon({
    html: `
      <div style="text-align: center;">
        <div style="
          font-size: 12px;
          font-weight: bold;
          color: black;
          background: white;
          border: 1px solid #999;
          border-radius: 6px;
          padding: 2px 6px;
          margin-bottom: 4px;
          display: inline-block;
        ">${label}</div>
        <img src="/leaflet/marker-icon.png" style="width: 40px; height: 40px;" />
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    className: "device-label-icon",
  });

const MapScreen: React.FC = () => {
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [devicePath, setDevicePath] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const data = await fetchDerivadores();
        setDerivadores(data);
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
      }
    };

    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = async (deviceId: string) => {
    if (deviceId === selectedDeviceId) {
      // Clicou novamente: desativa a rota
      setSelectedDeviceId(null);
      setDevicePath([]);
      return;
    }
    
    try {
      setSelectedDeviceId(deviceId);
      const history = await fetchDeviceHistory(deviceId);
      const coordinates = history
        .filter((item) => item.latitude && item.longitude)
        .map((item) => ({
          latitude: item.latitude!,
          longitude: item.longitude!,
        }));

      setDevicePath(coordinates);
    } catch (err) {
      console.error("Erro ao buscar histórico do dispositivo:", err);
    }
  };
  

  const defaultLat = derivadores[0]?.latitude ?? -23.2983;
  const defaultLng = derivadores[0]?.longitude ?? -45.9655;

  if (Platform.OS !== "web") {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.markerIcon}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={13}
        maxZoom={22}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100vh", width: "100%" }}
      >
        <ZoomControl position="bottomright" />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {derivadores.map((device, idx) => (
          <Marker
            key={idx}
            position={[device.latitude || 0, device.longitude || 0]}
            icon={createLabelWithIcon(device.device_id)}
            eventHandlers={{
              click: () => handleMarkerClick(device.device_id),
            }}
          />
        ))}

        {selectedDeviceId && devicePath.length > 1 && (
          <>
            <Polyline
              positions={devicePath.map((p) => [p.latitude, p.longitude])}
              pathOptions={{ color: "#FF0000", weight: 4 }}
            />
            <Marker
              position={[
                devicePath[devicePath.length - 1].latitude,
                devicePath[devicePath.length - 1].longitude,
              ]}
              icon={createLabelWithIcon("Fim")}
            />
          </>
        )}
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default MapScreen;

/*
Mapa com MapBox

import React, { useEffect, useState } from "react";
import { View, Platform, StyleSheet, Image } from "react-native";
import {
  Derivador,
  fetchDerivadores,
  fetchDeviceHistory,
} from "../service/deviceService";

import { MapContainer, TileLayer, Marker, Polyline, ZoomControl } from "react-leaflet";
import L from "leaflet";

// 🔐 Substitua aqui pelo seu token do Mapbox
const MAPBOX_TOKEN = "SEU_MAPBOX_ACCESS_TOKEN_AQUI";

const customIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const createLabelWithIcon = (label: string) =>
  new L.DivIcon({
    html: `
      <div style="text-align: center;">
        <div style="
          font-size: 12px;
          font-weight: bold;
          color: black;
          background: white;
          border: 1px solid #999;
          border-radius: 6px;
          padding: 2px 6px;
          margin-bottom: 4px;
          display: inline-block;
        ">${label}</div>
        <img src="/leaflet/marker-icon.png" style="width: 40px; height: 40px;" />
      </div>
    `,
    iconSize: [40, 60],
    iconAnchor: [20, 60],
    className: "device-label-icon",
  });

const MapScreen: React.FC = () => {
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [devicePath, setDevicePath] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  useEffect(() => {
    const loadDerivadores = async () => {
      try {
        const data = await fetchDerivadores();
        setDerivadores(data);
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
      }
    };

    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkerClick = async (deviceId: string) => {
    if (deviceId === selectedDeviceId) {
      setSelectedDeviceId(null);
      setDevicePath([]);
      return;
    }

    try {
      setSelectedDeviceId(deviceId);
      const history = await fetchDeviceHistory(deviceId);
      const coordinates = history
        .filter((item) => item.latitude && item.longitude)
        .map((item) => ({
          latitude: item.latitude!,
          longitude: item.longitude!,
        }));

      setDevicePath(coordinates);
    } catch (err) {
      console.error("Erro ao buscar histórico do dispositivo:", err);
    }
  };

  const defaultLat = derivadores[0]?.latitude ?? -23.2983;
  const defaultLng = derivadores[0]?.longitude ?? -45.9655;

  if (Platform.OS !== "web") {
    return (
      <View style={styles.centered}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.markerIcon}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={13}
        maxZoom={24}
        zoomControl={false} // desativa o padrão para posicionar manualmente
        scrollWheelZoom={true}
        style={styles.map}
      >
        //{ Botões de Zoom no canto inferior direito }
        <ZoomControl position="bottomright" />

        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
          attribution='© <a href="https://www.mapbox.com/">Mapbox</a>'
          tileSize={512}
          zoomOffset={-1}
          maxZoom={24}
        />

        {derivadores.map((device, idx) => (
          <Marker
            key={idx}
            position={[device.latitude || 0, device.longitude || 0]}
            icon={createLabelWithIcon(device.device_id)}
            eventHandlers={{
              click: () => handleMarkerClick(device.device_id),
            }}
          />
        ))}

        {selectedDeviceId && devicePath.length > 1 && (
          <>
            <Polyline
              positions={devicePath.map((p) => [p.latitude, p.longitude])}
              pathOptions={{ color: "#00BFFF", weight: 4 }}
            />
            <Marker
              position={[devicePath[0].latitude, devicePath[0].longitude]}
              icon={createLabelWithIcon("Início")}
            />
            <Marker
              position={[
                devicePath[devicePath.length - 1].latitude,
                devicePath[devicePath.length - 1].longitude,
              ]}
              icon={createLabelWithIcon("Fim")}
            />
          </>
        )}
      </MapContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100vh",
  },
  markerIcon: {
    width: 40,
    height: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen; */
