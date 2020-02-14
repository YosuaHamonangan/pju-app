import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';
import services from "../services";

class Screen extends React.Component {
	componentDidMount(){
		services.testSecret()
			.then( () => {
				this.props.navigation.navigate('App');
			})
			.catch( err => {
				if(err.response.status === 401) {
					this.props.navigation.navigate("Auth");
				}
				else {
					console.error(err);
				}
			})
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