import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ScrollView,
  TextInput,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Derivador, GeoJSONRoute } from "../service/deviceService";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Animated, Easing } from "react-native";
import { BACKEND_HOST } from '@env';

const { width, height } = Dimensions.get("window");

interface RouteSelectorPopupProps {
  visible: boolean;
  onClose: () => void;
  devices: Derivador[];
  onSelectRoute: (deviceId: string, timeRange?: string, isMaritime?: boolean, route?: GeoJSONRoute) => void;
}

const RouteSelectorPopup: React.FC<RouteSelectorPopupProps> = ({
  visible,
  onClose,
  devices,
  onSelectRoute,
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(""); // e.g., "2025-05-23"
  const [startTime, setStartTime] = useState<string>(""); // e.g., "10:00"
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [period, setPeriod] = useState<"day" | "range" | "all">("day");
  const [isMaritime, setIsMaritime] = useState<boolean>(false); // Mantido por compatibilidade com onSelectRoute
  const [error, setError] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<GeoJSONRoute | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const API_URL = `https://${BACKEND_HOST}`;
  console.log('>>> BACKEND_HOST =', BACKEND_HOST);
  console.log('>>> BASE_URL    =', `https://${BACKEND_HOST}`);
  const validateDate = (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date); // YYYY-MM-DD
  };

  const validateTime = (time: string): boolean => {
    return /^\d{2}:\d{2}$/.test(time); // HH:MM
  };

  // Fetch route data with the correct token key 'authToken'
  const fetchRouteData = async (deviceId: string, timeRange?: string, isMaritime?: boolean): Promise<GeoJSONRoute | null> => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      console.log("Retrieved token:", token);
      if (!token) {
        throw new Error("No token found in AsyncStorage");
      }
      const response = await axios.get(`${API_URL}/api/routes/device/${deviceId}/route`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeRange, isMaritime },
      });
      return response.data as GeoJSONRoute;
    } catch (err) {
      console.error("Error fetching route data:", err);
      if (axios.isAxiosError(err)) {
        console.error("Axios error details:", err.response?.data);
      }
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedDeviceId) {
      setError("Selecione um dispositivo.");
      return;
    }

    let timeRange: string | undefined;
    setError("");

    if (period === "day") {
      if (!startDate || !validateDate(startDate)) {
        setError("Data inválida. Use o formato YYYY-MM-DD (ex: 2025-05-23).");
        return;
      }
      timeRange = startDate;
    } else if (period === "range") {
      if (!startDate || !endDate || !validateDate(startDate) || !validateDate(endDate)) {
        setError("Datas inválidas. Use o formato YYYY-MM-DD (ex: 2025-05-23).");
        return;
      }
      if ((startTime && !validateTime(startTime)) || (endTime && !validateTime(endTime))) {
        setError("Horas inválidas. Use o formato HH:MM (ex: 10:00).");
        return;
      }
      const start = startTime ? `${startDate}T${startTime}:00Z` : `${startDate}T00:00:00Z`;
      const end = endTime ? `${endDate}T${endTime}:00Z` : `${endDate}T23:59:59Z`;
      timeRange = `${start},${end}`;
    } else if (period === "all") {
      timeRange = undefined;
    }

    const routeData = await fetchRouteData(selectedDeviceId, timeRange, isMaritime);
    if (!routeData) {
      setError("Não foi possível carregar a rota. Verifique sua autenticação e tente novamente.");
      return;
    }

    setSelectedRoute(routeData);
    console.log("RouteSelectorPopup: Submitting route selection:", {
      deviceId: selectedDeviceId,
      timeRange,
      isMaritime,
      route: routeData,
    });
    onSelectRoute(selectedDeviceId, timeRange, isMaritime, routeData);
  };

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200, // Corrigido de "duration10n" para "duration"
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Selecionar Rota</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.section}>
              <Text style={styles.label}>Dispositivo</Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                <Text style={styles.dropdownText}>
                  {selectedDeviceId || "Selecione um dispositivo"}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#333" />
              </TouchableOpacity>
              {dropdownVisible && (
                <Animated.View style={[styles.pickerDropdown, { opacity: fadeAnim }]}>
                  <ScrollView nestedScrollEnabled>
                    {[{ device_id: null, label: "Selecione um dispositivo" }, ...devices.map((d) => ({ device_id: d.device_id, label: d.device_id }))].map((item) => (
                      <TouchableOpacity
                        key={item.device_id || "null"}
                        style={styles.pickerItem}
                        onPress={() => {
                          setSelectedDeviceId(item.device_id);
                          toggleDropdown();
                        }}
                      >
                        <Text style={styles.pickerItemText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </Animated.View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Período</Text>
              <View style={styles.periodButtons}>
                {["day", "range", "all"].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.periodButton,
                      period === p && styles.periodButtonSelected,
                    ]}
                    onPress={() => setPeriod(p as "day" | "range" | "all")}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        period === p && styles.periodButtonTextSelected,
                      ]}
                    >
                      {p === "day" ? "Dia" : p === "range" ? "Intervalo" : "Todo Período"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {period === "day" && (
              <View style={styles.section}>
                {renderDateInput("Data", startDate, setStartDate)}
              </View>
            )}

            {period === "range" && (
              <View style={styles.section}>
                {renderDateInput("Data Início", startDate, setStartDate)}
                {renderTimeInput("Hora Início", startTime, setStartTime)}
                {renderDateInput("Data Fim", endDate, setEndDate)}
                {renderTimeInput("Hora Fim", endTime, setEndTime)}
              </View>
            )}

            {/* Removida a seção do Switch "Rota Marítima" */}
            <TouchableOpacity
              style={[styles.submitButton, !selectedDeviceId && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!selectedDeviceId}
            >
              <Text style={styles.submitButtonText}>Carregar Rota</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  function renderDateInput(
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string = "YYYY-MM-DD"
  ) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>
    );
  }

  function renderTimeInput(
    label: string,
    value: string,
    onChange: (text: string) => void,
    placeholder: string = "HH:MM"
  ) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: Platform.select({
      web: Math.min(width * 0.8, 500),
      native: width * 0.9,
    }),
    maxHeight: height * 0.85,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#041635",
  },
  closeButton: {
    padding: 8,
  },
  scrollContainer: {
    maxHeight: height * 0.7,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  pickerDropdown: {
    marginTop: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 200,
    backgroundColor: "#fff",
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  periodButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 1,
  },
  periodButtonSelected: {
    backgroundColor: "#3B82F6",
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 16,
    color: "#333",
  },
  periodButtonTextSelected: {
    color: "#fff",
    fontWeight: "500",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  submitButton: {
    backgroundColor: "#041635",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default RouteSelectorPopup;