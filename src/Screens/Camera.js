import React, { Component } from "react";
import {
	AppRegistry,
	Dimensions,
	StyleSheet,
	Text,
	TouchableHighlight,
	View
} from "react-native";
import { RNCamera } from "react-native-camera";

class Screen extends React.Component {
	takePicture = async() => {
		if (this.camera) {
			const options = { quality: 0.5 };
			const data = await this.camera.takePictureAsync(options);

			this.props.navigation.getParam("onSubmit")({
				uri: data.uri,
			});
			this.props.navigation.goBack();
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<RNCamera
					ref={(cam) => {
						this.camera = cam;
					}}
					style={styles.preview}
				>
					<Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
				</RNCamera>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
	},
	preview: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center"
	},
	capture: {
		flex: 0,
		backgroundColor: "#fff",
		borderRadius: 5,
		color: "#000",
		padding: 10,
		margin: 40
	}
});

export default Screen;
