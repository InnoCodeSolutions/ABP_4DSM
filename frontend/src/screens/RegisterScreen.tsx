import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigation";
import axios from "axios";

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "Register">;

const BASE_URL = "http://192.168.0.101:3000"; //alterar de acordo com ip da sua rede por enquanto

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    if (!name || !surname || !email || !phone || !password) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/users`, {
        name,
        email,
        lastname: surname,
        password,
        phone,
      });
      console.log("Resposta do backend:", response.data);
      Alert.alert("Cadastro concluído", "Usuário cadastrado com sucesso!");
      navigation.navigate("Login");
    } catch (error: any) {
      console.log("Erro ao cadastrar:", error.message);
      if (error.response) {
        console.log("Resposta do servidor:", error.response.data);
        console.log("Status:", error.response.status);
        Alert.alert("Erro no cadastro", error.response?.data?.message || "Não foi possível cadastrar o usuário.");
      } else if (error.request) {
        console.log("N visualisation resposta recebida:", error.request);
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua rede.");
      } else {
        console.log("Erro:", error.message);
        Alert.alert("Erro inesperado", "Algo deu errado. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <View style={styles.box}>
        <Text style={styles.title}>Cadastrar</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#9CA3AF"
          value={surname}
          onChangeText={setSurname}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#9CA3AF"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.footer}>Made by Innocode Solutions</Text>
    </View>
  );
};

const scale = (size: number, max: number) => Math.min(size, max);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    paddingHorizontal: Platform.select({
      web: scale(width * 0.05, 30),
      native: width * 0.05,
    }),
    width: "100%",
    minHeight: height,
  },
  logo: {
    width: Platform.select({
      web: scale(width * 0.1, 80),
      native: width * 0.2,
    }),
    height: Platform.select({
      web: scale(width * 0.1, 80),
      native: width * 0.2,
    }),
    marginBottom: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.03,
    }),
    resizeMode: "contain",
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: Platform.select({
      web: scale(width * 0.05, 30),
      native: width * 0.08,
    }),
    width: Platform.select({
      web: scale(width * 0.5, 400),
      native: width > 600 ? width * 0.5 : width * 0.9,
    }),
    alignItems: "center",
  },
  title: {
    fontSize: Platform.select({
      web: scale(width * 0.05, 28),
      native: width * 0.07,
    }),
    color: "#fff",
    textAlign: "center",
    marginBottom: Platform.select({
      web: scale(height * 0.03, 30),
      native: height * 0.05,
    }),
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    padding: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    marginBottom: Platform.select({
      web: scale(height * 0.015, 15),
      native: height * 0.02,
    }),
    borderRadius: 10,
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.03,
    }),
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    borderRadius: 20,
    marginRight: Platform.select({
      web: scale(width * 0.03, 15),
      native: width * 0.04,
    }),
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: "bold",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  loginButtonText: {
    color: "#1E3A8A",
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: Platform.select({
      web: scale(height * 0.01, 20),
      native: height * 0.02,
    }),
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.02, 12),
      native: width * 0.03,
    }),
  },
});

export default RegisterScreen;