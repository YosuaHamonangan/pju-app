import React from "react";
import { Picker } from "react-native";

export default class Component extends React.Component {
	state = {}

	_onValueChange =  value => {
		var { onValueChange } = this.props;
		this.setState({ value });
		if(onValueChange) onValueChange(value);
	}

	_getOptions(value) {
		if(!this.props.getData) return;

		this.props.getData()
			.then( data => this._updateOptions(data, value) );
	}

	_updateOptions(options, value) {
		if(!this._isMounted) return;
		
		var shouldCallback = !this._firstUpdate;
		this._firstUpdate = false;

		value = value || "";
		this.setState(
			{options, value},
			shouldCallback && this.props.onValueChange ? () => this.props.onValueChange(value) : null
		);
	}

	getSnapshotBeforeUpdate(prvProps) {
		this.prvGetData = prvProps.getData;
		return null;
	}

	componentDidUpdate() {
		var { getData } = this.props
		if(this.prvGetData === getData) return;
		this._getOptions();
		if(!getData)  this._updateOptions(null);
	}

	componentDidMount() {
		this._isMounted = true;
		this._firstUpdate = true;
		this._getOptions(this.props.defaultValue);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		var { options, value } = this.state;
		var isValid = Array.isArray(options) && options.length > 0;

		var { placeholder } = this.props;
		placeholder = placeholder || " -- Pilih salah satu -- ";
		return (
			<Picker enabled={isValid} selectedValue={ isValid && value ? value : ""}
				onValueChange={this._onValueChange}
			>
				<Picker.Item disabled label=" -- Pilih salah satu -- " value="" />
				{ isValid &&
					options.map( ( {value, label}, i) => <Picker.Item key={i} label={label} value={value} /> )
				}
			</Picker>
		);
	}
}
