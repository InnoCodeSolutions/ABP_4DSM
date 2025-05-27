// authService.ts

import axios from "axios";
import config from "../config/config.json";

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

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

    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
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
    const response = await axios.post(`${BASE_URL}/auth/login`, {
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
    const response = await axios.post(`${BASE_URL}/users`, {
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
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
      email,
      code,
      newPassword,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};