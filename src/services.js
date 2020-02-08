import axios from "axios";
import navigator from "./Utils/navigator";
import showError from "./Utils/showError";
import {BASE_URL} from "../global";
// import Geocoder from "react-native-geocoding";

// Geocoder.init("AIzaSyBG3l9IKNYm3OoJ-m8HswoRK0LYhfardbY");
var instance = axios.create({
	baseURL: BASE_URL
});

var services = {
	testSecret: async function() {
		return await instance.get("/test-secret");
	},
	login: async function(username, password) {
		return await instance.post("/user/login", {username, password});
	},
	createPju: async function(data) {
		return await instance.post("/pju/create", data);
	},
	getPjuList: async function(filter) {
		if(filter) {
			var filterQuery = filter.map( ([key, val]) => `${key}=${val}`).join("&");
		}
		var query = filterQuery ? `?${filterQuery}` : "" ;
		var res = await instance.get(`/pju/list${query}`);
		return res.data;
	},
	getProvinsi: async function() {
		var res = await instance.get("/get-provinsi");
		return res.data;
	},
	getKota: async function(prov) {
		var res = await instance.get("/get-kota", { 
			params: { prov }
		});
		return res.data;
	},
	getKecamatan: async function(kota) {
		var res = await instance.get("/get-kecamatan", { 
			params: { kota }
		});
		return res.data;
	},
	getKelurahan: async function(kecamatan) {
		var res = await instance.get("/get-kelurahan", { 
			params: { kecamatan }
		});
		return res.data;
	},
	// getCoordinateInfo: async function(coordinate) {
	// 	var data = await Geocoder.from(coordinate);
	// 	return data;
	// },
	errorHandler: function(err) {
		if(!err.response) {
			showError("Gagal terhubung dengan server, mohon cek koneksi anda");
		}
		else if(err.response.status === 401) {
			navigator.navigate("Auth");
		}
		else {
			var { data = {} } = err.response;
			var { message = "Terjadi masalah, mohon hubungi admin" } =  data;

			showError(message);
		}
	},
};

export default services;