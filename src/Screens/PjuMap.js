import React, { Component } from "react";
import {
	StyleSheet, View, Text,
	TouchableOpacity
} from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import LoadingOverlay from "../Components/LoadingOverlay";
import services from "../services";

class Screen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerTitle: navigation.getParam("title") || "Peta PJU",
    });

	state = {};

	componentDidMount() {
		this.setState({ loading: true });

		Geolocation.getCurrentPosition( position => {
			var region = {
				longitude: position.coords.longitude,
				latitude: position.coords.latitude,
				longitudeDelta: 0.005,
				latitudeDelta: 0.005,
			};
			this.setState({ region });
		});

		services.getPjuList(this.props.navigation.getParam("filter"))
			.then( list => {
				this.setState({ pjuList: list, loading: false });
			})
			.catch( err => {
				services.errorHandler(err);
				this.setState({ loading: false });
			});
	}

	render() {
		var { region, pjuList } = this.state;
		return (
			<View style={styles.container}>
				{ this.state.loading &&  <LoadingOverlay/> }
				<MapView
					ref={ map => this.map = map }
					initialRegion={region}
					provider={PROVIDER_GOOGLE}
					style={styles.map}
					showsUserLocation={true}
					onRegionChange={ region => this.setState({ region }) }
				>
					{ pjuList && 
						pjuList.map( (pju, i) => (
							<MapView.Marker
								key={i}
								pinColor={pju.idPelanggan ? "blue" : "red"}
								coordinate={{
									longitude: +pju.longitude,
									latitude: +pju.latitude
								}}
								onPress={ () => {
									var onSelect = this.props.navigation.getParam("onSelect");

									if(onSelect) {
										onSelect(pju.idPelanggan);
										this.props.navigation.goBack();
									}
									else {
										this.props.navigation.navigate("PjuDetail", { data: pju })
									}
								}}
							/>
						))
					}
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