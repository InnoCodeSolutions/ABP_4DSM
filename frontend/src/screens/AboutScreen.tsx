import NavBar from '@/components/Navbar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions, Platform, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const scale = (size: number, max: number) => Math.min(size, max);

type ViewDeviceNavigationProp = NativeStackNavigationProp<RootStackParamList, "About">;


const AboutScreen: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();
  return (
     <View style={styles.container}>
    <ScrollView style={{ width: '100%' }} contentContainerStyle={{ ...styles.scrollContent, flexGrow: 1 }}>
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.sectionTitle}>Descrição do Projeto:</Text>
      <Text style={styles.paragraph}>
        O projeto floatData é uma iniciativa da equipe Innocode Solutions no desafio de ABP
        (Aprendizagem Baseada em Projetos) proposto ao 4º semestre do curso de Desenvolvimento de Software Multiplataforma da Fatec Jacareí.
        Consiste na criação de um derivador com IoT utilizando Esp32 e um sensor GPS, simulando um dispositivo flutuante para uso em ambientes marítimos.
      </Text>

      <Text style={styles.sectionTitle}>Objetivos:</Text>
      <Text style={styles.paragraph}>
        O floatData visa explorar e aplicar conceitos de Internet das Coisas (IoT) 
        para melhorar a monitorização e resposta em situações de emergência em ambientes marítimos.
        Além disso, busca promover a inovação tecnológica e a segurança nas operações marítimas.
      </Text>

      <Text style={styles.sectionTitle}>Tecnologias:</Text>
      <Text style={styles.listItem}>• ESP32</Text>
      <Text style={styles.listItem}>• Sensor GPS (Modelo: NEO-6M)</Text>
      <Text style={styles.listItem}>• Desenvolvimento de Aplicação Mobile (Linguagens usadas: Typescript, React)</Text>
      <Text style={styles.listItem}>• Integração de Dados e Dashboard</Text>

      <Text style={styles.sectionTitle}>Impacto esperado:</Text>
      <Text style={styles.paragraph}>
        Espera-se que o projeto floatData contribua significativamente para o entendimento e desenvolvimento de soluções tecnológicas aplicáveis ao monitoramento marítimo,
        melhorando a eficiência operacional e a segurança dos usuários.
      </Text>

      <Text style={styles.sectionTitle}>Contato:</Text>
      <Text style={styles.paragraph}>
        Para mais informações sobre o projeto floatData ou para colaborações futuras, entre em contato conosco através do e-mail:{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('mailto:innocodesolutions@gmail.com')}
        >
          innocodesolutions@gmail.com
        </Text>
      </Text>

      <TouchableOpacity style={styles.infoButton} onPress={() => Linking.openURL('https://github.com/InnoCodeSolutions')}>
        <Icon name="github" size={Platform.select({ web: scale(width * 0.05, 50), native: 50 })} color="#fff" />
        <Text style={styles.buttonText}>Repositório</Text>
      </TouchableOpacity>
    </ScrollView>
    <NavBar
        onPressHome={() => navigation.navigate("Home")}
        onPressDashboard={() => navigation.navigate("Dashboard")}
        onPressProfile={() => navigation.navigate("Profile")}
        selected=""
      />
    </View>
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
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: Platform.OS === "web" ? 30 : 50,
    paddingBottom: barHeight,
    alignSelf: "center",
  },
  logo: {
    width: 90,
    height: 100,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 16,
    textAlign: "justify",
    width: "100%",
  },
  listItem: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
    paddingLeft: 10,
    width: "100%",
  },
  link: {
    fontSize: 16,
    color: "#3B82F6",
    textDecorationLine: "underline",
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    padding: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
  width:'100%',
  alignItems: Platform.OS === "web" ? "center" : "center",
  justifyContent: "flex-start",
  paddingHorizontal: 20,
  paddingBottom: 100,
},
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
});

export default AboutScreen;