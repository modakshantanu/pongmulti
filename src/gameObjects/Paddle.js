//Paddle will be 50x10 px
import distance2d from '../utils/2d';

export default class Paddle {
	constructor(args) {
		this.x1 = args.x1 || 10;
		this.y1 = args.y1 || 0;
		this.x2 = args.x2 || 10;
		this.y2 = args.y2 || 300;
		this.depth = args.depth || 10;
		this.width = args.width || 50;
		this.position = 50; // Percentage value showing how far the paddle is from its first endpoint to the other

		this.slidinglength = distance2d(this.x1,this.y1,this.x2,this.y2);
		if (this.slidinglength < this.width) {
			console.log("Paddle sliding length smaller than paddle width!");
		}

		this.minPosition = 100*(this.width/this.slidinglength)/2;
		this.maxPosition = 100*(1 - this.width/this.slidinglength/2);

	}

	render(state,input) {
		var ctx = state.context;
		
		if (input.right) {
			this.position++;
		}

		if (input.left) {
			this.position--;
		}

		if (this.position > this.maxPosition) this.position = this.maxPosition;
		if (this.position < this.minPosition) this.position = this.minPosition;

		this.position = Math.round(this.position);
		this.paddleCenterX = (this.x1*(1-this.position/100) + this.x2*this.position/100);
		this.paddleCenterY = (this.y1*(1-this.position/100) + this.y2*this.position/100);

		ctx.save();
		ctx.translate(0.5,0.5);
		ctx.strokeStyle = "#000000";
		ctx.fillStyle = "#888888";
		
		ctx.translate(this.paddleCenterX, this.paddleCenterY);
		ctx.fillRect(-this.depth/2,-this.width/2,this.depth,this.width);
		
		ctx.restore();
		

	}
}