import React, { Component } from "react";
import {
	StyleSheet, View, Text,
	TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import mapUtils from "../Utils/map";
import services from "../services";

var MAX_CHUNK_SIZE = 100;

class Screen extends React.Component {
	static navigationOptions = {
		headerTitle: "Lokasi PJU",
	};

	state = {
		list: [],
	};

	fetchedSections = {};

	select = () => {
		this.props.navigation.getParam("onSubmit")(this.state.region);
		this.props.navigation.goBack();
	};

	async getPjuList(region) {
		var { longitude, latitude, longitudeDelta, latitudeDelta } = region;
		
		var longitudeMin = longitude;
		var longitudeMax = longitude + longitudeDelta;
		var latitudeMin = latitude;
		var latitudeMax = latitude + latitudeDelta;

		var sections = mapUtils.range2Sections(longitudeMin, longitudeMax, latitudeMin, latitudeMax);
		sections = sections.filter( section => {
			if(!this.fetchedSections[section]) {
				this.fetchedSections[section] = true;
				return true;
			}
			return false;
		});

		for (var i = 0; i < sections.length; i+=MAX_CHUNK_SIZE) {
			var chunk = sections.slice(i, i+MAX_CHUNK_SIZE);
			var sectionsString = chunk.join(",");

			try {
				var data = await services.getPjuList({ 
					...this.props.navigation.getParam("filter"),
					sections: sectionsString 
				});
			}
			catch(err) {
				services.errorHandler(err);
			};

			var list = this.state.list.concat(data);
			var markers = this.getMarkers(list);
			this.setState({ list, markers });
		}

	}

	componentDidMount() {
		this.setState({ loading: true });

		Geolocation.getCurrentPosition( async position => {
			var region = {
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
				longitudeDelta: 0.005,
				latitudeDelta: 0.005,
			};
			this.setState({ region });
			await this.getPjuList(region).catch(console.error);
			this.setState({ loading: false });
		});
	}

	getMarkers(list = this.state.list) {
		var idPelGroups = {};

		var markers = list.map( (pju, i) => {
			var { idPelanggan } = pju;
			var longitude = +pju.longitude;
			var latitude = +pju.latitude;

			if(idPelanggan) {
				idPelGroups[idPelanggan] = idPelGroups[idPelanggan]  || [];
				idPelGroups[idPelanggan].push({longitude, latitude});
			}

			return (
				<MapView.Marker
					key={i}
					pinColor={idPelanggan ? "blue" : "red"}
					coordinate={{ longitude, latitude }}
					onPress={ () => {
						var onSelect = this.props.navigation.getParam("onSelect");

						if(onSelect) {
							onSelect(idPelanggan);
							this.props.navigation.goBack();
						}
						else {
							this.props.navigation.navigate("PjuDetail", { data: pju })
						}
					}}
				/>
			);
		});

		for(var idPelanggan in idPelGroups) {
			markers.push(
				<MapView.Polyline
					coordinates={idPelGroups[idPelanggan]}
					strokeColor="blue"
					strokeWidth={6}
				/>
			);
		}

		return markers;
	}

	render() {
		var { region = {}, info, markers } = this.state;
		return (
			<View style={styles.container}>
				<MapView
					ref={ map => this.map = map }
					initialRegion={region}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					onRegionChange={ region => {
						if(this.refs.mainMarker) {
							this.refs.mainMarker.setNativeProps({
								coordinate: region
							});
						}
					} }
					onRegionChangeComplete={ region => this.setState({ region }) }
					onUserLocationChange={ evt => this.setState({ user: evt.nativeEvent.coordinate }) }
				>
					{ this.state.region && 
						<MapView.Marker
							ref="mainMarker"
							pinColor="green"
							coordinate={region}
							title="PJU baru"
						/>
					}
					{ markers }
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
		height: 110, 
		// height: 250, 
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
		// width: "100%",
		// height: 150, 
		// fontSize: 20,
		// padding: 10
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