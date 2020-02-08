import React from "react";
import { Picker } from "react-native";

export default class Component extends React.Component {
	state = {}

	_getOptions() {
		if(!this.props.getData) return;

		this.props.getData()
			.then( data => this._updateOptions(data) );
	}

	_updateOptions(options) {
		this.setState(
			{options, value: ""},
			this.props.onValueChange ? () => this.props.onValueChange("") : null
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
		this._getOptions();
	}

	render() {
		var { options, value } = this.state;
		var isValid = Array.isArray(options) && options.length > 0;

		var { onValueChange, required } = this.props;
		return (
			<Picker enabled={isValid} selectedValue={ isValid && value ? value : ""}
				onValueChange={ value => {
					this.setState({ value });
					if(onValueChange) onValueChange(value);
				}}
			>
				<Picker.Item disabled label=" -- Pilih salah satu -- " value="" />
				{ isValid &&
					options.map( ( {value, label}, i) => <Picker.Item key={i} label={label} value={value} /> )
				}
			</Picker>
		);
	}
}
