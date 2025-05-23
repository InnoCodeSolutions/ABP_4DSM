import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type NavBarProps = {
    onPressHome: () => void;
    onPressProfile: () => void;
    onPressDashboard: () => void;
    selected: 'home' | 'profile' | 'dashboard' | '';
};

const scale = (size: number, max: number) => Math.min(size, max);

const barHeight = Platform.select({
    ios: 54,
    android: 54,
    web: 60,
    default: 54,
});

const iconSize = Platform.select({
    ios: scale(width * 0.08, 24),
    android: scale(width * 0.08, 24),
    web: scale(width * 0.045, 26),
    default: 24,
});

const fontSize = Platform.select({
    ios: scale(width * 0.035, 11),
    android: scale(width * 0.035, 11),
    web: scale(width * 0.025, 13),
    default: 11,
});

const NavBar: React.FC<NavBarProps> = ({ onPressHome, onPressProfile, onPressDashboard, selected }) => {
    return (
        <View style={[styles.container, { height: barHeight }]}>
            <TouchableOpacity style={styles.item} onPress={onPressHome}>
                <MaterialIcons
                    name="home"
                    size={iconSize}
                    color={selected === 'home' ? '#1E88E5' : '#333'}
                />
                <Text style={[styles.label, { fontSize }, selected === 'home' && styles.labelSelected]}>
                    Home
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={onPressDashboard}>
                <MaterialIcons
                    name="dashboard"
                    size={iconSize}
                    color={selected === 'dashboard' ? '#1E88E5' : '#333'}
                />
                <Text style={[styles.label, { fontSize }, selected === 'dashboard' && styles.labelSelected]}>
                    Dashboard
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.item} onPress={onPressProfile}>
                <MaterialIcons
                    name="person"
                    size={iconSize}
                    color={selected === 'profile' ? '#1E88E5' : '#333'}
                />
                <Text style={[styles.label, { fontSize }, selected === 'profile' && styles.labelSelected]}>
                    Perfil
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#333',
        marginTop: 2,
    },
    labelSelected: {
        color: '#1E88E5',
        fontWeight: 'bold',
    },
});

export default NavBar;