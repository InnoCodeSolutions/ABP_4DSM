import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define navigation types
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

// Define props type using NativeStackScreenProps
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

// Mock navigation and route
const mockNavigation = {
  navigate: jest.fn(),
} as unknown as LoginScreenProps['navigation'];

const mockRoute = {} as LoginScreenProps['route'];

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com inputs e botões', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Cadastrar')).toBeTruthy();
    expect(getByText('floatData')).toBeTruthy();
  });

  it('atualiza o estado ao digitar nos inputs', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    const emailInput = getByPlaceholderText('E-mail');
    const passwordInput = getByPlaceholderText('Senha');

    fireEvent.changeText(emailInput, 'teste@example.com');
    fireEvent.changeText(passwordInput, 'senha123');

    expect(emailInput.props.value).toBe('teste@example.com');
    expect(passwordInput.props.value).toBe('senha123');
  });

  it('exibe alerta quando os campos estão vazios', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('navega para a tela de registro ao clicar no botão cadastrar', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.press(getByText('Cadastrar'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('faz login com sucesso e navega para Home', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });
    (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('E-mail'), 'teste@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://10.68.55.167:3000/auth/login',
        {
          email: 'teste@example.com',
          password: 'senha123',
        }
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'fake-token');
      expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Login realizado com sucesso!');
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
    });
  });

  it('exibe erro quando o login falha', async () => {
    const errorMessage = 'Credenciais inválidas';
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('E-mail'), 'teste@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha-errada');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://10.68.55.167:3000/auth/login',
        {
          email: 'teste@example.com',
          password: 'senha-errada',
        }
      );
      expect(Alert.alert).toHaveBeenCalledWith('Erro', errorMessage);
      expect(mockNavigation.navigate).not.toHaveBeenCalled();
    });
  });

  it('exibe mensagem genérica quando o erro não tem formato esperado', async () => {
    mockedAxios.post.mockRejectedValueOnce({ message: 'Network Error' });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation} route={mockRoute} />
    );

    fireEvent.changeText(getByPlaceholderText('E-mail'), 'teste@example.com');
    fireEvent.changeText(getByPlaceholderText('Senha'), 'senha123');

    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Usuário ou senha incorretos.');
    });
  });
});