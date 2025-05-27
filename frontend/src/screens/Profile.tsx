import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import NavBar from "@/components/Navbar";
import { getProfile } from "@/service/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const scale = (size: number, max: number): number => Math.min(size, max);

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ navigation }) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');

                if (token) {
                    const data = await getProfile(token);
                    setUser(data);
                } else {
                    console.error("Token não encontrado no AsyncStorage");
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "#fff" }}>Não foi possível carregar o perfil.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("Home" as never)}
            >
                <MaterialCommunityIcons name="arrow-left" size={28} color="#fff" />
            </TouchableOpacity>

            <Image source={require("../assets/icon.png")} style={styles.logo} />
            <View style={styles.box}>
                <View
                    style={{
                        backgroundColor: "#000",
                        borderRadius: 100,
                        padding: 8,
                        marginBottom: Platform.select({
                            web: scale(height * 0.02, 20),
                            native: height * 0.03,
                        }),
                        borderWidth: 2,
                        borderColor: "#fff",
                    }}
                >
                    <MaterialIcons
                        name="person-pin"
                        size={Platform.select({
                            web: scale(width * 0.13, 80),
                            native: width * 0.25,
                        })}
                        color="#fff"
                    />
                </View>
                <Text style={styles.title}>{user.name}</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>E-mail</Text>
                    <Text style={styles.value}>{user.email}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>Telefone</Text>
                    <Text style={styles.value}>{user.phone}</Text>
                </View>
            </View>
            <Text style={styles.footer}>Made by Innocode Solutions</Text>
            <NavBar
                onPressHome={() => navigation.navigate("Home")}
                onPressDashboard={() => navigation.navigate("Dashboard")}
                onPressProfile={() => navigation.navigate("Profile")}
                selected="profile"
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E3A8A",
        paddingHorizontal: Platform.select({
            web: scale(width * 0.05, 30),
            native: width * 0.05,
        }),
        width: "100%",
        minHeight: height,
        paddingBottom: barHeight,
    },
    backButton: {
        position: "absolute",
        top: Platform.OS === "android" ? 48 : 64,
        left: 24,
        zIndex: 10,
        backgroundColor: "rgba(30, 58, 138, 0.7)",
        padding: 8,
        borderRadius: 20,
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
    field: {
        width: "100%",
        backgroundColor: "#D1D5DB",
        borderRadius: 10,
        padding: Platform.select({
            web: scale(height * 0.01, 12),
            native: height * 0.015,
        }),
        marginBottom: Platform.select({
            web: scale(height * 0.015, 15),
            native: height * 0.02,
        }),
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    label: {
        color: "#9CA3AF",
        fontSize: Platform.select({
            web: scale(width * 0.03, 14),
            native: width * 0.035,
        }),
        marginBottom: 2,
        fontWeight: "normal",
    },
    value: {
        color: "#1E293B",
        fontSize: Platform.select({
            web: scale(width * 0.03, 16),
            native: width * 0.04,
        }),
        fontWeight: "normal",
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

export default Profile;