import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import showError from "../Utils/showError";
import services from "../services";

class Screen extends React.Component {

	checkLogin() {
		services.testSecret()
			.then( () => {
				this.props.navigation.navigate('App');
			})
			.catch( err => {
				if(!err.response) {
					showError("Gagal terhubung dengan server, mohon cek koneksi anda");
					this.checkLogin();
				}
				else if(err.response.status === 401) {
					this.props.navigation.navigate("Auth");
				}
				else {
					console.error(err);
				}
			})
	}

	componentDidMount(){
		this.checkLogin();
	}

	render() {
		return (
			<View style={styles.container}>
				<Text>Loading</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: { 
		flex: 1, 
		alignItems: 'center', 
		justifyContent: 'center' 
	}
});

export default Screen;