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
		this.ball = new Ball({x: 100 / 2, y: 250});
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

		if (Ball.x <= 0 || Ball.x > Ball.canvas.width) {
			Ball.speed = Ball.speed * -1;
		}
		
		if (Ball.y <= 0 || Ball.y > Ball.canvas.height) {
			Ball.gravity = Ball.gravity * -1;
		}
		
		
		if (((Ball.x + Ball.speed <= paddle1.x + paddle1.width) && (Ball.y + Ball.gravity > paddle1.y) && Ball.y + Ball.gravity <= paddle1.y + paddle1.height)) || ((Ball.x + Ball.width + Ball.speed >= paddle2.x) && (Ball.y + Ball.gravity > paddle2.y) && Ball.y + Ball.gravity <= paddle2.y + paddle2.height))){ 
		
			 //If Ball is in the same space as the player 1 paddle (AND) if Ball will be in the same X position as the left paddle (player 1) AND the Ball’s Y position is between the player 1 paddles top and bottom Y values, then they have collided
		
			 //  run the same checks against the player 2 paddle on the right
			Ball.speed = Ball.speed * -1;
		
		  // If Ball hits either paddle then change the direction by changing the speed value
		} else if(Ball.x + Ball.speed < paddle1.x) { 
			
			//If Ball doesn’t hit the left paddle, but goes past it then…
			Ball.speed = Ball.speed * -1; 
			//Change the direction of Ball to go to the right
			Ball.x = 100 + Ball.speed;
		
			//Reposition Ball and move it along the X axis
			Ball.y += Ball.gravity; 
			//Reposition Ball and move it along the Y axis
		
		} else if (Ball.x + Ball.speed > paddle2.x + paddle2.width) { 
			//Ball is similar to the above lines of code -> moves it towards the left
			Ball.speed = Ball.speed * -1;
			Ball.x = 500 + Ball.speed;
			Ball.y += Ball.gravity;
		} else {
			// If Ball doesn’t hit the paddles, or pass either paddle, then we want to move Ball as normal
			Ball.x += Ball.speed;
			Ball.y += Ball.gravity;
		}
		// Render the 2 paddles. Their position is updated within their own render methods
		this.paddle1.render(this.state,{left:this.state.input.pressedKeys.l1, right:this.state.input.pressedKeys.r1});
		this.paddle2.render(this.state,{left:this.state.input.pressedKeys.l2, right:this.state.input.pressedKeys.r2});
		this.ball.render(this.state);

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
