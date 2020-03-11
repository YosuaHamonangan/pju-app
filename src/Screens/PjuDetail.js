import React from "react";
import { StyleSheet, View, ScrollView, Picker, Image } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import openMap from "react-native-open-maps";
import AsyncSelect from "../Components/AsyncSelect";
import showError from "../Utils/showError";
import { BASE_URL } from "../../global";
import services from "../services";

class Screen extends React.Component {
	static navigationOptions = {
		headerTitle: "PJU",
	};

	state = {};

	submit = () => {
		var { legal, loading, foto, currentData, ...data } = this.state;
		if(loading) return;

		this.setState({ loading: true });

		if(foto) {
			data.foto = {
				uri: foto.uri,
				type: "image/jpg",
				name: "foto.jpg"
			};
		}
		
		legal = legal !== undefined ? legal : !!currentData.idPelanggan;
		if(!legal) data.idPelanggan = "";
		
		// Check if there are data changes
		if(Object.entries(data).length === 0) return;

		data.kode = currentData.kode;

		// Create FormData and send to server
		var formData = new FormData();
		for (var key in data) {
			formData.append(key, data[key]);
		}

		services.editPju(formData)
			.then( currentData => {
				this.setState({ currentData, loading: false });
			})
			.catch( err => {
				services.errorHandler(err);
				this.setState({ loading: false });
			});
	};

	selectIdPelanggan = () => {
		this.props.navigation.navigate("PjuMap", {
			title: "Pilih titik PJU",
			filter: { legal:  true },
			onSelect: idPelanggan => this.setState({ idPelanggan })
		});
	};

	selectLocation = () => {
		this.props.navigation.navigate("SelectLocation", {
			onSubmit: ({ longitude, latitude }) => this.setState({ longitude, latitude })
		});
	};

	takePicture = () => {
		this.props.navigation.navigate("Camera", {
			onSubmit: foto => this.setState({ foto })
		});
	};

	openMap = () => {
		var { latitude, longitude } = this.state.currentData;
		openMap({ end: `${latitude}, ${longitude}` });
	}

	componentDidMount() {
		var { kode } = this.props.navigation.getParam("data");
		services.getPju(kode)
			.then( data => {
				this.defaultGetKota = data.idKota && ( () => services.getKota(data.idProvinsi) );
				this.defaultGetKecamatan = data.idKecamatan && ( () => services.getKecamatan(data.idKota) );
				this.defaultGetKelurahan = data.idKelurahan && ( () => services.getKelurahan(data.idKecamatan) );
				
				this.setState({ currentData: data });
			});
	}

	getDetailView() {
		var data = this.state.currentData;
		var legal = this.state.legal !== undefined ? this.state.legal : !!data.idPelanggan;

		return (
			<React.Fragment>
				<Text style={styles.label}>Foto PJU</Text>
				<View style={styles.previewContainer}>
					<View style={styles.previewFrame}>
						<Image
							style={{ flex: 1 }}
							source={{ uri: this.state.foto ? this.state.foto.uri : `${BASE_URL}/pju/img?kode=${data.kode}&data=${Date.now()}` }}
						/>
					</View>
					<Button
						buttonStyle={styles.button}
						title="Ubah foto"
						onPress={this.takePicture}
					/>
				</View>

				<Button
					buttonStyle={styles.button}
					title="Buka di map"
					onPress={this.openMap}
				/>

				<Text style={styles.label}>Status PJU</Text>
				<Picker
					selectedValue={legal}
					onValueChange={ val =>
						this.setState({ legal: val })
				}>
					<Picker.Item label="Legal" value={true}/>
					<Picker.Item label="Ilegal" value={false}/>
				</Picker>

				{ legal &&
					<React.Fragment>
						<Text style={styles.label}>ID Pelanggan</Text>
						<Button
							buttonStyle={styles.button}
							title="Dari PJU Sekitar"
							onPress={this.selectIdPelanggan}
						/>
						<Input
							value={this.state.idPelanggan || data.idPelanggan}
							labelStyle={[styles.label, styles.removePaddingLabel]}
							inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
							keyboardType="number-pad"
							onChangeText={ val => this.setState({ idPelanggan: val}) }
						/>
					</React.Fragment>
				}

				<Input
					defaultValue={`${data.tipeLampu || ""}`}
					placeholder="-"
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Tipe Lampu"
					onChangeText={ val => this.setState({ tipeLampu: val}) }
				/>

				<Input
					defaultValue={`${data.daya}`}
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Daya"
					keyboardType="number-pad"
					onChangeText={ val => this.setState({ daya: val}) }
				/>

				<Text style={styles.label}>Koordinat</Text>
				<Button
					buttonStyle={styles.button}
					title="Lokasi Sekarang"
					onPress={this.selectLocation}
				/>
				<View style={{ flex: 1, flexDirection: "row"}}>
					<Input
						value={`${this.state.longitude || data.longitude}`}
						labelStyle={[styles.label, styles.removePaddingLabel]}
						inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
						containerStyle={{flex: 1}}
						placeholder="Longitude"
						disabled editable
					/>
					<Input
						value={`${this.state.latitude || data.latitude}`}
						labelStyle={[styles.label, styles.removePaddingLabel]}
						inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
						containerStyle={{flex: 1}}
						placeholder="Latitude"
						keyboardType="number-pad"
						disabled editable
					/>
				</View>

				<Text style={styles.label}>Provinsi</Text>
				<AsyncSelect
					defaultValue={data.idProvinsi}
					getData={services.getProvinsi}
					onValueChange={ value => 
						this.setState({
							idProvinsi: value,
							getKota: () => services.getKota(value)
						}) 
					}
				/>

				<Text style={styles.label}>Kota/Kabupaten</Text>
				<AsyncSelect
					defaultValue={data.idKota}
					getData={this.state.getKota || this.defaultGetKota}
					onValueChange={ 
						value => this.setState({
							idKota: value,
							getKecamatan: () => services.getKecamatan(value)
						}) 
					}
				/>

				<Text style={styles.label}>Kecamatan</Text>
				<AsyncSelect
					defaultValue={data.idKecamatan}
					getData={this.state.getKecamatan || this.defaultGetKecamatan}
					onValueChange={ 
						value => this.setState({
							idKecamatan: value,
							getKelurahan: () => services.getKelurahan(value)
						}) 
					}
				/>

				<Text style={styles.label}>Kelurahan/Desa</Text>
				<AsyncSelect
					defaultValue={data.idKelurahan}
					getData={this.state.getKelurahan || this.defaultGetKelurahan}
					onValueChange={ value => this.setState({ idKelurahan: value }) }
				/>

				<Input
					defaultValue={`${data.jalan || ""}`}
					placeholder="-"
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Jalan"
					onChangeText={ val => this.setState({ jalan: val}) }
				/>

				<Input
					defaultValue={`${data.rt || ""}`}
					placeholder="-"
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="RT"
					onChangeText={ val => this.setState({ rt: val}) }
				/>

				<Input
					defaultValue={`${data.rw || ""}`}
					placeholder="-"
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="RW"
					onChangeText={ val => this.setState({ rw: val}) }
				/>

				<Button
					containerStyle={styles.submitButton}
					buttonStyle={styles.button}
					title="Ubah Data"
					loading={this.state.loading}
					onPress={this.submit}
				/>
			</React.Fragment>
		)
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Text h2 style={styles.title}>Data PJU</Text>
				{ this.state.currentData ? this.getDetailView() : null }
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
	inputContainer: {
		marginBottom: 20,
	},
	removePaddingLabel: {
		marginHorizontal: -10,
	},
	removePaddingInput: {
		marginHorizontal: -6,
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