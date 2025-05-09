import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import axios from 'axios';
import LoginScreen from '../screens/LoginScreen';

// Corrigindo o mock para o axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Corrigindo o mock para Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

// Corrigindo o mock para navigation
const mockNavigation = {
  navigate: jest.fn(),
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com inputs e botões', () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    // Verifica se os componentes principais estão sendo renderizados
    expect(getByPlaceholderText('E-mail')).toBeTruthy();
    expect(getByPlaceholderText('Senha')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText('Cadastrar')).toBeTruthy();
    expect(getByText('floatData')).toBeTruthy();
  });
});
  it('atualiza o estado ao digitar nos inputs', () => {
    const { getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
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
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    fireEvent.press(getByText('Login'));

    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor, preencha todos os campos.');
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });

  it('navega para a tela de registro ao clicar no botão cadastrar', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
    );

    fireEvent.press(getByText('Cadastrar'));

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });

  it('faz login com sucesso e navega para Home', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
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
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
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
    mockedAxios.post.mockRejectedValueOnce({
      message: 'Network Error',
    });

    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={mockNavigation as any} route={{} as any} />
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

  