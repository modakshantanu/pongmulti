import React, {Component} from 'react';
import InputManager from './InputManager'; // InputManager is a class handling all keyboard inputs
import './App.css';
import Paddle from './gameObjects/Paddle';
import Ball from './gameObjects/Ball';
import { Scoreboard } from './components/Scoreboard';
import { Wall } from './gameObjects/Wall';
import { Goal } from './gameObjects/Goal';
import intersects from 'intersects';
import { delay } from 'q';


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
			new Paddle({x1:490,y1:0,x2:490,y2:300})
		]

		this.ball = new Ball({x: 100 / 2, y: 250});
		this.draw = this.draw.bind(this);
		
	}

	componentDidMount() {
		this.state.input.bindKeys();
		
		const context = this.refs.canvas.getContext('2d'); // This is to get context. It is a part of canvas // like an import ?? no 
		this.setState({context:context});		
		animationFrameId = requestAnimationFrame(this.draw); 

	}

	resetPositions1v1() {
		this.ball = new Ball({x: 250, y: 150});
		this.paddles.forEach(paddle => paddle.position = 50);

	}

	draw() {
		const ctx = this.state.context;
		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,300); // Erase the previous contents with this

		
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

			}
			
		})

		// Collision between ball and walls
		this.walls.forEach(wall => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, wall.x1, wall.y1, wall.x2, wall.y2)) {
				this.ball.dy *= -1; // reverse the ball's y-velocity
				console.log("bounced agains wall");
			}
			
		})



		// Collision between ball and goals
		this.goals.forEach(goal => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, goal.x1, goal.y1, goal.x2, goal.y2)) {
				console.log("bounced agains goal");
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
		this.paddles[0].render(this.state,{left:this.state.input.pressedKeys.l1, right:this.state.input.pressedKeys.r1});
		this.paddles[1].render(this.state,{left:this.state.input.pressedKeys.l2, right:this.state.input.pressedKeys.r2});
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
