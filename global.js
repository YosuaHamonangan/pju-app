import Config from "react-native-config";

var constants = {
	name: "PJUManagement",
	displayName: "PJUManagement",
	BASE_URL: process.env.NODE_ENV === "development" ? Config.BASE_URL_DEV : Config.BASE_URL,
}

module.exports = constants;