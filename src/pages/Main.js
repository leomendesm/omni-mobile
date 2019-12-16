import React, { useEffect, useState, Fragment } from 'react'
import { SafeAreaView, View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import Logo from '../assets/logo.png'
import Like from '../assets/like.png'
import Dislike from '../assets/dislike.png'
import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage'

export default function Main({navigation}) {
	const id = navigation.getParam('user');
	const [users, setUsers] = useState([]);
	useEffect(() => {
		(async function loadUsers() {
			const response = await api.get('/dev', {
				headers: { user: id }
			});
			setUsers(response.data)
		})()
	}, [id]);

	async function handleLike() {
		const [{_id} , ...rest] = users;
		await api.post(`/dev/${_id}/like`, null, {
			headers: {
				user: id
			}
		});
		setUsers(rest)
	}
	async function handleDislike() {
		const [{_id}, ...rest] = users;
		await api.post(`/dev/${_id}/dislike`, null, {
			headers: {
				user: id
			}
		});
		setUsers(rest)
	}

	async function handleLogout() {
		await AsyncStorage.clear();
		navigation.navigate('Login')
	}

	return (
	<SafeAreaView style={styles.container}>
		<TouchableOpacity onPress={handleLogout}>
			<Image style={styles.logo} source={Logo} />
		</TouchableOpacity>
		<View style={styles.cardsContainer}>
			{users.length === 0?
				<Text style={styles.empty}>Acabou :C</Text>
				:
				users.map((u, index) => (
					<View key={u._id} style={[styles.card, { zIndex: users.length - index }]}>
						<Image style={styles.avatar} source={{uri: u.avatar}} />
						<View style={styles.footer}>
							<Text style={styles.name}>{u.name}</Text>
							<Text numberOfLines={3} style={styles.bio}>{u.bio}</Text>
						</View>
					</View>
				))}
		</View>
		<View style={styles.buttonsContainer}>
			{users.length > 0 && (
				<Fragment>
					<TouchableOpacity style={styles.button} onPress={handleDislike}>
						<Image source={Dislike} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={handleLike}>
						<Image source={Like} />
					</TouchableOpacity>
				</Fragment>
			)}
		</View>
	</SafeAreaView>)
}

const styles = StyleSheet.create({
	logo: {
		marginTop: 30,
	},
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	cardsContainer: {
		flex: 1,
		alignSelf: 'stretch',
		justifyContent: 'center',
		maxHeight: 500,
	},
	card: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		margin: 30,
		overflow: 'hidden',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	avatar: {
		flex: 1,
		height: 300
	},
	footer: {
		backgroundColor: '#FFF',
		paddingHorizontal: 20,
		paddingVertical: 15,

	},
	name: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#333'
	},
	bio: {
		fontSize: 14,
		color: '#999',
		marginTop: 5,
		lineHeight: 20
	},
	buttonsContainer: {
		flexDirection: 'row',
		marginBottom: 30
	},
	button: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#FFF',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 20,
		elevation: 2,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
		shadowOffset: {
			width: 0,
			height: 2
		}
	},
	empty: {
		alignSelf: 'center',
		color: '#999',
		fontSize: 24,
		fontWeight: 'bold'
	}
});
