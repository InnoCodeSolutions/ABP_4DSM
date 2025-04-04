
// TELA RESPONSÍVEL PARA WEB E MOBILE


/*
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigaton';

// Simulação de um "banco de dados" local para armazenar usuários
const users: { username: string; password: string }[] = [];

type Props = StackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  return (
    <View style={styles.container}>
     
      <Image source={require('../assets/icon.png')} style={styles.logo} />

      
      <View style={styles.box}>
        
        <Text style={styles.title}>floatData</Text>

        
        <TextInput
          style={styles.input}
          placeholder="Email, nome de usuário"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
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
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      <Text style={styles.footer}>Made by Innocode Solutions</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A8A', // Dark blue background
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with 10% opacity
    borderRadius: 20, // Rounded corners
    padding: 30, // Padding inside the box
    width: '85%', // Slightly narrower than the screen
    alignItems: 'center', // Center the content inside the box
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    backgroundColor: '#D1D5DB',
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  registerButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  registerButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 12,
  },
});

export default LoginScreen;
export { users };
*/

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigaton';

// Simulação de um "banco de dados" local para armazenar usuários
const users: { username: string; password: string }[] = [];

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);

    if (user) {
      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.navigate('Home');
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../assets/icon.png')} style={styles.logo} />

      {/* Box Container */}
      <View style={styles.box}>
        {/* Title */}
        <Text style={styles.title}>floatData</Text>

        {/* Email/Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Email, nome de usuário"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={setUsername}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')} // This should navigate to RegisterScreen
          >
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  box: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    width: '85%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: 'bold',
  },
  input: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    fontSize: 16,
    ...Platform.select({
      web: { fontSize: 14 },
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  footer: {
    position: "absolute",
    bottom: 20,
    color: "#fff",
    fontSize: 12,
    ...Platform.select({
      web: { fontSize: 10 },
    }),
  },
});

export default LoginScreen;
export { users };