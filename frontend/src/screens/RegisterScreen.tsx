// código muito bom, não mudar

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigation";
import { users } from "./LoginScreen";

type Props = StackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = () => {
    navigation.navigate("Home");
  };

  {
    /*
    // usar quando estiver com a api pronta
    
    if (!name || !surname || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Add the new user to the "users" array (for now, we’ll assume email is the username and phone is the password)
    users.push({ username: email, password: password });
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
    navigation.navigate('Login'); // Navigate back to Login after registration
  };
  */
  }
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/icon.png")} style={styles.logo} />

      {/* Box Container */}
      <View style={styles.box}>
        {/* Title */}
        <Text style={styles.title}>floatData</Text>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        {/* Surname Input */}
        <TextInput
          style={styles.input}
          placeholder="Sobrenome"
          placeholderTextColor="#9CA3AF"
          value={surname}
          onChangeText={setSurname}
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Digite o E-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Phone Input */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          keyboardType="visible-password"
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
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

      {/* Footer */}
      <Text style={styles.footer}>Made by Innocode Solutions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#041635",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Same 10% opacity as LoginScreen
    borderRadius: 20,
    padding: 30,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
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
    marginTop: 20,
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  registerButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    color: "#fff",
    fontSize: 12,
  },
});

export default RegisterScreen;
