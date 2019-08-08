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
import Settings from './components/Settings';
import { Particle } from './gameObjects/Particle';
import {PlayerCard} from './gameObjects/PlayerCard'
import {updateRate, ballInitSpeed} from './utils/constants';



const backgroundStyling = { 
	backgroundColor : "	#fff"
}

const GameState = {
	NOT_QUEUEING:0,
	QUEUEING:1,
	RUNNING:2,
	GOAL_SCORED:3,
	POST_MATCH:4,
}


const Teams = {
	RED:0,
	BLUE:1,
}

var animationFrameId;
var goalText;
var goalTextStyle;
var tickTock = false;
// The main component that contains the canvas, and other buttons if needed
class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			input: new InputManager(), // TODO UPDATE This for single player
			context: null, // the canvas context,
			gameState: GameState.RUNNING,
			redScore:0,
			blueScore:0,
			settings: {
				trail:true,
			},

		}

	
		this.reset1v1 = this.reset1v1.bind(this);
		this.resetPositions = this.resetPositions.bind(this);
		this.updatePaddles = this.updatePaddles.bind(this);
		this.changeSettings = this.changeSettings.bind(this);
		this.createParticle = this.createParticle.bind(this);
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);
		
	}

	componentDidMount() {
		this.state.input.bindKeys();
		
		const context = this.refs.canvas.getContext('2d'); // This is to get context
		this.setState({context:context});		
		this.reset1v1();
		animationFrameId = requestAnimationFrame(this.draw); 
		setInterval(this.update, 1000/updateRate);

	}



	reset1v1() {
		this.setState({redScore:0,blueScore:0,gameState:GameState.RUNNING});
		this.particles = []; 
		
		this.walls = [
			new Wall({x1:0,y1:100,x2:500,y2:100}),
			new Wall({x1:0,y1:399,x2:500,y2:399}),
		];
		this.goals = [
			new Goal({x1:0,y1:100,x2:0,y2:400,color:"red",teamId:Teams.RED}),
			new Goal({x1:499,y1:100,x2:499,y2:400,color:"blue",teamId:Teams.BLUE}),
		];
		this.paddles = [
			new Paddle({x1:10, y1:100, x2:10, y2:400,color:"red"}),
			new Paddle({x1:490,y1:400,x2:490,y2:100,color:"blue"}),
		]
		this.playerCards = [
			new PlayerCard({playerName:"Red 1", color:"red", x:25, y:50,left:"v", right:"b"}),
			new PlayerCard({playerName:"Blue 1",color:"blue", x:475,y:50,left:'-',right:"="})
		]
		
		this.ball = new Ball({x:250, y: 250,});
		this.resetPositions();

	
	}

	resetPositions() {
		this.particles = [];
		this.setState({redpower:0, bluepower:0});
		let randomAngle = randomBetween(-Math.PI/4,Math.PI/4);
		let initialBallVelocity = rotateVector({x:ballInitSpeed,y:0},randomAngle);

		// Make the ball go either right or left with 50:50 chance
		if (Math.random() < 0.5) { 
			initialBallVelocity.x *= -1;
			initialBallVelocity.y *= -1;
		}
		this.ball = new Ball({x: 250, y: 250,dx: initialBallVelocity.x, dy: initialBallVelocity.y});
		this.paddles.forEach(paddle => {
			paddle.position = 50;
		})
	}

	updatePaddles() {
		let keys = this.state.input.pressedKeys;

		this.paddles[0].update(this.state,keys.red1); 
		this.paddles[1].update(this.state,keys.blue1);
		
	}

	createParticle(args) {
		if (this.state.settings.trail)
			this.particles.push(new Particle(args));
	}

	update() {
		tickTock = !tickTock;
		if (this.state.gameState === GameState.GOAL_SCORED) {
			return;
		}

		// Creating new particles
		if(tickTock) {
			while (this.particles[0] && this.particles[0].delete) {
				this.particles.shift();
			}
			this.particles.forEach(particle => particle.update())
			this.createParticle({x:this.ball.x, y:this.ball.y, color:this.ball.color})
		}


		
		this.paddles.forEach(paddle => {
			// The below statement is to convert an array of objects {x,y} to array of numbers  
			let hitbox = paddle.getHitbox();
			let hitboxArr = [];
			hitbox.forEach(e => {
				hitboxArr.push(e.x);
				hitboxArr.push(e.y);
			})

			// Now hitboxArr contains the points in correct format [x1,y1,x2,y2...]
			if (intersects.circlePolygon(this.ball.x, this.ball.y,this.ball.radius,hitboxArr)) {
				let newVelocity = paddle.getReflection(this.ball,this.state.settings.curveball);
				this.ball.dx = newVelocity.x;
				this.ball.dy = newVelocity.y;
				this.ball.x += this.ball.dx; this.ball.y += this.ball.dy;
				this.createParticle((({x,y}) => ({x,y}))(this.ball))
				this.ball.color = paddle.color;
			}
			
		})

		// Collision between ball and walls
		this.walls.forEach(wall => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, wall.x1, wall.y1, wall.x2, wall.y2)) {
				let newVelocity = wall.getReflection(this.ball);
				this.ball.dx = newVelocity.x;
				this.ball.dy = newVelocity.y;
			}
		})

	
	
		this.ball.update(this.state);
		this.updatePaddles();

		//console.log(this.particles.length)
		var ctx = this.state.context;
		// Collision between ball and goals
		this.goals.forEach(goal => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, goal.x1, goal.y1, goal.x2, goal.y2)) {
				// Update the score
				this.draw(0,true);
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

				goalTextStyle = "30px Courier New";
				goalText = teamText+ " has scored!";
				
				
				this.setState({gameState: GameState.GOAL_SCORED});
				
				setTimeout(() => {
					this.resetPositions();

					this.setState({gameState: GameState.RUNNING});

				},1500);

			}
		})
	}

	draw(timeStam , singleFrame = false) {
	
	
		const ctx = this.state.context;
		if (this.state.gameState === GameState.GOAL_SCORED) {
			ctx.font = "30px Courier New";
			ctx.fillStyle = goalTextStyle;
			ctx.fillText(goalText,80,250);
			if (singleFrame === false) animationFrameId = requestAnimationFrame(this.draw);
			return;
		}


		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,500); // Erase the previous contents with this




		this.walls.forEach(wall => wall.draw(this.state));
		this.goals.forEach(goal => 	goal.draw(this.state));
		this.playerCards.forEach(card => card.draw(this.state));
		this.particles.forEach(p => p.draw(this.state));

		
	
		this.paddles.forEach(p => p.draw(this.state));
		this.ball.draw(this.state);


		ctx.restore();
		if (singleFrame === false) animationFrameId = requestAnimationFrame(this.draw);
	}

	componentWillUnmount() {
		this.state.input.unbindKeys();
	}

	changeSettings(newSettings) {
		this.setState({settings:newSettings});
	}
	render() {
		return (
			<div style = {backgroundStyling}>

			<div >
				<h1>Pong++</h1>
				
				<canvas ref = "canvas" width = "501" height = "501"/>
				<Scoreboard redScore = {this.state.redScore} blueScore = {this.state.blueScore}/>
				<center>
					<button id = "1v1" onClick = {this.reset1v1}>Reset 1v1</button> 	
				</center>
				<Settings settings = {this.state.settings} changeHandler = {this.changeSettings}/>

			
			</div>
			</div>
		)
	}

	
}



export default App;
