import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'navigation/AppNavigation';
import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions, Platform, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const scale = (size: number, max: number) => Math.min(size, max);

type ViewDeviceNavigationProp = NativeStackNavigationProp<RootStackParamList, "ViewDevice">;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<ViewDeviceNavigationProp>();
  return (
     <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}>
            <Text style={styles.headerText}>Sobre</Text>
        </TouchableOpacity>
          </View>
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.sectionTitle}>Descrição do Projeto:</Text>
      <Text style={styles.paragraph}>
        O projeto floatData é uma iniciativa da equipe Innocode Solutions no desafio de ABP
        (Aprendizagem Baseada em Projetos) proposto ao 4º semestre do curso de Desenvolvimento de Software Multiplataforma da Fatec Jacareí.
        Consiste na criação de um derivador com IoT utilizando Arduino e um sensor GPS, simulando um dispositivo flutuante para uso em ambientes marítimos.
      </Text>

      <Text style={styles.sectionTitle}>Objetivos:</Text>
      <Text style={styles.paragraph}>
        O floatData visa explorar e aplicar conceitos de Internet das Coisas (IoT) para melhorar a monitorização e resposta em situações de emergência em ambientes marítimos.
        Além disso, busca promover a inovação tecnológica e a segurança nas operações marítimas.
      </Text>

      <Text style={styles.sectionTitle}>Tecnologias:</Text>
      <Text style={styles.listItem}>• Arduino UNO (colocar modelo correto)</Text>
      <Text style={styles.listItem}>• Sensor GPS (colocar modelo correto)</Text>
      <Text style={styles.listItem}>• Desenvolvimento de Aplicação Mobile (colocar linguagens usadas?)</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041635',
    alignItems: 'center',
    paddingTop: Platform.select({ web: scale(height * 0.02, 30), native: 50 }),
    width: '100%',
    minHeight: height,
    maxWidth: Platform.select({ web: 1000, native: width }),
    alignSelf: 'center',
    paddingHorizontal: Platform.select({ web: scale(width * 0.05, 20), native: 20 }),
  },
  logo: {
    width: Platform.select({ web: scale(width * 0.2, 200), native: 150 }),
    height: Platform.select({ web: scale(width * 0.2, 200), native: 150 }),
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: Platform.select({ web: scale(width * 0.05, 26), native: 26 }),
    color: '#ffffff',
    fontWeight: 'bold',
    marginTop: Platform.select({ web: scale(height * 0.02, 20), native: 20 }),
    marginBottom: Platform.select({ web: scale(height * 0.01, 10), native: 10 }),
    textAlign: 'center',
  },
  paragraph: {
    fontSize: Platform.select({ web: scale(width * 0.035, 16), native: 16 }),
    color: '#ffffff',
    marginBottom: Platform.select({ web: scale(height * 0.02, 16), native: 16 }),
    textAlign: 'justify',
    width: Platform.select({ web: scale(width * 0.8, 800), native: width * 0.9 }),
  },
  listItem: {
    fontSize: Platform.select({ web: scale(width * 0.035, 16), native: 16 }),
    color: '#ffffff',
    marginBottom: Platform.select({ web: scale(height * 0.01, 6), native: 6 }),
    paddingLeft: 10,
    width: Platform.select({ web: scale(width * 0.8, 800), native: width * 0.9 }),
  },
  link: {
    fontSize: Platform.select({ web: scale(width * 0.035, 16), native: 16 }),
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.select({ web: scale(height * 0.03, 30), native: 30 }),
    padding: 10,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: Platform.select({
      web: 800,
      native: width * 0.9,
    }),
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: Platform.select({ web: scale(width * 0.03, 14), native: 14 }),
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AboutScreen;