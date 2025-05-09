import axios from "axios";
import config from "@config/config.json";

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

export interface Derivador {
  device_id: string; // Ajustado para refletir a coluna da tabela
  latitude?: number; // Usar número diretamente
  longitude?: number; // Usar número diretamente
  timestamp?: string; // Adicionado para manter o contexto de tempo
}

export const fetchDerivadores = async (): Promise<Derivador[]> => {
  try {
    const token = localStorage.getItem('token'); // Ajuste conforme seu método de autenticação
    const response = await axios.get(`${BASE_URL}/devices`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = response.data;

    // Mapeia os dados para o formato Derivador, pegando as últimas coordenadas se necessário
    return data.map((item: any) => ({
      device_id: item.device_id,
      latitude: Number(item.latitude) || 0,
      longitude: Number(item.longitude) || 0,
      timestamp: item.timestamp || new Date().toISOString(),
    }));
  } catch (error) {
    throw error;
  }
};

// Remova a função formatCoordinate se não for mais necessária, ou ajuste conforme o novo formato