import React, {Component} from 'react';
import InputManager from './InputManager'; // InputManager is a class handling all keyboard inputs
import './App.css';
import Paddle from './gameObjects/Paddle';
import Ball from './gameObjects/Ball';
import { Scoreboard } from './components/Scoreboard';
import { Wall } from './gameObjects/Wall';
import { Goal } from './gameObjects/Goal';
import intersects from 'intersects';
import { rotateVector } from './utils/2d';
import { randomBetween } from './utils/math';



const GameState = {
	STOPPED:0,
	RUNNING:1,
	GOAL_SCORED:2
}

const Teams = {
	RED:0,
	BLUE:1,
}

var animationFrameId;

// The main component that contains the canvas, and other buttons if needed
class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			input: new InputManager(), // Instantiate new InputManager
			context: null, // the canvas context,
			gameState: GameState.RUNNING,
			redScore:0,
			blueScore:0,
			gameMode:1, // Number of players on each side

		}

		this.walls = [
			new Wall({x1:0,y1:0,x2:500,y2:0}),
			new Wall({x1:0,y1:299,x2:500,y2:299}),
		];

		this.goals = [
			new Goal({x1:0,y1:0,x2:0,y2:300,color:"red",teamId:Teams.RED}),
			new Goal({x1:499,y1:0,x2:499,y2:300,color:"blue",teamId:Teams.BLUE})
		];

		this.paddles = [
			new Paddle({x1:10, y1:0, x2:10, y2:300}),
			new Paddle({x1:490,y1:300,x2:490,y2:0})
		]

		this.ball = new Ball({x:50, y: 50});
		this.draw = this.draw.bind(this);
		this.reset1v1 = this.reset1v1.bind(this);
		this.reset2v2 = this.reset2v2.bind(this);
		this.reset3v3 = this.reset3v3.bind(this);
		this.renderPaddles = this.renderPaddles.bind(this);
		
	}

	componentDidMount() {
		this.state.input.bindKeys();
		
		const context = this.refs.canvas.getContext('2d'); // This is to get context
		this.setState({context:context});		
		this.resetPositions1v1();
		animationFrameId = requestAnimationFrame(this.draw); 

	}

	reset1v1() {
		this.setState({redScore:0,blueScore:0,gameState:GameState.RUNNING});
		this.resetPositions1v1();
	}

	reset2v2() {
		this.setState({redScore:0,blueScore:0,gameState:GameState.RUNNING});
		this.resetPositions1v1();
	}

	reset3v3() {
		this.setState({redScore:0,blueScore:0,gameState:GameState.RUNNING});
		this.resetPositions1v1();
	}

	resetPositions() {
		switch(this.state.gameMode) {
			case 1: 
				this.resetPositions1v1(); break;
			case 2:
				this.resetPositions2v2(); break;
			case 3: 
				this.resetPositions3v3(); break;
			default: console.log("LOLOLOLOLOL");
		}
	}

	resetPositions1v1() {
		// Give the ball an initial velocity of 3 in a random direction
		let initialBallVelocity = rotateVector({x:3,y:0},randomBetween(-Math.PI/4, Math.PI/4));

		// Make the ball go either right or left with 50:50 chance
		if (Math.random() > 0.5) {
			initialBallVelocity.x *= -1;
			initialBallVelocity.y *= -1;
		}
		console.log(initialBallVelocity);
		this.ball = new Ball({x: 250, y: 150,dx: initialBallVelocity.x, dy: initialBallVelocity.y});
		this.paddles.forEach(paddle => paddle.position = 50);

	}

	renderPaddles() {

		let keys = this.state.input.pressedKeys;
		
		switch(this.state.gameMode) {
			case 1:
				this.paddles[0].render(this.state, keys.red1); 
				this.paddles[1].render(this.state, keys.blue1);
				break;

			case 2:
				this.paddles[0].render(this.state, keys.red1); 
				this.paddles[1].render(this.state, keys.red2);
				this.paddles[2].render(this.state, keys.blue1); 
				this.paddles[3].render(this.state, keys.blue2);
				break;
			
			case 3: 
				this.paddles[0].render(this.state, keys.red1); 
				this.paddles[1].render(this.state, keys.red2);
				this.paddles[2].render(this.state, keys.red3); 
				this.paddles[3].render(this.state, keys.blue1);
				this.paddles[4].render(this.state, keys.blue2); 
				this.paddles[5].render(this.state, keys.blue3);
				break;
			

			default :
				console.log("WHY");
		}
	}

	draw() {
		const ctx = this.state.context;
		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,500); // Erase the previous contents with this

		
		this.walls.forEach(wall => {
			wall.render(this.state);
		})
		this.goals.forEach(goal => {
			goal.render(this.state);
		})

		// Collision between ball and paddles
		this.paddles.forEach(paddle => {
			// The below statement is to convert an array of objects {x,y} to array of numbers  
			let hitboxArr = paddle.getHitbox().flatMap(element => {
				return [element.x,element.y];
			}); 
			// Now hitboxArr contains the points in correct format [x1,y1,x2,y2...]
			if (intersects.circlePolygon(this.ball.x, this.ball.y,this.ball.radius,hitboxArr)) {
				let newVelocity = paddle.getReflection(this.ball);
				this.ball.dx = newVelocity.x;
				this.ball.dy = newVelocity.y;
				this.ball.x += this.ball.dx;
				this.ball.y += this.ball.dy;
			}
			
		})

		// Collision between ball and walls
		this.walls.forEach(wall => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, wall.x1, wall.y1, wall.x2, wall.y2)) {
				let newVelocity = wall.getReflection(this.ball);
				this.ball.dx = newVelocity.x;
				this.ball.dy = newVelocity.y;
				this.ball.x += this.ball.dx;
				this.ball.y += this.ball.dy;
			}
			
		})



		// Collision between ball and goals
		this.goals.forEach(goal => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, goal.x1, goal.y1, goal.x2, goal.y2)) {
				// Update the score
				let teamText;
				if (goal.teamId === Teams.RED) {
					this.setState(state => ({blueScore: state.blueScore + 1}));
					teamText = "Blue team";
					ctx.fillStyle = "blue";
				} else {
					this.setState(state => ({redScore: state.redScore + 1}));
					teamText = "Red team";
					ctx.fillStyle = "red";
				}
				ctx.font = "30px Courier New";
				
				ctx.fillText(teamText+ " has scored!",80,150);

				cancelAnimationFrame(animationFrameId);
				this.setState({gameState: GameState.GOAL_SCORED});

				
			}
			
		})


		// Render the 2 paddles. Their position is updated within their own render methods
		this.renderPaddles();
		this.ball.render(this.state);

		ctx.restore();
		if (this.state.gameState === GameState.RUNNING) 
			animationFrameId = requestAnimationFrame(this.draw); // Call draw() again on the next frame
		else if (this.state.gameState === GameState.GOAL_SCORED) {
			cancelAnimationFrame(animationFrameId);
		
			setTimeout(() => {
				animationFrameId = requestAnimationFrame(this.draw); 
				this.resetPositions1v1();
				this.setState({gameState: GameState.RUNNING});
			},1000);
		}

	
	}

	componentWillUnmount() {
		this.state.input.unbindKeys();
	}
	render() {
		return (
			<div>
				<h1>Pong++</h1>
				
				<canvas ref = "canvas" width = "500" height = "500"/>
				<Scoreboard redScore = {this.state.redScore} blueScore = {this.state.blueScore}/>
				<center>Reset Game</center>
				<center>
					<button id = "1v1" onClick = {this.reset1v1}>1v1</button> 
					<button id = "2v2" onClick = {this.reset2v2}>2v2</button>
					<button id = "3v3" onClick = {this.reset3v3}>3v3</button>
				</center>
			
			</div>
		)
	}

	
}

export default App;
