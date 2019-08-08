import React from 'react';

const dropdown = {
	position: "fixed",
	

	bottom:0,
	right: 0

}

const categoryHeader = {
	background: "#AAAAFF",
	width:"90%",
	margin:"auto",
	marginTop:"2px",
}

const dropdownContent= {
 
  	position: "absolute",
	right:10,bottom:30,

	width:300,
	minHeight:150,
	border:"2px solid blue",
	background: "#8888ff",
	

  	zIndex: "1",
}

const buttonStyle = {
	width:"100px",
	padding:"2px",
	border:"2px solid blue",
	margin:"2px",
	textAlign: "center",
	borderRadius:"2",
	userSelect:"none",
	position: "fixed",
	bottom:0,
	right: 0,
	fontSize : 15


}

export default class Settings extends React.Component {


	constructor(props) {
		super(props);

		this.state = {
			opened:false,
		}

		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.AICheckboxChange = this.AICheckboxChange.bind(this);
		this.curveballChange = this.curveballChange.bind(this);
		this.powerupsChange = this.powerupsChange.bind(this);
		this.accelChange = this.accelChange.bind(this);
		this.trailChange = this.trailChange.bind(this);
	
	}

	toggleDropdown() {
	
		this.setState((state) => ({opened: !state.opened}));
	}

	AICheckboxChange(e) {
		let newSettings = this.props.settings;
		newSettings.AI[e.target.id] = !newSettings.AI[e.target.id];
		this.props.changeHandler(newSettings);
	}
	curveballChange(e) {
		let newSettings = this.props.settings;
		newSettings.curveball = e.target.checked;
		this.props.changeHandler(newSettings);
	}
	powerupsChange(e) {
		let newSettings = this.props.settings;
		newSettings.powerups = e.target.checked;
		this.props.changeHandler(newSettings);
	}
	accelChange(e) {
		let newSettings = this.props.settings;
		newSettings.accel = e.target.checked;
		this.props.changeHandler(newSettings);
	}
	trailChange(e) {
		let newSettings = this.props.settings;
		newSettings.trail = e.target.checked;
		this.props.changeHandler(newSettings);
	}

	render() {




		var trailCheckbox = <input type = "checkbox" checked = {this.props.settings.trail} onChange = {this.trailChange}></input>

		const content = (
			<div style = {dropdownContent}>
			

				<div style = {categoryHeader}>
					<div style = {{fontSize:"16px"}}>Graphics Settings</div>
					<div>Ball Trail {trailCheckbox}</div>
					
				</div>
			</div>
		)


		return(
			<div style = {dropdown}>
				{this.state.opened? content:""}
				<button style = {buttonStyle} onClick = {this.toggleDropdown}>Settings {this.state.opened? "↓":"↑"} </button>
				
			</div>
		)
	}
}