
export class Particle {
	constructor(args) {
		this.x = args.x;
		this.y = args.y;
		this.lifetime = 40;
		this.delete = false;
		this.color = args.color;
	}

	draw(state) {
		
		var ctx = state.context;
		ctx.fillStyle = this.color;
		ctx.beginPath();
		//ctx.arc(this.x, this.y, this.lifetime/20, 0 , Math.PI*2);
		var edgeLength = this.lifetime/10;
		ctx.fillRect(this.x-edgeLength/2, this.y-edgeLength/2,edgeLength,edgeLength);
		ctx.fill();
		ctx.closePath();

		
	}

	update() {
		
		this.lifetime--;
			if (this.lifetime <= 0) {
			this.delete = true;
		}
	}

	
}