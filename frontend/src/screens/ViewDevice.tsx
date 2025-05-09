/*import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../navigation/AppNavigation";

const { width, height } = Dimensions.get("window");

// Interface para os derivadores
interface Derivador {
  title: string;
  latitude: string;
  longitude: string;
  latNumber: number;
  lonNumber: number;
  percentage?: number;
  direction?: string;
}

// Tipagem da navegação
type ViewDeviceNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ViewDevice"
>;

// Tipagem dos parâmetros da rota
type ViewDeviceRouteProp = {
  params: {
    device?: { id: string; name: string };
  };
};

// Função para formatar latitude e longitude com direção
const formatCoordinate = (value: number, isLatitude: boolean) => {
  const direction = isLatitude
    ? value >= 0
      ? "Norte"
      : "Sul"
    : value >= 0
    ? "Leste"
    : "Oeste";
  const prefix = isLatitude ? "Lt: " : "Lg: ";
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value).toFixed(3);
  return `${prefix}${sign}${absValue}° ${direction}`;
};

const ViewDevice: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();
  const route = useRoute<ViewDeviceRouteProp>();

  // Estado para armazenar os dados dos derivadores
  const [derivadores, setDerivadores] = useState<Derivador[]>([
    {
      title: "Derivador 1",
      latitude: "",
      longitude: "",
      latNumber: 0.24,
      lonNumber: -51.6,
      percentage: 37,
      direction: "Oeste",
    },
    {
      title: "Derivador 2",
      latitude: "",
      longitude: "",
      latNumber: -37.142,
      lonNumber: -47.932,
      percentage: 89,
      direction: "Oeste",
    },
    {
      title: "Derivador 3",
      latitude: "",
      longitude: "",
      latNumber: -37.142,
      lonNumber: -47.932,
      percentage: 43,
      direction: "Oeste",
    },
  ]);

  // Função para buscar os dados da API
  const fetchDerivadores = async () => {
    try {
      const response = await fetch(
        "https://sua-api.execute-api.us-east-1.amazonaws.com/prod/getDerivadores"
      );
      const data: Derivador[] = await response.json();
      setDerivadores(
        data.map((item) => ({
          title: item.title || "Desconhecido",
          latNumber: item.latNumber || 0,
          lonNumber: item.lonNumber || 0,
          latitude: formatCoordinate(item.latNumber || 0, true),
          longitude: formatCoordinate(item.lonNumber || 0, false),
          percentage: item.percentage || 0,
          direction: item.direction || "Desconhecido",
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar derivadores:", error);
      setDerivadores((prev) =>
        prev.map((derivador) => ({
          ...derivador,
          latitude: formatCoordinate(derivador.latNumber, true),
          longitude: formatCoordinate(derivador.lonNumber, false),
        }))
      );
    }
  };

  // Busca os dados ao carregar a tela
  useEffect(() => {
    setDerivadores((prev) =>
      prev.map((derivador) => ({
        ...derivador,
        latitude: formatCoordinate(derivador.latNumber, true),
        longitude: formatCoordinate(derivador.lonNumber, false),
      }))
    );
    fetchDerivadores();
    const interval = setInterval(fetchDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  // Função para logout
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Meus dispositivos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.iconButton}
        >
          <Icon name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.deviceContainer}>
        {derivadores.map((derivador, index) => (
          <TouchableOpacity key={index} style={styles.deviceButton}>
            <View style={styles.deviceRow}>
              
              <Image
                source={require("../assets/derivador-1.png")}
                style={styles.deviceIcon}
                resizeMode="contain"
              />
              
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>{derivador.title}</Text>
                <Text style={styles.deviceLocation}>{derivador.latitude}</Text>
                <Text style={styles.deviceLocation}>{derivador.longitude}</Text>
                <Text style={styles.deviceStatus}>
                  Lig. {derivador.percentage}% - {derivador.direction}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

     
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    alignItems: "center",
    paddingTop: Platform.select({
      web: 30,
      native: 50,
    }),
    width: "100%",
    minHeight: height,
    maxWidth: Platform.select({
      web: 1000,
      native: width,
    }),
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Adjusted to space the title and home icon
    alignItems: "center",
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceContainer: {
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    marginTop: 20,
    gap: 10,
    alignSelf: "center",
    flex: 1,
  },
  deviceButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  deviceInfo: {
    flexDirection: "column",
  },
  deviceTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default ViewDevice;
*/
/*
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../navigation/AppNavigation";
import { Derivador, fetchDerivadores } from "../../service/deviceService";

const { width, height } = Dimensions.get("window");

// Tipagem da navegação
type ViewDeviceNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ViewDevice"
>;

// Tipagem dos parâmetros da rota
type ViewDeviceRouteProp = {
  params: {
    device?: { id: string; name: string };
  };
};

const ViewDevice: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();
  const route = useRoute<ViewDeviceRouteProp>();

  // Estado para armazenar os dados dos derivadores
  const [derivadores, setDerivadores] = useState<Derivador[]>([
    {
      title: "Derivador 1",
      latitude: "",
      longitude: "",
      latNumber: 0.24,
      lonNumber: -51.6,
      percentage: 37,
      direction: "Oeste",
    },
    {
      title: "Derivador 2",
      latitude: "",
      longitude: "",
      latNumber: -37.142,
      lonNumber: -47.932,
      percentage: 89,
      direction: "Oeste",
    },
    {
      title: "Derivador 3",
      latitude: "",
      longitude: "",
      latNumber: -37.142,
      lonNumber: -47.932,
      percentage: 43,
      direction: "Oeste",
    },
  ]);

  // Função para buscar os dados da API
  const loadDerivadores = async () => {
    try {
      const data = await fetchDerivadores();
      setDerivadores(data);
    } catch (error) {
      console.error("Erro ao buscar derivadores:", error);
      setDerivadores((prev) =>
        prev.map((derivador) => ({
          ...derivador,
          latitude: formatCoordinate(derivador.latNumber, true),
          longitude: formatCoordinate(derivador.lonNumber, false),
        }))
      );
    }
  };

  const formatCoordinate = (value: number, isLatitude: boolean) => {
    const direction = isLatitude
      ? value >= 0
        ? "Norte"
        : "Sul"
      : value >= 0
        ? "Leste"
        : "Oeste";
    const prefix = isLatitude ? "Lt: " : "Lg: ";
    const sign = value < 0 ? "-" : "";
    const absValue = Math.abs(value).toFixed(3);
    return `${prefix}${sign}${absValue}° ${direction}`;
  };

  // Busca os dados ao carregar a tela
  useEffect(() => {
    setDerivadores((prev) =>
      prev.map((derivador) => ({
        ...derivador,
        latitude: formatCoordinate(derivador.latNumber, true),
        longitude: formatCoordinate(derivador.lonNumber, false),
      }))
    );
    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  // Função para logout
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Meus dispositivos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.iconButton}
        >
          <Icon name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      
      <View style={styles.deviceContainer}>
        {derivadores.map((derivador, index) => (
          <TouchableOpacity key={index} style={styles.deviceButton}>
            <View style={styles.deviceRow}>
              
              <Image
                source={require("../assets/derivador-1.png")}
                style={styles.deviceIcon}
                resizeMode="contain"
              />
              
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>{derivador.title}</Text>
                <Text style={styles.deviceLocation}>{derivador.latitude}</Text>
                <Text style={styles.deviceLocation}>{derivador.longitude}</Text>
                <Text style={styles.deviceStatus}>
                  Lig. {derivador.percentage}% - {derivador.direction}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    alignItems: "center",
    paddingTop: Platform.select({
      web: 30,
      native: 50,
    }),
    width: "100%",
    minHeight: height,
    maxWidth: Platform.select({
      web: 1000,
      native: width,
    }),
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceContainer: {
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    marginTop: 20,
    gap: 10,
    alignSelf: "center",
    flex: 1,
  },
  deviceButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  deviceInfo: {
    flexDirection: "column",
  },
  deviceTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default ViewDevice;

*/
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RootStackParamList } from "../navigation/AppNavigation";
import { Derivador, fetchDerivadores } from "../../service/deviceService";

const { width, height } = Dimensions.get("window");

// Tipagem da navegação
type ViewDeviceNavigationProp = NativeStackNavigationProp<RootStackParamList, "ViewDevice">;

const ViewDevice: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();

  // Estado para armazenar os dados dos dispositivos
  const [derivadores, setDerivadores] = useState<Derivador[]>([]);

  // Função para buscar os dados da API
  const loadDerivadores = async () => {
    try {
      const data = await fetchDerivadores();
      setDerivadores(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Erro ao buscar derivadores:", error);
    }
  };

  // Busca os dados ao carregar a tela
  useEffect(() => {
    loadDerivadores();
    const interval = setInterval(loadDerivadores, 60000);
    return () => clearInterval(interval);
  }, []);

  // Função para logout
  const handleLogout = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com título e botão Home */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Meus dispositivos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.iconButton}
        >
          <Icon name="home" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de dispositivos */}
      <View style={styles.deviceContainer}>
        {derivadores.map((derivador, index) => (
          <TouchableOpacity key={index} style={styles.deviceButton}>
            <View style={styles.deviceRow}>
              {/* Ícone do dispositivo */}
              <Image
                source={require("../assets/derivador-1.png")}
                style={styles.deviceIcon}
                resizeMode="contain"
              />
              {/* Informações do dispositivo */}
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceTitle}>{derivador.device_id}</Text>
                <Text style={styles.deviceLocation}>
                  Lat: {derivador.latitude?.toFixed(6) || 'N/A'}
                </Text>
                <Text style={styles.deviceLocation}>
                  Long: {derivador.longitude?.toFixed(6) || 'N/A'}
                </Text>
                <Text style={styles.deviceStatus}>
                  Última atualização: {new Date(derivador.timestamp || '').toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão de saída */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Mantém os estilos existentes
  container: {
    flex: 1,
    backgroundColor: "#041635",
    alignItems: "center",
    paddingTop: Platform.select({
      web: 30,
      native: 50,
    }),
    width: "100%",
    minHeight: height,
    maxWidth: Platform.select({
      web: 1000,
      native: width,
    }),
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deviceContainer: {
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    marginTop: 20,
    gap: 10,
    alignSelf: "center",
    flex: 1,
  },
  deviceButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  deviceInfo: {
    flexDirection: "column",
  },
  deviceTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 4,
  },
  deviceLocation: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default ViewDevice;