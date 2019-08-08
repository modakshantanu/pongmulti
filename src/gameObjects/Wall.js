import { rotateVector ,distance2d, reflection} from "../utils/2d";




export class Wall {

	constructor(args) {
		this.x1 = args.x1;
		this.y1 = args.y1;
		this.x2 = args.x2;
		this.y2 = args.y2;

	}

	getReflection(ball) {
		let parallelVector = {x: this.x2-this.x1, y: this.y2-this.y1};
		let normalVector = rotateVector(parallelVector, Math.PI/2);

		// Make sure normalVector is pointing inward
		let midpoint = {x: (this.x1+this.x2)/2, y: (this.y1+this.y2)/2};
		let offset = {...midpoint};
		offset.x += normalVector.x*0.001;
		offset.y += normalVector.y*0.001;

		if (distance2d(ball.x,ball.y,midpoint.x,midpoint.y) < distance2d(ball.x,ball.y,offset.x,offset.y)) {
		
			normalVector.x *= -1;
			normalVector.y *= -1;
		}

		// Normalize the normal lol
		let magnitude = Math.sqrt(normalVector.x**2 + normalVector.y**2);
		normalVector.x /= magnitude;
		normalVector.y /= magnitude;
		

		return reflection({x:ball.dx, y:ball.dy}, normalVector,1.0);

	}

	draw(state) {
		var ctx  = state.context;

		ctx.save();
		ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(this.x1,this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.stroke();
		ctx.restore();
	}
}