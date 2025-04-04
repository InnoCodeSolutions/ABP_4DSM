import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NotFoundScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>Esta tela não existe.</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home" as never)}
      >
        <Text style={styles.buttonText}>Voltar para a Home</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#041635",
  },
});

export default NotFoundScreen;
