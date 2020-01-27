import React from "react";
import { StyleSheet, View, ScrollView, Picker, Image } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import showError from "../Utils/showError";
import { BASE_URL } from "../../global";
import services from "../services";

class Screen extends React.Component {
	static navigationOptions = {
		headerTitle: "Tambah Titik PJU Baru",
	};

	state = {};

	render() {
		var data = this.props.navigation.getParam("data");
		return (
			<ScrollView style={styles.container}>
				<Text h2 style={styles.title}>Data PJU Baru</Text>

				<Text style={styles.label}>Foto PJU</Text>
				<View style={styles.previewContainer}>
					<View style={styles.previewFrame}>
						<Image
							style={{ flex: 1 }}
							source={{ uri: `${BASE_URL}/pju/img?kode=${data.kode}` }}
						/>
					</View>
					<Button
						buttonStyle={styles.button}
						title="Foto PJU"
					/>
				</View>

				<Text style={styles.label}>Status PJU</Text>
				<Text style={styles.value} selectable>
					{ data.idPelanggan ? "Legal" : "Ilegal" }
				</Text>

				{ data.idPelanggan &&
					<React.Fragment>
						<Text style={styles.label}>ID Pelanggan</Text>
						<Text style={styles.value} selectable>
							{data.idPelanggan}
						</Text>
					</React.Fragment>
				}

				<Text style={styles.label}>Tipe Lampu</Text>
				<Text style={styles.value} selectable>
					{data.tipeLampu || "-"}
				</Text>

				<Text style={styles.label}>Daya</Text>
				<Text style={styles.value} selectable>
					{data.daya || "-"}
				</Text>

				<Text style={styles.label}>Koordinat</Text>
				<Text style={styles.value} selectable>
					{data.longitude},{"\n"}
					{data.latitude}
				</Text>

				<Text style={styles.label}>Daya</Text>
				<Text style={styles.value} selectable>
					{data.jalan || "-"}
				</Text>

				<Text style={styles.label}>Kota/Kabupaten</Text>
				<Text style={styles.value} selectable>
					{data.kota || "-"}
				</Text>

				<Text style={styles.label}>Kecamatan</Text>
				<Text style={styles.value} selectable>
					{data.kecamatan || "-"}
				</Text>

				<Text style={styles.label}>Kelurahan/Desa</Text>
				<Text style={styles.value} selectable>
					{data.kelurahan || "-"}
				</Text>

				<Text style={styles.label}>RW</Text>
				<Text style={styles.value} selectable>
					{data.rw || "-"}
				</Text>

				<Text style={styles.label}>RT</Text>
				<Text style={styles.value} selectable>
					{data.rt || "-"}
				</Text>

			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: { 
		paddingHorizontal: 20,
	},
	title: {
		textAlign: "center",
		marginTop: 20,
		marginBottom: 30,
	},
	previewContainer: {
		width: 150, 
		height: 220,
		marginBottom: 20
	},
	previewFrame: {
		flex: 1,
		borderWidth: 1
	},
	label: {
		fontSize: 20,
		color: "#888888",
		fontWeight: "bold",
		marginBottom: 5
	},
	value: {
		fontSize: 20,
		marginBottom: 20
	},
	button: {
		backgroundColor: "#47525e",
	},
	submitButton: {
		marginTop: 10,
		marginBottom: 50
	}
});

export default Screen;