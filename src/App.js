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
import {updateRate, ballInitSpeed, paddleSpeed, updateTime} from './utils/constants';
import { QueueBox } from './components/QueueBox';
import * as api from './api';
import { isNumber } from 'util';

const backgroundStyling = { 
	backgroundColor : "	#fff"
}
var start;



var timer = Date.now();
var totalError = 0;
const PacketType = {
	POSITION:0,
	STATE:1
}

const GameState = {
	NOT_QUEUEING:0,
	QUEUEING:1,
	PRE_MATCH:2,
	RUNNING:3,
	GOAL_SCORED:4,
	POST_MATCH:5,
}

const Teams = {
	RED:0,
	BLUE:1,
}
var goalText;
var goalTextStyle;
var animationFrameId;
// The main component that contains the canvas, and other buttons if needed
class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			input: new InputManager(), // TODO UPDATE This for single player
			context: null, // the canvas context,
			gameState: GameState.NOT_QUEUEING,
			redScore:0,
			blueScore:0,
			redHandle:"Red 1",
			blueHandle:"Blue 1",
			settings: {
				trail:false,
			},
			handle:""

		}

		this.reset1v1 = this.reset1v1.bind(this);
		this.resetPositions = this.resetPositions.bind(this);
		this.updatePaddles = this.updatePaddles.bind(this);
		this.changeSettings = this.changeSettings.bind(this);
		this.createParticle = this.createParticle.bind(this);
		this.sendInput = this.sendInput.bind(this);
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);
		this.changeGameState = this.changeGameState.bind(this);
		this.changeHandle = this.changeHandle.bind(this);
		this.stateUpdate = this.stateUpdate.bind(this);
		this.posUpdate = this.posUpdate.bind(this);
		this.winningTeam = "";
		this.tickCounter = 0;
		this.cutsceneCounter = 0;
		this.gameId = -1;
		this.ourPlayer = -1;
		this.prevInput = {left:false,right:false};
		this.frameHistory = new Array(1000);
	
	}

	componentDidMount() {
		this.state.input.bindKeys();
		
		const context = this.refs.canvas.getContext('2d'); // This is to get context
		this.setState({context:context});		
		this.reset1v1();
		animationFrameId = requestAnimationFrame(this.draw); 
		setTimeout(this.update, updateTime);
		api.subscribe(this.matchFound.bind(this),this.stateUpdate,this.posUpdate,this.gameOver.bind(this));

	}

	reset1v1() {
		//this.setState({redScore:0,blueScore:0,gameState:GameState.RUNNING});
		this.particles = []; 
		this.frameHistory = [];
		this.tickCounter = 0;
		
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
			new PlayerCard({playerName:this.state.redHandle, color:"red", x:25, y:50,left:"v", right:"b"}),
			new PlayerCard({playerName:this.state.blueHandle,color:"blue", x:475,y:50,left:'-',right:"="})
		]
		
		
		this.ball = new Ball({x:250, y: 250,});
		this.resetPositions();
	}

	stateUpdate(packet) {
		switch(packet.state) {
			case GameState.PRE_MATCH:
				this.cutsceneCounter = 360;
				this.setState({gameState:GameState.PRE_MATCH});
				break;

			case GameState.RUNNING:
				this.cutsceneCounter = 0;
				this.setState({gameState:GameState.RUNNING});
				timer = Date.now();
				break;
			
			case GameState.GOAL_SCORED:
				this.cutsceneCounter = 180;
				this.setState({gameState:GameState.GOAL_SCORED, redScore:packet.redScore, blueScore:packet.blueScore});
				goalText = (packet.scorer === 0? this.state.redHandle:this.state.blueHandle)+ " has scored";
				goalTextStyle = (packet.scorer === 0? "red":"blue");
				this.tickCounter = packet.tickCounter;
				this.resetPositions();

				break;

			default:
				console.log("INVALID PACKET");
		}
	}

	posUpdate(packet) {
		//if (this.tickCounter < 100) console.log("Received paddle",packet.paddlePos[this.ourPlayer]," frame ", packet.tickCounter);
		
		//return;
		if(this.state.gameState !== GameState.RUNNING) return;
		let tickDiff = this.tickCounter - packet.tickCounter;

		let tempBall = new Ball({...packet.ball});
		//console.log(tempBall);
		this.ball.x = tempBall.x; this.ball.y = tempBall.y;
		this.ball.dx = tempBall.dx; this.ball.dy = tempBall.dy;
		this.ball.color = tempBall.color;

	


		for (let i = 0; i < 2; i++) {
			if(i !== this.ourPlayer) {
				this.paddles[i].updatePosition(packet.paddlePos[i] + (packet.paddlePos[i]-packet.paddlePrevPos[i])*tickDiff);
			} else {

				//console.log("Tick ", packet.tickCounter, "Diff ", this.frameHistory[packet.tickCounter%1000].paddle-packet.paddlePos[i] )
				
				
				if (this.frameHistory[packet.tickCounter%1000] && 
					Math.abs(this.frameHistory[packet.tickCounter%1000].paddle - packet.paddlePos[i]) > 0.01
					) {
					
					//console.log("Diff", this.frameHistory[packet.tickCounter%1000].paddle - packet.paddlePos[i]);
					let tempPos = packet.paddlePos[i];
					for (let j = packet.tickCounter + 1; j <= this.tickCounter; j++) {
						try {
							if (this.frameHistory[(j-1)%1000].input.left) tempPos -= paddleSpeed; 
							if (this.frameHistory[(j-1)%1000].input.right) tempPos += paddleSpeed; 
							if (tempPos < this.paddles[i].minPosition) tempPos = this.paddles[i].minPosition;
							if (tempPos > this.paddles[i].maxPosition) tempPos = this.paddles[i].maxPosition;

							this.frameHistory[j%1000].paddle = tempPos;
						} catch(e) {
							console.log("error");
							console.log(this.frameHistory[j%1000], j, this.tickCounter);
						}
						
					}
				
					this.paddles[i].updatePosition(tempPos);
				}
			}
		}

		
	
		return;
		// Predict position of ball after tickDiff frames
		for (let i = 0; i < tickDiff; i++) {

			this.paddles.forEach(paddle => {
				// The below statement is to convert an array of objects {x,y} to array of numbers  
				let hitbox = paddle.getHitbox();
				let hitboxArr = [];
				hitbox.forEach(e => {
					hitboxArr.push(e.x);
					hitboxArr.push(e.y);
				})
	
				// Now hitboxArr contains the points in correct format [x1,y1,x2,y2...]
				if (intersects.circlePolygon(tempBall.x, tempBall.y,tempBall.radius,hitboxArr)) {
					let newVelocity = paddle.getReflection(tempBall,this.state.settings.curveball);
					tempBall.dx = newVelocity.x;
					tempBall.dy = newVelocity.y;
					tempBall.x += tempBall.dx; tempBall.y += tempBall.dy;
					tempBall.color = paddle.color;
				}
				
			})
	
			// Collision between ball and walls
			this.walls.forEach(wall => {
				if (intersects.circleLine(tempBall.x, tempBall.y, tempBall.radius, wall.x1, wall.y1, wall.x2, wall.y2)) {
					let newVelocity = wall.getReflection(tempBall);
					tempBall.dx = newVelocity.x;
					tempBall.dy = newVelocity.y;
				}
			})
	
			tempBall.update();
		}

		this.ball.x = tempBall.x; this.ball.y = tempBall.y;
		this.ball.dx = tempBall.dx; this.ball.dy = tempBall.dy;
		this.ball.color = tempBall.color;
	}

	resetPositions() {
	
		this.particles = [];
		// let randomAngle = randomBetween(-Math.PI/4,Math.PI/4);
		// let initialBallVelocity = rotateVector({x:ballInitSpeed,y:0},randomAngle);

		// // Make the ball go either right or left with 50:50 chance
		// if (Math.random() < 0.5) { 
		// 	initialBallVelocity.x *= -1;
		// 	initialBallVelocity.y *= -1;
		// }
		this.timer = new Date();
		totalError = 0;
		this.ball = new Ball({x: 250, y: 250,dx:0,dy:0});
		this.paddles.forEach(paddle => {
			paddle.updatePosition(50);
		})
	}

	updatePaddles() {
		if (this.ourPlayer === -1) return;
		let keys = this.state.input.pressedKeys;
		this.paddles[this.ourPlayer].update(this.state,keys);
		
	}

	createParticle(args) {
		if (this.state.settings.trail)
			this.particles.push(new Particle(args));
	}

	update() {
	

		//if (this.tickCounter === 1 && this.state.gameState === GameState.RUNNING) start = Date.now();
		//if (this.tickCounter === 100) console.log("Time ", Date.now() - start);
		
		if (this.state.gameState === GameState.NOT_QUEUEING || this.state.gameState === GameState.QUEUEING) {
			setTimeout(this.update,updateTime);
			return;
		}

		if (this.state.gameState === GameState.PRE_MATCH || this.state.gameState === GameState.GOAL_SCORED) {
			this.cutsceneCounter--;

			if (this.cutsceneCounter === 0) {

				if (this.state.gameState === GameState.GOAL_SCORED && (this.state.redScore === 5 || this.state.blueScore === 5)) {
					
					this.winningTeam = (this.state.redScore > this.state.blueScore ? "Red ":"Blue");

					this.resetPositions();
					this.setState({gameState:GameState.POST_MATCH});
					this.cutsceneCounter = 180;
				} else {
					this.setState({gameState:GameState.RUNNING});
					this.totalError = 0;
					timer = Date.now();
				}
			}

			
		}

		if (this.state.gameState === GameState.POST_MATCH) {
			this.cutsceneCounter--;
			if (this.cutsceneCounter === 0) {
				this.setState({gameState:GameState.NOT_QUEUEING});
			}
		}

		if (this.state.gameState === GameState.RUNNING) {
			this.tickCounter++;
		}

		// Creating new particles
		if(this.tickCounter % 2 === 0) {
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
				let newVelocity = paddle.getReflection(this.ball);
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

		// Save positions of paddle to history
		if (this.state.gameState === GameState.RUNNING) {
			this.frameHistory[this.tickCounter%1000] = {
				tickCounter:this.tickCounter,
				input:this.state.input.pressedKeys,
				paddle:this.paddles[this.ourPlayer].position,
				ball:{
					x:this.ball.x, y:this.ball.y,
					dx:this.ball.dx, dy:this.ball.dy
				}
			}	

			//if (this.tickCounter < 100) console.log("Storing left = ",this.state.input.pressedKeys.left, "paddle", this.paddles[this.ourPlayer].position, "frame ",this.tickCounter);
			
		}
		this.sendInput(this.state.input.pressedKeys);

		if (this.state.gameState === GameState.RUNNING) {
			let elapsed = Date.now() - timer;
			let error = elapsed - updateTime;
			totalError += error;
			
			if (totalError > updateTime) {
				//console.log("Skipping frame");
				this.tickCounter++;
				totalError -= updateTime;
			}
			let nextDelay = updateTime - totalError;
			
			if (nextDelay < 0) nextDelay = 0;
			//if (nextDelay === 0) console.log("Skipped frame"); 
			//console.log("Elapsed",elapsed,"Total error", totalError, "Next delay",nextDelay);
			//console.log(elapsed|0);

			timer = Date.now();
			setTimeout(this.update, nextDelay);
		}
		else {
			setTimeout(this.update, updateTime);
		}
		
	
	}

	draw() {

		const ctx = this.state.context;
		if (this.state.gameState === GameState.GOAL_SCORED) {
			
			ctx.font = "30px Courier New";
			ctx.fillStyle = goalTextStyle;
			ctx.fillText(goalText,80,250);
			animationFrameId = requestAnimationFrame(this.draw);
			return;
		}

		


		ctx.save();
		ctx.fillStyle = "#FFF";
		ctx.translate(0.5,0.5);
		ctx.fillRect(0,0,500,500); // Erase the previous contents with this



		if (this.state.gameState === GameState.PRE_MATCH) {
			
			ctx.font = "30px Courier New";
			ctx.fillStyle = "#000";
			ctx.fillText("First to 5",150,220);
			ctx.fillText("Good Luck!",150,290);




		}
		if (this.state.gameState === GameState.POST_MATCH) {
			ctx.font = "30px Courier New";
			ctx.fillStyle = "#000";
			var postGameText = this.winningTeam + " Team Wins!";
			ctx.fillText(postGameText,120,220);
		}


		this.walls.forEach(wall => wall.draw(this.state));
		this.goals.forEach(goal => 	goal.draw(this.state));
		this.playerCards.forEach(card => card.draw(this.state));
		this.particles.forEach(p => p.draw(this.state));

		
	
		this.paddles.forEach(p => p.draw(this.state));
		
		
		
		//if (isNaN(this.ball.x)) console.log(this.ball.x);
		this.ball.draw(this.state);


		ctx.restore();
		animationFrameId = requestAnimationFrame(this.draw);
	}

	sendInput(keys) {
		if (this.state.gameState === GameState.RUNNING) {
			api.sendInput({keys,tick:this.tickCounter,ourPlayer:this.ourPlayer,gameId:this.gameId});
			//if (this.tickCounter < 100) console.log("Sending left = ",keys.left,"frame",this.tickCounter);
		}
	}

	componentWillUnmount() {
		this.state.input.unbindKeys();
	}

	changeSettings(newSettings) {
		this.setState({settings:newSettings});
	}

	changeHandle(newHandle) {
		this.setState({handle:newHandle});
	}

	queueingAck() { 
		this.setState({gameState:GameState.QUEUEING});
	}

	matchFound(data) {
		this.gameId = data.gameId;
		this.ourPlayer = data.ourPlayer;
		this.setState({redHandle:data.redHandle,blueHandle:data.blueHandle,gameState:GameState.RUNNING} , this.reset1v1)
	}

	gameOver(data) {
		this.setState({gameState:GameState.NOT_QUEUEING});
	}

	changeGameState(newState) {
		if (newState === GameState.QUEUEING) {
			api.queue(this.state.handle,this.queueingAck.bind(this));
		}
		else 
			this.setState({gameState:newState});
		
		if (newState === GameState.GOAL_SCORED) {
			this.resetPositions();
		}
	}

	render() {
		return (
			<div style = {backgroundStyling}>

			<div >
				<h1>Pong++ Multiplayer</h1>
				<center>
					<QueueBox handle = {this.state.handle} gameState = {this.state.gameState} handleChangeHandler = {this.changeHandle} 
					gameStateChangeHandler = {this.changeGameState}/>

				</center>
				<canvas ref = "canvas" width = "501" height = "501"/>
				<Scoreboard redScore = {this.state.redScore} blueScore = {this.state.blueScore}/>
				
				<Settings settings = {this.state.settings} changeHandler = {this.changeSettings}/>

			
			</div>
			</div>
		)
	}

}



export default App;
