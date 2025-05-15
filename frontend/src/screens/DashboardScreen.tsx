import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MapView, { Marker } from "react-native-maps";

let LeafletMap: any;
if (Platform.OS === "web") {
  LeafletMap = require("../components/LeafletMap").default;
}

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

const DashboardScreen: React.FC<Props> = () => {
  const route = useRoute<Props["route"]>();
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard: {device.name}</Text>

      {Platform.OS === "web" ? (
        LeafletMap && (
          <LeafletMap
            device={{
              name: device.name,
              latitude: -23.55052,
              longitude: -46.633308,
            }}
          />
        )
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -23.55052,
            longitude: -46.633308,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: -23.55052,
              longitude: -46.633308,
            }}
            title={device.name}
          />
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  map: {
    width: "90%",
    height: 300,
  },
});

export default DashboardScreen;
