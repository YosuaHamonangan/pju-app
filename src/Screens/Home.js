import React, { Component } from "react";
import { 
	StyleSheet, View,
	TouchableOpacity 
} from "react-native";
import { Text } from "react-native-elements";

class Screen extends React.Component {
	static navigationOptions = {
		headerShown: false
	};

	render() {
		return (
			<View style={styles.container}>
				<Text h2 style={styles.title}>Manajemen PJU</Text>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={ () => this.props.navigation.navigate("PjuMap") }
					>
						<Text style={styles.buttonText}>Map</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.button}
						onPress={ () => this.props.navigation.navigate("CreatePju") }
					>
						<Text style={styles.buttonText}>Tambah Titik PJU Baru</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 20
	},
	title: {
		textAlign: "center",
		marginTop: 40,
		marginBottom: 50,
	},
	buttonContainer: { 
		flexDirection: "row",
	},
	button: {
		flex: 1,
		margin: 15,
		aspectRatio: 1,
		backgroundColor: "#47525e",
		justifyContent: "center",
	},
	buttonText: {
		textAlign: "center",
		color: "white"
	}
});

export default Screen;