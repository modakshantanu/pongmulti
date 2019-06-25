import React from 'react'


const mainStyle = {
	height:50,
	width:100,
	margin:"auto",
	padding:10,
}

const leftStyle = {
	width: "50%",
	height: 50,
	float: "left",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	boxShadow:"0px 0px 0px 10px red inset",
	

}

const rightStyle = {
	marginLeft: "50%",
	height:50,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	boxShadow:"0px 0px 0px 10px blue inset"
}





export class Scoreboard extends React.Component {

	render() {
		return (
			<div style = {mainStyle}>
				<div id = "red" style = {leftStyle}>{this.props.redScore}</div>
				<div id = "blue" style = {rightStyle}>{this.props.blueScore}</div>
			</div>
		)
	}
}