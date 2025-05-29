// ... (importações mantidas)
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
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";
import { login, requestPasswordReset } from "../service/authService";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ResetPasswordPopup from "../components/ResetPasswordPopup";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Icon: any = MaterialCommunityIcons;

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetPopupVisible, setIsResetPopupVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos obrigatórios", "Por favor, preencha e-mail e senha.");
      return;
    }

    try {
      const response = await login(email, password);
      const token = response?.token || response;
      if (!token || typeof token !== 'string') {
        throw new Error("Token inválido recebido: " + JSON.stringify(token));
      }
      await AsyncStorage.setItem('authToken', token);
      const savedToken = await AsyncStorage.getItem('authToken');
      if (savedToken !== token) {
        throw new Error("Token salvo incorretamente no AsyncStorage");
      }
      Alert.alert("Bem-vindo!", "Login realizado com sucesso!");
      navigation.navigate("Home");
    } catch (error: any) {
      if (error.response) {
        Alert.alert("Erro no login", error.response?.data?.message || "E-mail ou senha incorretos.");
      } else if (error.request) {
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua rede.");
      } else {
        Alert.alert("Erro inesperado", error.message || "Algo deu errado. Tente novamente.");
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Campo obrigatório", "Por favor, insira um e-mail.");
      return;
    }

    try {
      await requestPasswordReset(resetEmail);
      Alert.alert("Sucesso", "Código enviado! Verifique seu e-mail.");
      setIsModalVisible(false);
      setIsResetPopupVisible(true);
    } catch (error: any) {
      const message = error.response?.status === 404
        ? "Serviço de redefinição de senha não encontrado. Verifique se o servidor está ativo."
        : error.response?.data?.message || "Não foi possível enviar o código. Tente novamente.";
      Alert.alert("Erro", message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.box}>
        <Text style={styles.title}>floatData</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          accessibilityLabel="E-mail"
        />

        {/* Campo de senha com botão de mostrar/ocultar */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            accessibilityLabel="Senha"
            onSubmitEditing={handleLogin}
            returnKeyType="go"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recuperar Senha</Text>
              <TouchableOpacity onPress={() => {setIsModalVisible(false); setResetEmail("");}}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="E-mail"
              placeholderTextColor="#9CA3AF"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              accessibilityLabel="E-mail para recuperação"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {setIsModalVisible(false); setResetEmail("");}}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSendButton}
                onPress={handlePasswordReset}
              >
                <Text style={styles.modalSendText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ResetPasswordPopup
        visible={isResetPopupVisible}
        onClose={() => setIsResetPopupVisible(false)}
        email={resetEmail}
      />

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
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.select({
      web: scale(height * 0.015, 15),
      native: height * 0.02,
    }),
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    padding: 8,
  },
  forgotButton: {
    alignSelf: "flex-end",
    padding: Platform.select({
      web: scale(height * 0.01, 10),
      native: height * 0.01,
    }),
  },
  forgotText: {
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.03, 14),
      native: width * 0.04,
    }),
    fontWeight: "500",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  registerButtonText: {
    textAlign: "center",
    color: "#1E3A8A",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  loginButtonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalInput: {
    backgroundColor: "#D1D5DB",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalCancelButton: {
    marginRight: 10,
  },
  modalCancelText: {
    color: "#6B7280",
    fontWeight: "bold",
  },
  modalSendButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 10,
  },
  modalSendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 30,
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
});

export default LoginScreen;
