import React, { useState, useEffect, useRef } from "react";
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
  KeyboardAvoidingView,
  ScrollView,
  TextInput as RNTextInput,
  findNodeHandle, // <<< Adicionar a importação
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigation";
import { register } from "../service/authService";

const { width, height } = Dimensions.get("window"); // 'height' aqui é a altura da janela

type Props = StackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [rawPhone, setRawPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  const fullNameRef = useRef<RNTextInput>(null);
  const lastNameRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const phoneRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // ... (outras funções como formatPhoneNumber, validators, etc., permanecem as mesmas) ...
  const formatPhoneNumber = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setRawPhone(digits);
    setPhone(formatPhoneNumber(digits));
    validatePhone(digits);
  };

  const validateFullName = (nameValue: string) => {
    let nameError = "";
    if (!nameValue.trim()) {
      nameError = "Nome é obrigatório.";
    } else if (nameValue.length < 2) {
      nameError = "Nome deve ter pelo menos 2 caracteres.";
    }
    setErrors((prev) => ({ ...prev, fullName: nameError }));
  };

  const validateLastName = (lastNameValue: string) => {
    let lastNameError = "";
    if (!lastNameValue.trim()) {
      lastNameError = "Sobrenome é obrigatório.";
    } else if (lastNameValue.length < 2) {
      lastNameError = "Sobrenome deve ter pelo menos 2 caracteres.";
    }
    setErrors((prev) => ({ ...prev, lastName: lastNameError }));
  };

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

  const validatePhone = (phoneValue: string) => {
    const phoneRegex = /^\d{10,11}$/;
    let phoneError = "";
    if (!phoneValue) {
      phoneError = "Telefone é obrigatório.";
    } else if (!phoneRegex.test(phoneValue)) {
      phoneError = "Telefone inválido (use 10 ou 11 dígitos).";
    }
    setErrors((prev) => ({ ...prev, phone: phoneError }));
  };

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

  const checkPasswordStrength = (pass: string) => {
    if (pass.length < 8) return "Fraca";
    const hasSpecialChar = /[!@#$%^&*]/.test(pass);
    const hasLettersAndNumbers = /^(?=.*[A-Za-z])(?=.*\d)/.test(pass);
    if (hasSpecialChar && hasLettersAndNumbers && pass.length >= 12) return "Forte";
    if (hasLettersAndNumbers && pass.length >= 8) return "Média";
    return "Fraca";
  };

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Nome é obrigatório.";
    } else if (fullName.length < 2) {
      newErrors.fullName = "Nome deve ter pelo menos 2 caracteres.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Sobrenome é obrigatório.";
    } else if (lastName.length < 2) {
      newErrors.lastName = "Sobrenome deve ter pelo menos 2 caracteres.";
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
      newErrors.phone = "Telefone inválido (use 10 ou 11 dígitos).";
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

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(password));
    validatePassword(password); // Validar a senha também no useEffect
  }, [password]);


  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      await register(fullName, lastName, email, rawPhone, password);
      console.log("Registration successful, showing alert and navigating...");
      
      setFullName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setRawPhone("");
      setPassword("");
      setErrors({});
      setPasswordStrength("");

      Alert.alert(
        "Bem-vindo!",
        "Cadastro realizado com sucesso!"
      );
      navigation.navigate("Login");

    } catch (error: any) {
      console.log("Full Error Response:", JSON.stringify(error.response, null, 2));
      if (error.response?.status === 400) {
        setErrors((prev) => ({ ...prev, email: "E-mail já cadastrado." }));
        Alert.alert("Erro no cadastro", "E-mail já cadastrado.");
      } else {
        const serverMessage = (error.response?.data?.message || error.message || "Erro ao cadastrar usuário").toLowerCase().trim();
        const displayMessage = serverMessage.includes("erro ao cadastrar") ? "Erro ao cadastrar usuário" : serverMessage;
        
        if (Platform.OS === "web") {
            setErrors((prev) => ({ ...prev, general: displayMessage }));
        } else {
            Alert.alert("Erro no cadastro", displayMessage);
        }
      }
    }
  };

  // CORREÇÃO APLICADA AQUI
  const handleFocus = (textInputRef: React.RefObject<RNTextInput>) => {
    if (scrollViewRef.current && textInputRef.current) {
      const scrollNode = findNodeHandle(scrollViewRef.current);
      if (scrollNode) {
        textInputRef.current.measureLayout(
          scrollNode,
          (x, yPositionOfInput, width, inputHeight) => {
            // yPositionOfInput é o deslocamento do topo do input em relação ao topo do conteúdo do ScrollView.
            // Role para que o input fique visível, por exemplo, 60px abaixo do topo da viewport do ScrollView.
            // Ajuste o focusFieldOffset conforme necessário para sua UI.
            const focusFieldOffset = 60; // Distância do topo da ScrollView até onde o campo focado deve ficar.
            let targetScrollY = yPositionOfInput - focusFieldOffset;

            // Evita rolar para uma posição negativa
            if (targetScrollY < 0) {
              targetScrollY = 0;
            }
            scrollViewRef.current?.scrollTo({ y: targetScrollY, animated: true });
          },
          () => {
            console.warn("Não foi possível medir o layout do text input para rolar.");
          }
        );
      } else {
        console.warn("Não foi possível obter o nó nativo do ScrollView para medir o layout.");
      }
    }
  };


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      enabled={Platform.OS === "ios" || Platform.OS === "android"}
      // O keyboardVerticalOffset pode precisar de ajuste fino, especialmente se houver um cabeçalho fixo.
      // Para Android, se houver uma barra de status translúcida ou outros elementos, pode ser necessário um valor.
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 20, default: 0 })}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <View style={styles.box}>
          <Text style={styles.title}>Cadastrar</Text>
          {/* Inputs com onFocus chamando a handleFocus corrigida */}
          <TextInput
            ref={fullNameRef}
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="#9CA3AF"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              validateFullName(text);
            }}
            onFocus={() => handleFocus(fullNameRef)} // Chamada corrigida
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current?.focus()}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          
          <TextInput
            ref={lastNameRef}
            style={styles.input}
            placeholder="Sobrenome"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              validateLastName(text);
            }}
            onFocus={() => handleFocus(lastNameRef)} // Chamada corrigida
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            onFocus={() => handleFocus(emailRef)} // Chamada corrigida
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            ref={phoneRef}
            style={styles.input}
            placeholder="Telefone (ex: (12) 93456-7890)"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={handlePhoneChange}
            onFocus={() => handleFocus(phoneRef)} // Chamada corrigida
            keyboardType="phone-pad"
            maxLength={15} 
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <TextInput
            ref={passwordRef}
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            onFocus={() => handleFocus(passwordRef)} // Chamada corrigida
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
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
          {Platform.OS === 'web' && errors.general && <Text style={styles.errorText}>{errors.general}</Text>}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.footer}>Made by Innocode Solutions</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Funções de escala e estilos permanecem os mesmos...
// ... (styles StyleSheet.create({...}) code remains the same as your provided version)
const scaleFont = (size: number, factor: number, min: number, max: number) => {
  const scaled = size * factor;
  return Math.min(Math.max(scaled, min), max);
};

const scaleSpacing = (size: number, factor: number, min: number, max: number) => {
  const scaled = size * factor;
  return Math.min(Math.max(scaled, min), max);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Platform.select({
      web: scaleSpacing(width * 0.05, 1, 20, 40),
      native: scaleSpacing(width * 0.05, 1, 15, 30),
    }),
    paddingVertical: Platform.select({ 
        web: scaleSpacing(height * 0.02, 1, 20, 40),
        native: scaleSpacing(height * 0.02, 1, 20, 40),
    }),
  },
  logo: {
    width: Platform.select({
      web: scaleSpacing(width * 0.1, 1, 60, 80),
      native: scaleSpacing(width * 0.15, 1, 50, 70),
    }),
    height: Platform.select({
      web: scaleSpacing(width * 0.1, 1, 60, 80),
      native: scaleSpacing(width * 0.15, 1, 50, 70),
    }),
    marginBottom: Platform.select({ 
      web: scaleSpacing(height * 0.01, 1, 10, 20),
      native: scaleSpacing(height * 0.01, 1, 10, 20),
    }),
    resizeMode: "contain",
  },
  box: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: Platform.select({
      web: scaleSpacing(width * 0.05, 1, 20, 40),
      native: scaleSpacing(width * 0.06, 1, 15, 30),
    }),
    width: Platform.select({
      web: scaleSpacing(width * 0.5, 1, 300, 400),
      native: width > 600 ? scaleSpacing(width * 0.5, 1, 300, 400) : scaleSpacing(width * 0.85, 1, 250, 350),
    }),
    alignItems: "center",
  },
  title: {
    fontSize: Platform.select({
      web: scaleFont(width * 0.05, 1, 24, 28),
      native: scaleFont(width * 0.06, 1, 20, 26),
    }),
    color: "#fff",
    textAlign: "center",
    marginBottom: Platform.select({
      web: scaleSpacing(height * 0.02, 1, 15, 30), 
      native: scaleSpacing(height * 0.02, 1, 15, 30), 
    }),
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    paddingVertical: Platform.select({ 
        web: scaleSpacing(height * 0.012, 1, 10, 14),
        native: scaleSpacing(height * 0.015, 1, 12, 16),
    }),
    paddingHorizontal: scaleSpacing(width * 0.03, 1, 10, 15), 
    marginBottom: Platform.select({
      web: scaleSpacing(height * 0.01, 1, 8, 15), 
      native: scaleSpacing(height * 0.01, 1, 8, 15), 
    }),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: Platform.select({
      web: scaleFont(width * 0.03, 1, 14, 16),
      native: scaleFont(width * 0.035, 1, 14, 16), 
    }),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  errorText: {
    color: "#FFDDDD", 
    fontSize: Platform.select({
      web: scaleFont(width * 0.025, 1, 11, 13), 
      native: scaleFont(width * 0.03, 1, 11, 13),   
    }),
    marginBottom: Platform.select({ 
        web: scaleSpacing(height * 0.01, 1, 5, 10),
        native: scaleSpacing(height * 0.01, 1, 5, 10),
    }),
    textAlign: "left",
    width: "100%",
    paddingLeft: 5, 
  },
  strengthText: {
    fontSize: Platform.select({
      web: scaleFont(width * 0.025, 1, 11, 13), 
      native: scaleFont(width * 0.03, 1, 11, 13),   
    }),
    marginBottom: Platform.select({
      web: scaleSpacing(height * 0.01, 1, 8, 15), 
      native: scaleSpacing(height * 0.01, 1, 8, 15), 
    }),
    textAlign: "left",
    width: "100%",
    paddingLeft: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: Platform.select({
      web: scaleSpacing(height * 0.015, 1, 10, 25), 
      native: scaleSpacing(height * 0.015, 1, 10, 25), 
    }),
  },
  registerButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: Platform.select({
      web: scaleSpacing(height * 0.012, 1, 10, 14),
      native: scaleSpacing(height * 0.015, 1, 12, 16),
    }),
    borderRadius: 20,
    marginRight: Platform.select({ 
      web: scaleSpacing(width * 0.01, 1, 5, 10),
      native: scaleSpacing(width * 0.02, 1, 8, 10),
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
      web: scaleFont(width * 0.03, 1, 14, 16),
      native: scaleFont(width * 0.035, 1, 14, 16), 
    }),
    fontWeight: "bold",
  },
  loginButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: Platform.select({
      web: scaleSpacing(height * 0.012, 1, 10, 14),
      native: scaleSpacing(height * 0.015, 1, 12, 16),
    }),
    borderRadius: 20,
    marginLeft: Platform.select({ 
        web: scaleSpacing(width * 0.01, 1, 5, 10),
        native: scaleSpacing(width * 0.02, 1, 8, 10),
    }),
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
      web: scaleFont(width * 0.03, 1, 14, 16),
      native: scaleFont(width * 0.035, 1, 14, 16), 
    }),
    fontWeight: "bold",
  },
  footer: {
    color: "#fff", 
    fontSize: Platform.select({
      web: scaleFont(width * 0.02, 1, 10, 12),
      native: scaleFont(width * 0.025, 1, 10, 12), 
    }),
    marginTop: Platform.select({ 
      web: scaleSpacing(height * 0.02, 1, 20, 30),
      native: scaleSpacing(height * 0.02, 1, 20, 30),
    }),
  },
});

export default RegisterScreen;