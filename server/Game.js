// import {Wall} from './gameObjects/Wall';
// import {Goal} from './gameObjects/Goal';
// import {Paddle} from './gameObjects/Paddle';
// import {Ball} from './gameObjects/Ball';
// import intersects from 'intersects'

let Wall = require('./gameObjects/Wall');
let Goal = require('./gameObjects/Goal');
let Paddle = require('./gameObjects/Paddle');
let Ball = require('./gameObjects/Ball');
let intersects = require('intersects');
let {randomBetween} = require('./utils/math');
let {rotateVector} = require('./utils/2d');
let constants = require('./utils/constants')

const Teams = {
	RED:1,
	BLUE:2
}

var start;

const GameState = {
	NOT_QUEUEING:0,
	QUEUEING:1,
	PRE_MATCH:2,
	RUNNING:3,
	GOAL_SCORED:4,
	POST_MATCH:5,
}

const PacketType = {
	POSITION:0,
	STATE:1
}


class Game {
	constructor(args) {
		if (args.gameMode === 1 ) {
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
			this.ball = new Ball({x:250, y: 250,});
		}
		this.tickCounter = 0;
		this.cutsceneTimer = 360;
		this.inputPackets = [];

		this.redId = args.redId;
		this.blueId = args.blueId;

		this.redScore = 0;
		this.blueScore = 0;

		this.redInput = {left:false,right:false};
		this.blueInput = {left:false,right:false};

		this.sendPacket = args.sendPacket;

		this.gameState = GameState.PRE_MATCH;
		this.delete = false;

	
	}


	resetPositions() {
		let initialBallVelocity ={x:constants.ballInitSpeed,y:0};
		// initialBallVelocity.x = 0;
		this.inputPackets = [];
		this.redInput = {left:false,right:false};
		this.blueInput = {left:false,right:false};


		// Make the ball go either right or left with 50:50 chance
		if (Math.random() < 0.5) { 
			initialBallVelocity.x *= -1;
			initialBallVelocity.y *= -1;
		}
		
		this.ball = new Ball({x: 250, y: 250,dx:initialBallVelocity.x,dy:initialBallVelocity.y});
		this.paddles.forEach(paddle => {
			paddle.position = 50;
		})
	}
	newInput(data) {
		if (this.gameState !== GameState.RUNNING) return;
		// console.log("Received input from ",data.ourPlayer);
		this.inputPackets.push({
			player:data.ourPlayer,
			frame:data.tick,
			input:data.keys
		})

	}


	update() {
	
		if (this.gameState === GameState.PRE_MATCH) {
			let packet = {
				type:PacketType.STATE,
				state:GameState.PRE_MATCH,
			}
			this.sendPacket(packet,this.redId);
			this.sendPacket(packet,this.blueId);
			this.cutsceneTimer--;
			if (this.cutsceneTimer <= 0) {
				this.gameState = GameState.RUNNING;
				let packet = {
					type:PacketType.STATE,
					state:GameState.RUNNING,
				}
				this.sendPacket(packet,this.redId);
				this.sendPacket(packet,this.blueId);
				this.resetPositions();
			}
		}
		else if (this.gameState === GameState.GOAL_SCORED) {
			this.cutsceneTimer--;
			if (this.cutsceneTimer <= 0) {
				let packet = {
					type:PacketType.STATE,
					state:GameState.RUNNING,
				}
				this.sendPacket(packet,this.redId);
				this.sendPacket(packet,this.blueId);
				this.gameState = GameState.RUNNING;
				this.resetPositions();
			}

			return;
		}
		else if (this.gameState === GameState.RUNNING) {
			this.tickCounter++;
		} else {
			return;
		}


		let redFrame = -1, blueFrame = -1;

		while (this.inputPackets.length > 0) {
			let temp = this.inputPackets.shift();
			if (temp.player === 0) {
				redFrame = temp.frame;
				this.redInput = temp.input;

			} else if (temp.player === 1) {
				blueFrame = temp.frame;
				this.blueInput = temp.input;
			}
		}

		// ball-paddle collision
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

		this.goals.forEach(goal => {
			if (intersects.circleLine(this.ball.x, this.ball.y, this.ball.radius, goal.x1, goal.y1, goal.x2, goal.y2)) {
				this.gameState = GameState.GOAL_SCORED;
				let scorer = 1;
				if (goal.color === "blue") {
					this.redScore++;
					scorer = 0;
				}
				else 
					this.blueScore++;

				let packet = {
					type:PacketType.STATE,
					state:GameState.GOAL_SCORED,
					redScore:this.redScore,
					blueScore:this.blueScore,
					scorer:scorer,
					tickCounter:this.tickCounter
				}	
				this.cutsceneTimer = 180;
				this.sendPacket(packet,this.redId); 
				this.sendPacket(packet,this.blueId);
				

				if (this.redScore === 5 || this.blueScore === 5) {
					this.delete = true;
				}
			}
		})
		
		this.ball.update();
		this.paddles[0].update(this.redInput);
		this.paddles[1].update(this.blueInput);
		//if (this.tickCounter < 100) console.log("Frame ",this.tickCounter,"Red left ",this.redInput.left, "Red pos",this.paddles[0].position);
		if (redFrame !== -1) {
			let packet = {
				type:PacketType.POSITION,
				tickCounter:redFrame,
				ball: {
					x:this.ball.x, y:this.ball.y, dx:this.ball.dx, dy:this.ball.dy,color:this.ball.color
				},
				paddlePos: [this.paddles[0].position,this.paddles[1].position],
				paddlePrevPos : [this.paddles[0].previousPos, this.paddles[1].previousPos],
			}
			this.sendPacket(packet,this.redId);
		}

		if (blueFrame !== -1) {
			let packet = {
				type:PacketType.POSITION,
				tickCounter:blueFrame,
				ball: {
					x:this.ball.x, y:this.ball.y, dx:this.ball.dx, dy:this.ball.dy,color:this.ball.color
				},
				paddlePos: [this.paddles[0].position,this.paddles[1].position],
				paddlePrevPos : [this.paddles[0].previousPos, this.paddles[1].previousPos],
				
			}
			this.sendPacket(packet,this.blueId);
		}


	}

	
}

module.exports = Game;