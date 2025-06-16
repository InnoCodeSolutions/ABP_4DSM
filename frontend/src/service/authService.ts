/*// authService.ts

import axios from "axios";

const api = "https://innocodesutionsbackend.up.railway.app"

// Função para decodificar o token JWT manualmente
const jwtDecode = (token: string): { id: number; email: string } | null => {
  try {
    const payload = token.split('.')[1]; // Extrai o payload (segunda parte do token)
    const decodedPayload = JSON.parse(atob(payload)); // Decodifica Base64 e parseia como JSON
    return {
      id: decodedPayload.id,
      email: decodedPayload.email,
    };
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

export const getProfile = async (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.id) {
      throw new Error('Não foi possível decodificar o token ou encontrar o ID do usuário');
    }
    const userId = decoded.id;

    const response = await axios.get(`${api}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.message.includes('Não foi possível decodificar')) {
      throw new Error('Token JWT inválido');
    }
    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${api}/auth/login`, {
      email,
      password,
    });
    console.log('Resposta do backend no login:', response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const register = async (
  name: string,
  surname: string,
  email: string,
  phone: string,
  password: string
) => {
  try {
    const response = await axios.post(`${api}/users`, {
      name,
      email,
      lastname: surname,
      password,
      phone,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axios.post(`${api}/auth/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const response = await axios.post(`${api}/auth/reset-password`, {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};*/

import axios from "axios";

// Importação condicional do NetInfo para evitar erro se não estiver instalado
let NetInfo: any;
try {
  NetInfo = require("@react-native-community/netinfo");
} catch (error) {
  console.warn("NetInfo não instalado. Verificação de conectividade será ignorada.");
}

const apiClient = axios.create({
  baseURL: "https://innocodesutionsbackend.up.railway.app",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface JwtPayload {
  id: number;
  email: string;
}

interface LoginResponse {
  token: string;
}

const jwtDecode = (token: string): JwtPayload | null => {
  try {
    if (!token || token.split(".").length !== 3) {
      console.error("Token JWT malformado");
      return null;
    }
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    if (!decodedPayload.id || !decodedPayload.email) {
      console.error("Payload do token não contém id ou email");
      return null;
    }
    return {
      id: decodedPayload.id,
      email: decodedPayload.email,
    };
  } catch (error) {
    console.error("Erro ao decodificar o token:", JSON.stringify(error, null, 2));
    return null;
  }
};

export const getProfile = async (token: string) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded || !decoded.id) {
      throw new Error("Não foi possível decodificar o token ou encontrar o ID do usuário");
    }
    const userId = decoded.id;

    const response = await apiClient.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro no getProfile:", JSON.stringify(error.response?.data || error.message, null, 2));
    if (error.message.includes("Não foi possível decodificar")) {
      throw new Error("Token JWT inválido");
    }
    throw new Error(error.response?.data?.message || "Erro ao obter perfil do usuário");
  }
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    if (NetInfo) {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error("Sem conexão com a internet. Verifique sua rede.");
      }
    }

    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    console.log("Resposta do backend no login:", JSON.stringify(response.data, null, 2));
    const token = response.data.token || response.data;
    if (!token || typeof token !== "string") {
      throw new Error("Token inválido recebido: " + JSON.stringify(token));
    }
    return { token };
  } catch (error: any) {
    console.error("Erro no login:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error(
      error.response?.data?.message || error.message || "Erro ao realizar login. Tente novamente."
    );
  }
};

export const register = async (
  name: string,
  surname: string,
  email: string,
  phone: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/users", {
      name,
      email,
      lastname: surname,
      password,
      phone,
    });
    console.log("Resposta do backend no register:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error("Erro no register:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error(
      error.response?.data?.message || "Erro ao realizar cadastro. Tente novamente."
    );
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    console.log("Resposta do backend no requestPasswordReset:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error("Erro no requestPasswordReset:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error(
      error.response?.data?.message || "Erro ao solicitar redefinição de senha. Tente novamente."
    );
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const response = await apiClient.post("/auth/reset-password", {
      email,
      code,
      newPassword,
    });
    console.log("Resposta do backend no resetPassword:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    console.error("Erro no resetPassword:", JSON.stringify(error.response?.data || error.message, null, 2));
    throw new Error(
      error.response?.data?.message || "Erro ao redefinir senha. Tente novamente."
    );
  }
};