import React, { useState, useEffect } from "react";
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
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigation";
import { register } from "../service/authService";

const { width, height } = Dimensions.get("window");

type Props = StackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  // Format Brazilian phone number as (XX) XXXX-XXXX or (XX) XXXXX-XXXX
  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  // Handle phone input changes
  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setRawPhone(digits);
    setPhone(formatPhoneNumber(digits));
    validatePhone(digits);
  };

  // Validate email in real-time
  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let emailError = "";
    if (!emailValue.trim()) {
      emailError = "E-mail é obrigatório.";
    } else if (!emailRegex.test(emailValue)) {
      emailError = "E-mail inválido.";
    }
    setErrors((prev) => ({ ...prev, email: emailError }));
  };

  // Validate phone in real-time
  const validatePhone = (phoneValue: string) => {
    const phoneRegex = /^\d{10,11}$/;
    let phoneError = "";
    if (!phoneValue) {
      phoneError = "Telefone é obrigatório.";
    } else if (!phoneRegex.test(phoneValue)) {
      phoneError = "Telefone inválido (use 10 ou 11 dígitos, ex: (12) 3456-7890 ou (12) 93456-7890).";
    }
    setErrors((prev) => ({ ...prev, phone: phoneError }));
  };

  // Validate full name
  const validateFullName = (nameValue: string) => {
    let nameError = "";
    if (!nameValue.trim()) {
      nameError = "Nome completo é obrigatório.";
    } else if (nameValue.length < 2) {
      nameError = "Nome deve ter pelo menos 2 caracteres.";
    }
    setErrors((prev) => ({ ...prev, fullName: nameError }));
  };

  // Validate password
  const validatePassword = (passValue: string) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    let passError = "";
    if (!passValue) {
      passError = "Senha é obrigatória.";
    } else if (!passwordRegex.test(passValue)) {
      passError = "Senha deve ter 8+ caracteres, com letras e números.";
    }
    setErrors((prev) => ({ ...prev, password: passError }));
  };

  // Validate inputs on form submission
  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório.";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Nome deve ter pelo menos 2 caracteres.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "E-mail inválido.";
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!rawPhone) {
      newErrors.phone = "Telefone é obrigatório.";
    } else if (!phoneRegex.test(rawPhone)) {
      newErrors.phone = "Telefone inválido (use 10 ou 11 dígitos, ex: (12) 3456-7890 ou (12) 93456-7890).";
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!password) {
      newErrors.password = "Senha é obrigatória.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Senha deve ter 8+ caracteres, com letras e números.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (pass: string) => {
    if (pass.length < 8) return "Fraca";
    const hasSpecialChar = /[!@#$%^&*]/.test(pass);
    const hasLettersAndNumbers = /^(?=.*[A-Za-z])(?=.*\d)/.test(pass);
    if (hasSpecialChar && hasLettersAndNumbers && pass.length >= 12) return "Forte";
    if (hasLettersAndNumbers && pass.length >= 8) return "Média";
    return "Fraca";
  };

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
    validatePassword(password);
  }, [password]);

  const handleRegister = async () => {
    if (!validateInputs()) {
      Alert.alert("Erro", "Corrija os erros nos campos antes de continuar.");
      return;
    }

    try {
      const response = await register(fullName, "", email, rawPhone, password);
      setModalVisible(true);
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          "Erro no cadastro",
          error.response?.data?.message || "Não foi possível cadastrar o usuário."
        );
      } else if (error.request) {
        Alert.alert(
          "Erro de conexão",
          "Não foi possível conectar ao servidor. Verifique sua rede."
        );
      } else {
        Alert.alert("Erro inesperado", "Algo deu errado. Tente novamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <View style={styles.box}>
        <Text style={styles.title}>Cadastrar</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Nome completo"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              validateFullName(text);
            }}
            onBlur={() => validateFullName(fullName)}
            autoCapitalize="words"
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="E-mail"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            onBlur={() => validateEmail(email)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.phone && styles.inputError]}
            placeholder="Telefone (ex: (12) 93456-7890)"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={handlePhoneChange}
            onBlur={() => validatePhone(rawPhone)}
            keyboardType="phone-pad"
            maxLength={15} // (XX) XXXXX-XXXX
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {password && (
            <Text
              style={[
                styles.strengthText,
                {
                  color:
                    passwordStrength === "Forte"
                      ? "#22C55E"
                      : passwordStrength === "Média"
                      ? "#F59E0B"
                      : "#EF4444",
                },
              ]}
            >
              Força da senha: {passwordStrength}
            </Text>
          )}
        </View>

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

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>Made by Innocode Solutions</Text>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>d'eriva</Text>
            <Text style={styles.modalMessage}>
              Sucesso!{"\n"}O seu cadastro foi concluído com sucesso. Clique para entrar.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLoginButton}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Login");
                }}
              >
                <Text style={styles.modalButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  inputContainer: {
    width: "100%",
    marginBottom: Platform.select({
      web: scale(height * 0.015, 15),
      native: height * 0.02,
    }),
  },
  input: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    padding: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    marginBottom: 0,
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
  inputError: {
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  errorText: {
  color: "#fff", // Changed to white for better contrast and aesthetics
  fontSize: Platform.select({
    web: scale(width * 0.03, 14), // Increased font size for web
    native: width * 0.04, // Increased font size for mobile
  }),
  marginTop: 4,
  paddingVertical: 2, // Added for better spacing
},
  strengthText: {
    fontSize: Platform.select({
      web: scale(width * 0.025, 12),
      native: width * 0.035,
    }),
    marginTop: 4,
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
  forgotPassword: {
    marginTop: Platform.select({
      web: scale(height * 0.015, 15),
      native: height * 0.02,
    }),
  },
  forgotPasswordText: {
    color: "#fff",
    fontSize: Platform.select({
      web: scale(width * 0.03, 14),
      native: width * 0.035,
    }),
    textDecorationLine: "underline",
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: Platform.select({
      web: scale(width * 0.5, 300),
      native: width * 0.8,
    }),
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: Platform.select({
      web: scale(width * 0.05, 24),
      native: 24,
    }),
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: 16,
    }),
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#3B82F6",
  },
  modalCancelButtonText: {
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: 16,
    }),
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  modalLoginButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: 16,
    }),
    fontWeight: "bold",
    color: "#fff",
  },
});

export default RegisterScreen;