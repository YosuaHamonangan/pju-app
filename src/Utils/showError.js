import Toast from 'react-native-root-toast';

function showError(message) {
	return Toast.show(message, {
		duration: Toast.durations.LONG,
		position: Toast.positions.BOTTOM,
		shadow: true,
		animation: true,
		hideOnPress: true,
		delay: 0,
	});
}

export default showError;