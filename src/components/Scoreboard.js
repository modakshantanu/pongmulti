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
			
			<h2 align = "centre">{'	Controls '}</h2>
					
					<div align = "left">
					<span style = { {display : "inline-block" , float : " centre" , margin : 10}}>
					<div >
						Red 1 
					</div>
						<span style = {leftNumberStyle}>
						<Key  content = "1" color = "red"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = "2" color = "red"/>
						</span>
					</span>

					
					<span style = { {display : "inline-block" , float : " centre", margin : 10}}>
					<div >
						 Red 2 
					</div>
						<span style = {leftNumberStyle}>
						<Key  content = "S" color = "red"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = "D" color = "red"/>
						</span>
					</span>


					<span style = { {display : "inline-block" , float : " centre" , margin  : 10}}>
					<div >
						 Red 3 
					</div>
						<span style = {leftNumberStyle}>
						<Key  content = "V" color = "red"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = "B" color = "red"/>
						</span>
					</span>
					<span style = { {display : "inline-block" , float : " centre" , margin  : 10}}>
					
					</span>



					

				

					<span style = { {display : "inline-block" , float : " centre", margin : 10}}>
					<div >
						 Blue 1  
					</div>
						<span style = {leftNumberStyle}>
						<Key  color = "blue" content = "-"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = "=" color = "blue"/>
						</span>
					</span>
					<span style = { {display : "inline-block" , float : " centre", margin : 10}}>
					<div >
						 Blue 2  
					</div>
						<span style = {leftNumberStyle}>
						<Key  content = "L" color = "blue"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = ";" color = "blue"/>
						</span>
					</span>


					<span style = { {display : "inline-block" , float : " centre", margin : 10}}>
					<div >
						 Blue 3 
					</div>
						<span style = {leftNumberStyle}>
						<Key  content = "N" color = "blue"/>   
						</span>

						<span style = {rightNumberStyle}>
						<Key  content = "M" color = "blue"/>
						</span>
					</span>


				

					</div>
					<div>
						To play, select your desired settings, and press one of the reset buttons to choose the number of players. Controls are shown above.
					</div><hr/>
					<div>
						In a 1v1 game, the players playing are Red 1 and Blue 1. For 2v2, it's Red 1 and Red 2 vs Blue 1 and Blue 2. Similar for 3v3
					</div><hr/>
					<div>
						When playing with powerups, hit the ball over a green square to collect a powerup. Press '3' for Red team or '0' for blue team to use the powerup
					</div>
					<hr/>
					<div>

					</div>
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