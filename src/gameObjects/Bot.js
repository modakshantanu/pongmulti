import lineIntersection from 'line-intersection';
import { distance2d } from '../utils/2d';

export class Bot {
	constructor(args) {
		this.walls = args.walls; // All other paddle ranges are treated as walls
		this.output = {left:0,right:0};
		this.waitTimer = 0;
		this.lookAhead = 10; // Bot will only calculate the ball's trajectory upto 3 bounces into the future	
		this.debug = args.debug;
	}

	reset() {
		this.waitTimer = 0;
		this.output = {left:0,right:0};
	}
	calculateOutput(ball, paddle) {

		// Waittimer is used to prevent unnecessary calculations when the ball is moving 
		// Calculation of the ball's trajectory is only done
		// once after every impact off another paddle
		//console.log(this.waitTimer);
		
		if (this.waitTimer > 0) {
			this.waitTimer--;
			return;
		} else {
			this.waitTimer = 0; // Just in case waittimer became negative
		}

		
		// Temporary object to simulate the ball
		let b = {
			x:ball.x,
			y:ball.y,
			dx:ball.dx,
			dy:ball.dy
		};

		let bouncesLeft = this.lookAhead;
		while (bouncesLeft > 0) {
			let bouncedFlag = false;

			// b1 is ball's position after 1000 ticks
			// b2 is the current ball position
			// We need to specity b1 like this becuase line-intersection requires 2 line-segments 
			let b1 = {x : Math.round(b.x + 1000*b.dx), y:Math.round( b.y + 1000*b.dy)};
			let b2 = {x : Math.round(b.x) , y: Math.round(b.y)};


			for (let i = 0; i < this.walls.length; i++) {
				let wall = this.walls[i];
				let w1 = {x:Math.round(wall.x1), y:Math.round(wall.y1)};
				let w2 = {x:Math.round(wall.x2), y:Math.round(wall.y2)};
				let intersectionPoint = lineIntersection.findSegmentIntersection([w1,w2,b1,b2]);

				if (intersectionPoint !== false) { // That means the ball will hit wall
					b.x = intersectionPoint.x;	b.y = intersectionPoint.y;
					b.x -= b.dx; b.y -= b.dy; // getReflection assumes that the ball is just about to intersect the wall
					let nextVelocity = wall.getReflection(b);
					b.x += b.dx; b.y += b.dy;
					b.dx = nextVelocity.x; b.dy = nextVelocity.y;
					b.x += b.dx; b.y += b.dy;
					
					// Update waitTimer if it is the first bounce
					if (this.waitTimer === 0) {
						// The below statement is weird to account for the case when ball.dx = 0, resulting in 0/0
						this.waitTimer = Math.round((Math.abs(ball.dx)>0.0001?((intersectionPoint.x-ball.x)/ball.dx ): ((intersectionPoint.y-ball.y)/ball.dy)))+1;
					}
					bouncesLeft--;
					bouncedFlag = true;
				
					break;
				} 
			}
			if (bouncedFlag) continue;
			
			// Now check intersection with the paddle
			let p1 = {x: Math.round(paddle.x1), y: Math.round(paddle.y1)};
			let p2 = {x: Math.round(paddle.x2), y: Math.round(paddle.y2)};

			
			let intersectionPoint = lineIntersection.findSegmentIntersection([p1,p2,b1,b2]);
			if (intersectionPoint !== false) {
				// Intersection with the paddle has been found
				// Now we need to output either left, right, or no move at all
				let current = {x:paddle.paddleCenterX, y:paddle.paddleCenterY};
				// Update waitTimer if this is the first bounce
	
				if (this.waitTimer === 0) {
					this.waitTimer = Math.round((Math.abs(ball.dx)>0.0001?((intersectionPoint.x-ball.x)/ball.dx ): ((intersectionPoint.y-ball.y)/ball.dy)))+1;
				}

				// If the paddle is close enough, do nothing
				if (distance2d(current.x, current.y, intersectionPoint.x, intersectionPoint.y) < 4) {
					this.output = {left:0,right:0};
				
					return;
				}
				// position after moving right one tick
				let dRight = {
					x: current.x+(paddle.x2 - paddle.x1)/100,
					y: current.y+(paddle.y2 - paddle.y1)/100
				}

				if (distance2d(dRight.x, dRight.y, intersectionPoint.x,intersectionPoint.y) < 
				distance2d(current.x,current.y, intersectionPoint.x, intersectionPoint.y)) {
					// Right is the way to go
					this.output = {left:0, right:1};
				
				} else {
					// Go left
					this.output = {left:1,right:0};
				
				}

				// Now find the number of ticks before next calculation is needed
				let paddleMovementTicks = Math.round(distance2d(current.x,current.y,intersectionPoint.x,intersectionPoint.y)
				/ distance2d(current.x,current.y,dRight.x,dRight.y));
				this.waitTimer = Math.min(this.waitTimer,paddleMovementTicks);
				
				return;
			}
			bouncesLeft--;
		}
		
	}
}