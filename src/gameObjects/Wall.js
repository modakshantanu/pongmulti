



export class Wall {

	constructor(args) {
		this.x1 = args.x1;
		this.y1 = args.y1;
		this.x2 = args.x2;
		this.y2 = args.y2;

	}

	render(state) {
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