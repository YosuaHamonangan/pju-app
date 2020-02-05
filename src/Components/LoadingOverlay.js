import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Overlay } from 'react-native-elements';

class Component extends React.Component {

	render() {
		return (
			<Overlay fullScreen overlayBackgroundColor="#ffffff88" overlayStyle={styles.container}>
				<ActivityIndicator size={80} color="#47525e" />
			</Overlay>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Component;