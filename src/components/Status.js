import React from 'react';

export class Status extends React.Component {

	
	render() {

		return (
			<div>
				<div>Players Online: {this.props.players}</div>
				<div>Games in Progress: {this.props.games}</div>
			</div>
		)
	}
}