import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Text, Input, Button } from "react-native-elements";
import showError from "../Utils/showError";
import services from "../services";


class Screen extends React.Component {
	static navigationOptions = {
		headerShown: false
	};
	
	state = {};

	login = () => {
		if(this.state.loading) return;

		var { username, password } = this.state;
		if(!username || !password){
			showError("Username dan Password tidak boleh kosong");
			return this.setState({ loading: false });
		}

		this.setState({ loading: true });

		services.login(username, password)
			.then( () => {
				this.setState({ loading: false });
				this.props.navigation.navigate("App");
			})
			.catch( err => {
				services.errorHandler(err);
				this.setState({ loading: false });
			});
	}

	render() {
		return (
			<View style={styles.container}>
				<Text h2 style={{ marginBottom: 50 }}>Manajemen PJU</Text>
				<Input
					containerStyle={[styles.input]}
					inputContainerStyle={[styles.inputContainer]}
					placeholder="Username"
					autoCompleteType="username"
					autoCapitalize="none"
					leftIcon={<Icon name="user" size={24} color="black"/>}
					onChangeText={ val => this.setState({ username: val}) }
				/>
				<Input
					containerStyle={[styles.input, { marginBottom: 50 }]}
					inputContainerStyle={styles.inputContainer}
					placeholder="Password"
					autoCompleteType="password"
					autoCapitalize="none"
					secureTextEntry
					leftIcon={<Icon name="lock" size={24} color="black"/>}
					onChangeText={ val => this.setState({ password: val}) }
				/>
				<Button
					containerStyle={{ width: "100%" }}
					buttonStyle={styles.button}
					title="Login"
					loading={this.state.loading}
					onPress={this.login}
					color="#47525e"
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: { 
		flex: 1, 
		alignItems: "center", 
		justifyContent: "center",
		padding: 10
	},
	input: {

	},
	inputContainer: {
		marginHorizontal: -6,
	},
	button: {
		backgroundColor: "#47525e"
	}
});

export default Screen;