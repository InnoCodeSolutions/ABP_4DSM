import axios from "axios";
import config from "../config/config.json";

const BASE_URL = `http://${config.backend.host}:${config.backend.port}`;

export const getProfile = async (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const userId = decoded.id;

    const response = await axios.get(`${BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.name === 'InvalidTokenError') {
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

function jwtDecode(token: string): any {
    throw new Error("Function not implemented.");
}
