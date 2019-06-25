
import {distance2d ,rotateVector} from '../utils/2d';

// Class that handles drawing the paddle
export default class Paddle {
	constructor(args) {

		// x1,y1 and x2,y2 represent the starting and ending point where the paddle can slide in between
		this.x1 = args.x1 || 0;
		this.y1 = args.y1 || 0;
		this.x2 = args.x2 || 0;
		this.y2 = args.y2 || 0;

		
		// Depth and width are dimensions of the paddle
		this.depth = args.depth || 10;
		this.width = args.width || 50;

		this.position = 50; // Percentage value showing how far the paddle is from its first endpoint to the other
		// Ex. 0 means it is at (x1,y1) , 100 means at (x2,y2), 50 means it is in between

		this.slidinglength = distance2d(this.x1,this.y1,this.x2,this.y2);
		if (this.y1 === this.y2) {
			this.tiltAngle = 90*Math.PI/180;
		} else {
			this.tiltAngle = -Math.atan((this.x2-this.x1)/(this.y2-this.y1));
		}
		
		if (this.slidinglength < this.width) {
			console.log("Paddle sliding length smaller than paddle width!");
		}

		// The min and max value of position so that the ends of the paddle dont cross x1,y1 and x2,y2
		// Ex. if a paddle is 10px wide and the total length is 100px, min and max pos will be 5% and 95% 
		this.minPosition = 100*(this.width/this.slidinglength)/2;
		this.maxPosition = 100*(1 - this.width/this.slidinglength/2);

	}

	render(state,input) {
		var ctx = state.context;
		
		// Move the paddle based on keyboard input
		if (input.right) {
			this.position++;
		}

		if (input.left) {
			this.position--;
		}

		// Stop it from going beyond the limit
		if (this.position > this.maxPosition) this.position = this.maxPosition;
		if (this.position < this.minPosition) this.position = this.minPosition;

		// Get x and y position of paddle center
		this.position = Math.round(this.position);
		this.paddleCenterX = (this.x1*(1-this.position/100) + this.x2*this.position/100);
		this.paddleCenterY = (this.y1*(1-this.position/100) + this.y2*this.position/100);

		ctx.save();
		ctx.translate(0.5,0.5);
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#888888";
		
		ctx.translate(this.paddleCenterX, this.paddleCenterY);
		ctx.rotate(this.tiltAngle );
		// Draw paddle with fillRect()
		ctx.fillRect(-this.depth/2,-this.width/2,this.depth,this.width);
		
		ctx.restore();
		

	}

	getHitbox() {

		let sw = this.width/2;
		let sd = this.depth/2;
		var points = [
			{x:sd,y:sw},{x:sd,y:-sw},{x:-sd,y:-sw},{x:-sd,y:sw}
		];


		return points.map((e) => {
			let {x:u,y:v} = rotateVector(e,-this.tiltAngle);
		
			return {x:u + this.paddleCenterX,y: v + this.paddleCenterY}
		});
	
	}
}