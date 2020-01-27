import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text
} from 'react-native';

class Screen extends React.Component {
	componentDidMount(){
		setTimeout( () => {
			this.props.navigation.navigate('Auth');
		}, 100);
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