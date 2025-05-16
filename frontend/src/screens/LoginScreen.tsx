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
import { RootStackParamList } from "../navigation/AppNavigation";
import { login, requestPasswordReset } from "../service/authService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ResetPasswordPopup from "../components/ResetPasswordPopup";

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("Resposta do backend:", response);
      Alert.alert("Bem-vindo!", "Login realizado com sucesso!");
      navigation.navigate("Home");
    } catch (error: any) {
      console.log("Erro ao fazer login:", error.message);
      if (error.response) {
        console.log("Resposta do servidor:", error.response.data);
        Alert.alert("Erro no login", error.response?.data?.message || "E-mail ou senha incorretos.");
      } else if (error.request) {
        console.log("Nenhuma resposta recebida:", error.request);
        Alert.alert("Erro de conexão", "Não foi possível conectar ao servidor. Verifique sua rede.");
      } else {
        console.log("Erro:", error.message);
        Alert.alert("Erro inesperado", "Algo deu errado. Tente novamente.");
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
      console.log("Erro ao solicitar redefinição:", error.message);
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
        <TextInput
  style={styles.input}
  placeholder="Senha"
  placeholderTextColor="#9CA3AF"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
  accessibilityLabel="Senha"
  onSubmitEditing={handleLogin}
  returnKeyType="go"
/>

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
    marginTop: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.03,
    }),
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#1E3A8A",
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: "bold",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
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
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
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
    width: Platform.select({
      web: scale(width * 0.5, 400),
      native: width > 600 ? width * 0.5 : width * 0.9,
    }),
    borderRadius: 20,
    padding: Platform.select({
      web: scale(width * 0.05, 30),
      native: width * 0.08,
    }),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.02,
    }),
  },
  modalTitle: {
    fontSize: Platform.select({
      web: scale(width * 0.04, 20),
      native: width * 0.05,
    }),
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  modalInput: {
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.03,
    }),
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#fff",
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
  modalCancelText: {
    color: "#1E3A8A",
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: "bold",
  },
  modalSendButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
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
  modalSendText: {
    color: "#fff",
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

export default LoginScreen;