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

		
	}


	render() {

		var buttonText;
		switch(this.props.gameState) {
			case GameState.NOT_QUEUEING: buttonText = "Queue"; break;
			case GameState.QUEUEING: buttonText = "Queueing"; break;
			default: buttonText = "In Game"; break;
		}

		return (
			<div>
				Choose a username: <input type="text" value = {this.props.handle} onChange = {(e) => this.props.handleChangeHandler(e.target.value)}/>
				<button onClick = {() => {
					console.log("Queue clicked");
					if (this.props.gameState === GameState.NOT_QUEUEING) {
						this.props.gameStateChangeHandler(GameState.QUEUEING);
					}

				}}>{buttonText}</button>
			</div>

		)
	}

}