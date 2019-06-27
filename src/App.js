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

	
		this.paddle1 = new Paddle({x1:10, y1:0, x2:10, y2:300});
		this.paddle2 = new Paddle({x1:490,y1:0,x2:490,y2:300});
		this.Ball = new Ball({x: 100 / 2, y: 250});
		this.draw = this.draw.bind(this);
		
	}

	componentDidMount() {
		this.state.input.bindKeys();
		
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

		if (this.Ball.x <= 0 || this.Ball.x > this.Ball.canvas.width) {
			this.Ball.speed = this.Ball.speed * -1;
		}
		
		if (this.Ball.y <= 0 || this.Ball.y > this.Ball.canvas.height) {
			this.Ball.gravity = this.Ball.gravity * -1;
		}
		
		
		if (((this.Ball.x + this.Ball.speed <= this.paddle1.x + this.paddle1.width) && (this.Ball.y + this.Ball.gravity > this.paddle1.y) && (this.Ball.y + this.Ball.gravity <= this.paddle1.y + this.paddle1.height)) || ((this.Ball.x + this.Ball.width + this.Ball.speed >= this.paddle2.x) && (this.Ball.y + this.Ball.gravity > this.paddle2.y) && (this.Ball.y + this.Ball.gravity <= this.paddle2.y + this.paddle2.height))){ 
		
			 //If this.Ball is in the same space as the player 1 paddle (AND) if this.Ball will be in the same X position as the left paddle (player 1) AND the this.Ball’s Y position is between the player 1 paddles top and bottom Y values, then they have collided
		
			 //  run the same checks against the player 2 paddle on the right
			this.Ball.speed = this.Ball.speed * -1;
		
		  // If this.Ball hits either paddle then change the direction by changing the speed value
		} if(this.Ball.x + this.Ball.speed < this.paddle1.x) { 
			
			//If this.Ball doesn’t hit the left paddle, but goes past it then…
			this.Ball.speed = this.Ball.speed * -1; 
			//Change the direction of this.Ball to go to the right
			this.Ball.x = 100 + this.Ball.speed;
		
			//Reposition this.Ball and move it along the X axis
			this.Ball.y += this.Ball.gravity; 
			//Reposition this.Ball and move it along the Y axis
		
		} else if (this.Ball.x + this.Ball.speed > this.paddle2.x + this.paddle2.width) { 
			//this.Ball is similar to the above lines of code -> moves it towards the left
			this.Ball.speed = this.Ball.speed * -1;
			this.Ball.x = 500 + this.Ball.speed;
			this.Ball.y += this.Ball.gravity;
		} else {
			// If this.Ball doesn’t hit the paddles, or pass either paddle, then we want to move this.Ball as normal
			this.Ball.x += this.Ball.speed;
			this.Ball.y += this.Ball.gravity;
		}
		// Render the 2 paddles. Their position is updated within their own render methods
		this.paddle1.render(this.state,{left:this.state.input.pressedKeys.l1, right:this.state.input.pressedKeys.r1});
		this.paddle2.render(this.state,{left:this.state.input.pressedKeys.l2, right:this.state.input.pressedKeys.r2});
		this.Ball.render(this.state);

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
