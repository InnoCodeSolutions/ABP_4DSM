import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const [LeafletMap, setLeafletMap] = useState<React.ComponentType<any> | null>(
    null
  );
  const [MapComponent, setMapComponent] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      import("../components/LeafletMap")
        .then((module) => setLeafletMap(() => module.default))
        .catch((err) => console.error("Erro ao carregar LeafletMap:", err));
    } else {
      import("react-native-maps")
        .then((module) => setMapComponent(() => module.default))
        .catch((err) =>
          console.error("Erro ao carregar react-native-maps:", err)
        );
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
          <Text style={styles.headerText}>Sair</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Sobre o App",
              "Este aplicativo permite monitorar dispositivos, visualizar gráficos, acessar o mapa e tirar dúvidas sobre seu funcionamento."
            )
          }
        >
          <Text style={styles.headerText}>Sobre</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.greeting}>Olá, Usuário</Text>

      {Platform.OS === "web"
        ? LeafletMap && (
            <View style={styles.mapContainer}>
              <LeafletMap />
            </View>
          )
        : MapComponent && (
            <MapComponent
              style={styles.map}
              initialRegion={{
                latitude: -22.9068,
                longitude: -43.1729,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            />
          )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ViewDevice" as never)}
        >
          <Image
            source={require("../assets/dispositivo.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Dispositivos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image
            source={require("../assets/grafico.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require("../assets/mapa.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Image source={require("../assets/duvida.png")} style={styles.icon} />
          <Text style={styles.buttonText}>A definir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    alignItems: "center",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 2,
    zIndex: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
  },
  greeting: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginLeft: "5%",
    marginBottom: 5,
    paddingTop: 40,
  },
  mapContainer: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    width: "90%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 20,
    paddingTop: 60,
  },
  button: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    aspectRatio: 1,
    marginBottom: 40,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
});

export default HomePage;
