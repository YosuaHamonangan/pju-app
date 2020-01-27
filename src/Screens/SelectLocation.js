import React, { Component } from "react";
import {
	StyleSheet, View, Text,
	TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import services from "../services";

class Screen extends React.Component {
	static navigationOptions = {
		headerTitle: "Lokasi PJU",
	};

	state = {};

	select = () => {
		this.props.navigation.getParam("onSubmit")(this.state.region);
		this.props.navigation.goBack();
	};

	updateInfo = region => {
		services.getCoordinateInfo(region)
			.then( ({ results }) => {
				this.setState({ info: results[0] });
			})
			.catch( err => {
				services.errorHandler(err);
			});
	};

	componentDidMount(){
		Geolocation.getCurrentPosition( position => {
			var region = {
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
				longitudeDelta: 0.005,
				latitudeDelta: 0.005,
			};
			this.setState({ region });
		});
	}

	render() {
		var { region = {}, info } = this.state;
		return (
			<View style={styles.container}>
				<MapView
					ref={ map => this.map = map }
					initialRegion={region}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					onRegionChange={ region => this.setState({ region }) }
					onRegionChangeComplete={this.updateInfo}
					onUserLocationChange={ evt => this.setState({ user: evt.nativeEvent.coordinate }) }
				>
					{ this.state.region && 
						<MapView.Marker
							coordinate={region}
							title={"PJU baru"}
						/>
					}
				</MapView>
				<View style={styles.footer}>
					<Text style={styles.top}>Pilih Lokasi PJU dengan menggeser peta</Text>
					<Text style={styles.coordinate}>
						{region.longitude && region.longitude.toFixed(6)}, {region.latitude && region.latitude.toFixed(6)}
					</Text>
					<Text style={styles.detail}>{info && info.formatted_address}</Text>
					<Button
						containerStyle={styles.addButtonContainer}
						buttonStyle={styles.addButton}
						title="Tambah"
						onPress={this.select}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		flex: 1,
	},
	footer: {
		flex: 0,
		height: 250, 
		backgroundColor: "white",
		alignItems: "center"
	},
	top: {
		width: "100%",
		height: 30, 
		fontSize: 15,
		textAlign: "center",
		textAlignVertical: "center",
	},
	coordinate: {
		width: "100%",
		height: 20, 
		textAlign: "center",
		fontSize: 18,
		fontWeight: "bold"
	},
	detail: {
		width: "100%",
		height: 150, 
		fontSize: 20,
		padding: 10
	},
	addButtonContainer: {
		width: "100%",
		height: 50, 
	},
	addButton: {
		backgroundColor: "#47525e",
		borderRadius: 0
	},
});

export default Screen;