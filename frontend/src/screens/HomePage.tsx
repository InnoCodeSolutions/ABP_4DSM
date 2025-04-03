import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const HomePage: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, Usuário</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -22.9068,
          longitude: -43.1729,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={{ latitude: -22.9068, longitude: -43.1729 }} />
      </MapView>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
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
  greeting: {
    fontSize: 26, 
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "flex-start", 
    marginLeft: "5%", 
  },
  map: {
    width: "90%",
    height: 200,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 20, 
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: "center",
    width: "42%",
    aspectRatio: 1, 
  },
  icon: {
    width: 50, 
    height: 50, 
    marginBottom: 8, 
  },
  buttonText: {
    fontSize: 18, 
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomePage;
