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
	right:0,bottom:30,

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
	right: 0


}

export default class Settings extends React.Component {


	constructor(props) {
		super(props);

		this.state = {
			opened:false,
		}

		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.AICheckboxChange = this.AICheckboxChange.bind(this);
	}

	toggleDropdown() {
		this.setState((state) => ({opened: !state.opened}));
	}

	AICheckboxChange(e) {
		let newSettings = this.props.settings;
		newSettings.AI[e.target.id] = !newSettings.AI[e.target.id];
		this.props.changeHandler(newSettings);
	}


	render() {


		var AICheckboxArray = [];
		const names = ["Red 1", "Red 2", "Red 3", "Blue 1","Blue 2", "Blue 3"];
		for (let i = 0; i < 6; i++) {
			let e = (
			<div  key = {i} style = {{width:45,display:"flex",flexDirection:"column"}}>
				<div style = {{color:(names[i][0] === 'R'?"red":"blue")}}>{names[i]}</div>
				<input type = "checkbox" id = {i.toString()} checked = {this.props.settings.AI[i]} onChange = {this.AICheckboxChange}></input>
			</div>)

			AICheckboxArray.push(e);
		}


		const content = (
			<div style = {dropdownContent}>
				<div style = {categoryHeader}>
					<div>Enable AI</div>
					<div style = {{display:"flex" , flexDirection:"row"}}>
						{AICheckboxArray}
					</div>
				</div>
			</div>
		)


		return(
			<div style = {dropdown}>
				{this.state.opened? content:""}
				<div style = {buttonStyle} onClick = {this.toggleDropdown}>Settings {this.state.opened? "↓":"↑"} </div>
				
			</div>
		)
	}
}