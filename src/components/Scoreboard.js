import React from 'react';
import {Button} from 'react-bootstrap';
import Key from './Instructions.js';

const dropDown = {
	position: "fixed",
	bottom:0,
	left: 0
}

const dropDownContent= {
 
position: "absolute",
  left:10,bottom:50,

  width:300,
  minHeight:150,
  border:"2px solid blue",
  background: "	#00FF00",
	zIndex: "1",
}




const buttonStyle = {
	width:"100px",
	padding:"2px",
	border:"2px solid blue",
	margin:"2px",
	textAlign: "center",
	fontSize : 15,
	borderRadius:"2",
	userSelect:"none",
	position: "",
	

}




const mainStyle = {
	height:50,
	width:100,
	margin:"auto",
	padding:10,
	float : "center"
}

const leftStyle = {
	width: "50%",
	height: 50,
	float: "left",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	boxShadow:"0px 0px 0px 11px red inset",
	

}

const leftNumberStyle = {
	margin : 0,
	height: 20,
	float: "left",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",

}

const rightStyle = {
	marginLeft: "50%",
	height:50,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	boxShadow:"0px 0px 0px 11px blue inset"
}



const rightNumberStyle = {
	margin : 10,
	height:20,
	display: "flex",
	alignItems: "center",
	justifyContent: "right",
	// boxShadow:"0px 0px 0px 10px blue inset",
	float : "center"
}

const pauseButton = {
	margin:"auto",
	height:"30px",
	width:"30px",

}

// const instructions = { 
// 	margin : "auto",
// 	height:40,
// 	width: 400,
// 	padding:40,
// 	alignItems: "left",
// 	justifyContent: "left",
// 	float: "left",

// }



export class Scoreboard extends React.Component {

	state = { display : false}

	handleOnClick = () => { 
		this.setState((state) => ({display: !state.display}));
		// return (
		// 	<div>
		// 	{userInfo}
		// 	</div>
		// );
	}


	render() {


		


		const userInfo = (

			<div style = { dropDownContent}>
			
				<h2 align = "centre"> Controls </h2>
				<div> Left: A </div>
				<div> Right: D</div>

				<hr/>

				<div>Enter a username and click search to start searching!</div>
			</div>
			
			 );

		return (
			<div>
				<div style = {mainStyle}>
					<div id = "red" style = {leftStyle}>{this.props.redScore}</div>
					<div id = "blue" style = {rightStyle}>{this.props.blueScore}</div>
				</div>
			

				<div style = {dropDown} >
				{this.state.display? userInfo:""}	
				<div>
					<Button style = {buttonStyle} variant = "primary" onClick = {this.handleOnClick}>
						Instructions
					</Button>
				</div>
				</div>
			</div>
		);
	}
}