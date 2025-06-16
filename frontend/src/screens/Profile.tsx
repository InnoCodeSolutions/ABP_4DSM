import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { MaterialIcons } from "@expo/vector-icons";
import NavBar from "@/components/Navbar";
import { getProfile } from "@/service/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const scale = (size: number, max: number): number => Math.min(size, max);

type Props = StackScreenProps<RootStackParamList, "Profile">;

const Profile: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get("window"));

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        console.log("Profile - Token:", token); // Log para debug
        if (token) {
          const data = await getProfile(token);
          console.log("Profile - Dados do perfil:", JSON.stringify(data, null, 2)); // Log detalhado
          setUser(data);
        } else {
          console.error("Profile - Token não encontrado no AsyncStorage");
        }
      } catch (error) {
        console.error("Profile - Erro ao buscar perfil:", JSON.stringify(error, null, 2));
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <ActivityIndicator size="large" color="#fff" />
      </ScrollView>
    );
  }

  if (!user) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={{ color: "#fff" }}>Não foi possível carregar o perfil.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
    >
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <View style={styles.box}>
        <View
          style={{
            backgroundColor: "#000",
            borderRadius: 100,
            padding: 8,
            marginBottom: Platform.select({
              web: scale(windowDimensions.height * 0.02, 20),
              native: windowDimensions.height * 0.03,
            }),
            borderWidth: 2,
            borderColor: "#fff",
          }}
        >
          <MaterialIcons
            name="person-pin"
            size={Platform.select({
              web: scale(windowDimensions.width * 0.13, 80),
              native: windowDimensions.width * 0.25,
            })}
            color="#fff"
          />
        </View>
        <Text style={styles.title}>{user.name || "Usuário não identificado"}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.value}>{user.email || "E-mail não disponível"}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>{user.phone || "Telefone não disponível"}</Text>
        </View>
      </View>
      <Text style={styles.footer}>Made by Innocode Solutions</Text>
      <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected="profile"
      />
    </ScrollView>
  );
};

const barHeight = Platform.select({
  ios: 54,
  android: 54,
  web: 60,
  default: 54,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#041635",
    width: "100%",
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "web" ? 20 : 50,
    paddingBottom: barHeight,
    minHeight: Dimensions.get("window").height,
    paddingHorizontal: Platform.select({
      web: scale(Dimensions.get("window").width * 0.05, 30),
      native: Dimensions.get("window").width * 0.05,
    }),
  },
  logo: {
    width: Platform.select({
      web: scale(Dimensions.get("window").width * 0.1, 80),
      native: Dimensions.get("window").width * 0.2,
    }),
    height: Platform.select({
      web: scale(Dimensions.get("window").width * 0.1, 80),
      native: Dimensions.get("window").width * 0.2,
    }),
    marginBottom: Platform.select({
      web: scale(Dimensions.get("window").height * 0.02, 20),
      native: Dimensions.get("window").height * 0.03,
    }),
    resizeMode: "contain",
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: Platform.select({
      web: scale(Dimensions.get("window").width * 0.05, 30),
      native: Dimensions.get("window").width * 0.08,
    }),
    width: Platform.select({
      web: scale(Dimensions.get("window").width * 0.5, 400),
      native:
        Dimensions.get("window").width > 600
          ? Dimensions.get("window").width * 0.5
          : Dimensions.get("window").width * 0.9,
    }),
    alignItems: "center",
  },
  title: {
    fontSize: Platform.select({
      web: scale(Dimensions.get("window").width * 0.05, 28),
      native: Dimensions.get("window").width * 0.07,
    }),
    color: "#fff",
    textAlign: "center",
    marginBottom: Platform.select({
      web: scale(Dimensions.get("window").height * 0.03, 30),
      native: Dimensions.get("window").height * 0.05,
    }),
    fontWeight: "bold",
  },
  field: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    borderRadius: 10,
    padding: Platform.select({
      web: scale(Dimensions.get("window").height * 0.01, 12),
      native: Dimensions.get("window").height * 0.015,
    }),
    marginBottom: Platform.select({
      web: scale(Dimensions.get("window").height * 0.015, 15),
      native: Dimensions.get("window").height * 0.02,
    }),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  label: {
    color: "#9CA3AF",
    fontSize: Platform.select({
      web: scale(Dimensions.get("window").width * 0.03, 14),
      native: Dimensions.get("window").width * 0.035,
    }),
    marginBottom: 2,
    fontWeight: "normal",
  },
  value: {
    color: "#1E293B",
    fontSize: Platform.select({
      web: scale(Dimensions.get("window").width * 0.03, 16),
      native: Dimensions.get("window").width * 0.04,
    }),
    fontWeight: "normal",
  },
  footer: {
    marginTop: Platform.select({
      web: scale(Dimensions.get("window").height * 0.01, 20),
      native: Dimensions.get("window").height * 0.02,
    }),
    color: "#fff",
    fontSize: Platform.select({
      web: scale(Dimensions.get("window").width * 0.02, 12),
      native: Dimensions.get("window").width * 0.03,
    }),
  },
});

export default Profile;