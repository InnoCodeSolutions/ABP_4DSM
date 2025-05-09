import axios from "axios";
import config from "@config/config.json";

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

export interface Derivador {
  title: string;
  latitude: string;
  longitude: string;
  latNumber: number;
  lonNumber: number;
  percentage?: number;
  direction?: string;
}

export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/gps`);
    const data: Derivador[] = response.data;
    return data.map((item) => ({
      title: item.title || "Desconhecido",
      latNumber: item.latNumber || 0,
      lonNumber: item.lonNumber || 0,
      latitude: formatCoordinate(item.latNumber || 0, true),
      longitude: formatCoordinate(item.lonNumber || 0, false),
      percentage: item.percentage || 0,
      direction: item.direction || "Desconhecido",
    }));
  } catch (error) {
    throw error;
  }
};

// Função para formatar latitude e longitude com direção
const formatCoordinate = (value: number, isLatitude: boolean) => {
  const direction = isLatitude
    ? value >= 0
      ? "Norte"
      : "Sul"
    : value >= 0
      ? "Leste"
      : "Oeste";
  const prefix = isLatitude ? "Lt: " : "Lg: ";
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value).toFixed(3);
  return `${prefix}${sign}${absValue}° ${direction}`;
};