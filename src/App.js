import React from 'react';
import InputManager from './InputManager';
import './App.css';
import Paddle from './gameObjects/Paddle';


class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			input: new InputManager(),
			context: null,
		}
		this.paddle1 = new Paddle({});
		this.paddle2 = new Paddle({x1:490,x2:490});
		this.draw = this.draw.bind(this);

	}

	componentDidMount() {
		this.state.input.bindKeys();

		const context = this.refs.canvas.getContext('2d');
		this.setState({context:context});

		requestAnimationFrame(this.draw); 
	}

	draw() {
		const ctx = this.state.context;
		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,300);
		this.paddle1.render(this.state,{left:this.state.input.pressedKeys.l1, right:this.state.input.pressedKeys.r1});
		this.paddle2.render(this.state,{left:this.state.input.pressedKeys.l2, right:this.state.input.pressedKeys.r2});

		ctx.restore();
		requestAnimationFrame(this.draw);
	}

	componentWillUnmount() {
		this.state.input.unbindKeys();
	}
	render() {
		return (
			<div>
				<h1>Pong++</h1>
				<br/>
				<canvas ref = "canvas" width = "500" height = "300"/>
			</div>
		)
	}
}

export default App;
