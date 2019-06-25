import React, {Component} from 'react';
import InputManager from './InputManager'; // InputManager is a class handling all keyboard inputs
import './App.css';
import Paddle from './gameObjects/Paddle';
import Ball from './gameObjects/Ball';
import { Scoreboard } from './components/Scoreboard';

const GameState = {
	STOPPED:0,
	RUNNING:1
}



// The main component that contains the canvas, and other buttons if needed
class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			input: new InputManager(), // Instantiate new InputManager
			context: null, // the canvas context,
			redScore:0,
			blueScore:0
		}

	
		this.paddle1 = new Paddle({x1:10, y1:10, x2:300, y2:10});
		this.paddle2 = new Paddle({x1:490,y1:0,x2:490,y2:300});
		this.ball = new Ball({x: 100 / 2, y: 250});
		this.draw = this.draw.bind(this);
		
	}

	componentDidMount() {
		this.state.input.bindKeys();
		//where to include ? -- under here ? /
		const context = this.refs.canvas.getContext('2d'); // This is to get context. It is a part of canvas // like an import ?? no 
		this.setState({context:context});		
		requestAnimationFrame(this.draw); 

	}

	draw() {
		const ctx = this.state.context;
		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,300); // Erase the previous contents with this

		// Render the 2 paddles. Their position is updated within their own render methods
		this.paddle1.render(this.state,{left:this.state.input.pressedKeys.l1, right:this.state.input.pressedKeys.r1});
		this.paddle2.render(this.state,{left:this.state.input.pressedKeys.l2, right:this.state.input.pressedKeys.r2});
		this.ball.render(this.state, Ball.ballBounce);

		ctx.restore();
		requestAnimationFrame(this.draw); // Call draw() again on the next frame
	}

	componentWillUnmount() {
		this.state.input.unbindKeys();
	}
	render() {
		return (
			<div>
				<h1>Pong++</h1>
				
				<canvas ref = "canvas" width = "500" height = "300"/>
				<Scoreboard redScore = {this.state.redScore} blueScore = {this.state.blueScore}/>
				<center>Reset Game</center>
				<center>
					<button id = "1v1">1v1</button> 
					<button onClick = {() => console.log(this.paddle1.getHitbox())}>Debug</button>
				</center>
			
			</div>
		)
	}

	
}

export default App;
