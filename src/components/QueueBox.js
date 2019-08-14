import React from 'react';
const GameState = {
	NOT_QUEUEING:0,
	QUEUEING:1,
	PRE_MATCH:2,
	RUNNING:3,
	GOAL_SCORED:4,
	POST_MATCH:5,
}

export class QueueBox extends React.Component {

	constructor(props){
		super(props);

		this.state = {
			invalid:false
		}
		
	}
	queueHandler(e) {

		if (this.props.gameState !== GameState.NOT_QUEUEING) return;

		if (this.props.handle.length < 1 || this.props.handle.length > 15) {
			this.setState({invalid:true});
			return;
		} 

		this.setState({invalid:false});

		this.props.gameStateChangeHandler(GameState.QUEUEING);
	}


	render() {

		var buttonText;
		switch(this.props.gameState) {
			case GameState.NOT_QUEUEING: buttonText = "Search"; break;
			case GameState.QUEUEING: buttonText = "Searching"; break;
			default: buttonText = "In Game"; break;
		}

	
		return (
			<div>
				{this.props.gameState === GameState.NOT_QUEUEING?"Choose a username:":""} <input type="text" value = {this.props.handle} onChange = {(e) => this.props.handleChangeHandler(e.target.value)}/>
				<button onClick = {this.queueHandler.bind(this)}>{buttonText}</button>
				{this.state.invalid? (<div>Name must be between 1-15 characters</div>):<div></div>}
			</div>

		)
	}

}