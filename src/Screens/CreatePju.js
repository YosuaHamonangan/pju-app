import React from "react";
import { StyleSheet, View, ScrollView, Picker, Image } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import showError from "../Utils/showError";
import services from "../services";

class Screen extends React.Component {
	static navigationOptions = {
		headerTitle: "Tambah Titik PJU Baru",
	};

	state = {
		legal: true,
	};

	validate() {
		if(!this.state.foto) {
			showError("Foto harus diisi");
			return false;
		}

		if(this.state.legal && !this.state.idPelanggan) {
			showError("PJU legal harus memiliki ID Pelanggan");
			return false;
		}

		if(!this.state.daya) {
			showError("Daya harus diisi");
			return false;
		}

		if(!this.state.longitude || !this.state.latitude) {
			showError("Lokasi harus diisi");
			return false;
		}

		return true;
	}

	submit = () => {
		var { legal, loading, foto, ...data } = this.state;

		if(loading) return;
		if(!this.validate()) return;

		this.setState({ loading: true });

		data.foto = {
			uri: foto.uri,
			type: "image/jpg",
			name: "foto.jpg"
		};
		
		if(!legal) delete data.idPelanggan;

		// Create FormData and send to server
		var formData = new FormData();
		for (var key in data) {
			formData.append(key, data[key]);
		}

		services.createPju(formData)
			.then( res => {
				this.setState({ loading: false });
				this.props.navigation.replace("PjuMap");
			})
			.catch( err => {
				services.errorHandler(err);
				this.setState({ loading: false });
			});
	};

	selectIdPelanggan = () => {
		this.props.navigation.navigate("PjuMap", {
			title: "Pilih titik PJU",
			filter: [["legal", true]],
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

	render() {
		return (
			<ScrollView style={styles.container}>
				<Text h2 style={styles.title}>Data PJU Baru</Text>
				<Text style={styles.label}>Foto PJU</Text>
				<View style={styles.previewContainer}>
					<View style={styles.previewFrame}>
						{ this.state.foto &&
							<Image
								style={{flex: 1}}
								source={{uri: this.state.foto.uri}}
							/>
						}
					</View>
					<Button
						buttonStyle={styles.button}
						title="Ambil foto"
						onPress={this.takePicture}
					/>
				</View>

				<Text style={styles.label}>Status PJU</Text>
				<Picker
					selectedValue={ this.state.legal }
					onValueChange={ val =>
						this.setState({ legal: val })
				}>
					<Picker.Item label="Legal" value={true}/>
					<Picker.Item label="Ilegal" value={false}/>
				</Picker>

				{ this.state.legal &&
					<React.Fragment>
						<Text style={styles.label}>ID Pelanggan</Text>
						<Button
							buttonStyle={styles.button}
							title="Dari PJU Sekitar"
							onPress={this.selectIdPelanggan}
						/>
						<Input
							labelStyle={[styles.label, styles.removePaddingLabel]}
							inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
							keyboardType="number-pad"
							value={this.state.idPelanggan}
							onChangeText={ val => this.setState({ idPelanggan: val}) }
						/>
					</React.Fragment>
				}

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Tipe Lampu"
					onChangeText={ val => this.setState({ tipeLampu: val}) }
				/>

				<Input
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
						labelStyle={[styles.label, styles.removePaddingLabel]}
						inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
						containerStyle={{flex: 1}}
						placeholder="Longitude"
						value={this.state.longitude ? this.state.longitude.toString() : ""}
						disabled
					/>
					<Input
						labelStyle={[styles.label, styles.removePaddingLabel]}
						inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
						containerStyle={{flex: 1}}
						placeholder="Latitude"
						keyboardType="number-pad"
						value={this.state.latitude ? this.state.latitude.toString() : ""}
						disabled
					/>
				</View>


				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Jalan"
					onChangeText={ val => this.setState({ jalan: val}) }
				/>

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Kota/Kabupaten"
					onChangeText={ val => this.setState({ kota: val}) }
				/>

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Kecamatan"
					onChangeText={ val => this.setState({ kecamatan: val}) }
				/>

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="Kelurahan/Desa"
					onChangeText={ val => this.setState({ kelurahan: val}) }
				/>

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="RW"
					onChangeText={ val => this.setState({ rw: val}) }
				/>

				<Input
					labelStyle={[styles.label, styles.removePaddingLabel]}
					inputContainerStyle={[styles.inputContainer, styles.removePaddingInput]}
					label="RT"
					onChangeText={ val => this.setState({ rt: val}) }
				/>
				<Button
					containerStyle={styles.submitButton}
					buttonStyle={styles.button}
					title="Submit"
					loading={this.state.loading}
					onPress={this.submit}
				/>
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
		marginBottom: 20
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