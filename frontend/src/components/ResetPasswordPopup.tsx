/*import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { requestPasswordReset, resetPassword } from '../service/authService';

const { width, height } = Dimensions.get('window');

interface ResetPasswordPopupProps {
  visible: boolean;
  onClose: () => void;
  email: string;
}

const ResetPasswordPopup: React.FC<ResetPasswordPopupProps> = ({ visible, onClose, email }) => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o código e a nova senha.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Senha inválida', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      await resetPassword(email, code, newPassword);
      Alert.alert('Sucesso', 'Senha redefinida com sucesso! Faça login com a nova senha.');
      setCode('');
      setNewPassword('');
      onClose();
    } catch (error: any) {
      console.log('Erro ao redefinir senha:', error.message);
      const message = error.response?.data?.message || 'Não foi possível redefinir a senha. Verifique o código e tente novamente.';
      Alert.alert('Erro', message);
    }
  };

  const handleResendCode = async () => {
    try {
      await requestPasswordReset(email);
      Alert.alert('Sucesso', 'Código reenviado! Verifique seu e-mail.');
    } catch (error: any) {
      console.log('Erro ao reenviar código:', error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível reenviar o código. Tente novamente.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <ThemedView style={styles.popup}>
          <View style={styles.header}>
            <ThemedText type="title">Redefinir Senha</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Código de verificação"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            accessibilityLabel="Código de verificação"
          />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#9CA3AF"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            accessibilityLabel="Nova senha"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
              <ThemedText style={styles.resendButtonText}>Reenviar Código</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleResetPassword}>
              <ThemedText style={styles.submitButtonText}>Enviar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: Platform.select({
      web: Math.min(width * 0.8, 400),
      native: width * 0.95,
    }),
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: width * 0.05,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    padding: 5,
  },
  input: {
    width: '100%',
    backgroundColor: '#D1D5DB',
    padding: height * 0.01,
    marginBottom: height * 0.015,
    borderRadius: 10,
    fontSize: width * 0.03,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: height * 0.02,
  },
  resendButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: height * 0.01,
    borderRadius: 20,
    marginRight: width * 0.03,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  resendButtonText: {
    color: '#041635',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: height * 0.01,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width * 0.03,
    fontWeight: 'bold',
  },
});

export default ResetPasswordPopup;*/
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { requestPasswordReset, resetPassword } from '../service/authService';

const { width, height } = Dimensions.get('window');

interface ResetPasswordPopupProps {
  visible: boolean;
  onClose: () => void;
  email: string;
}

const ResetPasswordPopup: React.FC<ResetPasswordPopupProps> = ({ visible, onClose, email }) => {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o código e a nova senha.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Senha inválida', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      await resetPassword(email, code, newPassword);
      Alert.alert('Sucesso', 'Senha redefinida com sucesso! Faça login com a nova senha.');
      setCode('');
      setNewPassword('');
      onClose();
    } catch (error: any) {
      console.log('Erro ao redefinir senha:', error.message);
      const message = error.response?.data?.message || 'Não foi possível redefinir a senha. Verifique o código e tente novamente.';
      Alert.alert('Erro', message);
    }
  };

  const handleResendCode = async () => {
    try {
      await requestPasswordReset(email);
      Alert.alert('Sucesso', 'Código reenviado! Verifique seu e-mail.');
    } catch (error: any) {
      console.log('Erro ao reenviar código:', error.message);
      Alert.alert('Erro', error.response?.data?.message || 'Não foi possível reenviar o código. Tente novamente.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Redefinir Senha</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Código de verificação"
            placeholderTextColor="#9CA3AF"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            accessibilityLabel="Código de verificação"
          />
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#9CA3AF"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            accessibilityLabel="Nova senha"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.resendButton} onPress={handleResendCode}>
              <Text style={styles.resendButtonText}>Reenviar Código</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleResetPassword}>
              <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const scale = (size: number, max: number) => Math.min(size, max);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    width: Platform.select({
      web: scale(width * 0.5, 400),
      native: width > 600 ? width * 0.5 : width * 0.9,
    }),
    borderRadius: 20,
    padding: Platform.select({
      web: scale(width * 0.05, 30),
      native: width * 0.08,
    }),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.02,
    }),
  },
  headerTitle: {
    fontSize: Platform.select({
      web: scale(width * 0.04, 20),
      native: width * 0.05,
    }),
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  input: {
    width: '100%',
    backgroundColor: '#D1D5DB',
    padding: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    marginBottom: Platform.select({
      web: scale(height * 0.015, 15),
      native: height * 0.02,
    }),
    borderRadius: 10,
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: Platform.select({
      web: scale(height * 0.02, 20),
      native: height * 0.03,
    }),
  },
  resendButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    borderRadius: 20,
    marginRight: Platform.select({
      web: scale(width * 0.03, 15),
      native: width * 0.04,
    }),
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  resendButtonText: {
    color: '#1E3A8A',
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: 'bold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: Platform.select({
      web: scale(height * 0.01, 12),
      native: height * 0.015,
    }),
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Platform.select({
      web: scale(width * 0.03, 16),
      native: width * 0.04,
    }),
    fontWeight: 'bold',
  },
});

export default ResetPasswordPopup;