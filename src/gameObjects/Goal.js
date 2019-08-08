export class Goal {
	constructor(args) {
		this.x1 = args.x1;
		this.y1 = args.y1;
		this.x2 = args.x2;
		this.y2 = args.y2;

		this.color = args.color || "red";
		this.teamId = args.teamId || 0;	
	}

	draw(state) {
		var ctx  = state.context;
		ctx.save();
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x1,this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.stroke();
		ctx.restore();
	}

	render(state) {
		var ctx  = state.context;
		ctx.save();
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.x1,this.y1);
		ctx.lineTo(this.x2,this.y2);
		ctx.stroke();
		ctx.restore();
	}
}