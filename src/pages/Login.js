import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity, Text } from 'react-native'
import Logo from '../assets/logo.png'
import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage'

export default function Login ({ navigation }) {
	const [user, setUser] = useState('');

	useEffect(()=> {
		AsyncStorage.getItem('user').then(user => {
			if(user) {
				navigation.navigate('Main', user)
			}
		})
	}, []);

	async function handleLogin() {
		const response = await api.post('/dev', {
			username: user
		});
		const { _id } = response.data;
		await AsyncStorage.setItem('user', _id);
		navigation.navigate('Main', { user: _id })
	}
	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior="padding"
			enabled={Platform.OS === 'ios'}
		>
			<Image source={Logo}/>
			<TextInput
				autoCapitalize='none'
				autoCorrect={false}
				placeholder="Digite seu usuário do github"
				style={styles.input}
				placeholderTextColor="#999"
				onChangeText={setUser}
				value={user}
			/>
			<TouchableOpacity onPress={handleLogin} style={styles.button}>
				<Text style={styles.text}> Entrar </Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 30
	},
	input: {
		height: 46,
		alignSelf: 'stretch',
		backgroundColor: '#FFF',
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 4,
		marginTop: 20,
		paddingHorizontal: 15
	},
	button: {
		height: 46,
		alignSelf: 'stretch',
		backgroundColor: '#DF4723',
		borderRadius: 4,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
	},
});
