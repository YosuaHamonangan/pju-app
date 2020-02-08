import React from "react";
import { Picker } from "react-native";

export default class Component extends React.Component {
	state = {}

	_onValueChange =  value => {
		var { onValueChange } = this.props;
		this.setState({ value });
		if(onValueChange) onValueChange(value);
	}

	_getOptions() {
		if(!this.props.getData) return;

		this.props.getData()
			.then( data => this._updateOptions(data) );
	}

	_updateOptions(options) {
		if(!this._isMounted) return;
		
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
		this._isMounted = true;
		this._getOptions();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		var { options, value } = this.state;
		var isValid = Array.isArray(options) && options.length > 0;

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
