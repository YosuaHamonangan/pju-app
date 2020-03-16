import React, { Component } from "react";
import {
	createAppContainer,
	createBottomTabNavigator,
	createDrawerNavigator,
	createSwitchNavigator,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import navigator from './src/Utils/navigator';

const AuthStack = createStackNavigator({
	Login: require("./src/Screens/Login").default
});

const AppStack = createStackNavigator({
	Home: require("./src/Screens/Home").default,
	PjuMap: require("./src/Screens/PjuMap").default,
	CreatePju: require("./src/Screens/CreatePju").default,
	SelectLocation: require("./src/Screens/SelectLocation").default,
	Camera: require("./src/Screens/Camera").default,
	PjuDetail: require("./src/Screens/PjuDetail").default,
});

const Main = createSwitchNavigator({
	Loading: require("./src/Screens/Loading").default,
	Auth: AuthStack,
	App: AppStack,
});

const AppContainer = createAppContainer(Main);

export default class App extends React.Component {
	render() {
		return (
			<AppContainer ref={ ref => navigator.setTopLevelNavigator(ref) }/>
		);
	}
}