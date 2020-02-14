import React, { Component } from "react";
import {
	StyleSheet, View, Text,
	TouchableOpacity
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import LoadingOverlay from "../Components/LoadingOverlay";
import mapUtils from "../Utils/map";
import services from "../services";

var MAX_CHUNK_SIZE = 100;

class Screen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.getParam("title") || "Peta PJU",
    });

	state = {
		list: [],
	};

	fetchedSections = {};

	onRegionChange = region => {
		this.getPjuList(region).catch(console.error);
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
			this.setState({ list });
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

	getMarkers() {
		var { list } = this.state;
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
		var { region, list } = this.state;
		return (
			<View style={styles.container}>
				{ this.state.loading &&  <LoadingOverlay/> }
				<MapView
					ref={ map => this.map = map }
					initialRegion={region}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					onRegionChange={this.onRegionChange}
				>
					{ list && this.getMarkers() }
				</MapView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		flex: 1,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});

export default Screen;