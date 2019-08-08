export class PlayerCard {
	constructor(args) {
		this.playerName = args.playerName || "Untitled";
		this.color = args.color || "red";
		this.left = args.left; this.right = args.right;
		this.x = args.x; this.y = args.y; // center of

	}

	draw(state) {
		const ctx = state.context;

		ctx.textBaseline = "top"; 
		ctx.font = "14px sans-serif";
		var boxwidth = ctx.measureText(this.playerName).width + 4;
		if (boxwidth < 42) boxwidth = 42;	
		let x = this.x - boxwidth/2;
		let y = this.y - 17; 


		ctx.beginPath();
		ctx.rect(x, y, boxwidth, 34);
		ctx.strokeStyle = (this.color === "red"? "red":"blue");
		ctx.stroke();
		ctx.fillStyle = (this.color === "red"? "#f88":"#88f"); ctx.fill();
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		ctx.fillText(this.playerName, x + 2,y + 2);
		ctx.closePath();
		ctx.font = "14px Courier New";
	
			
			
		ctx.beginPath();
		ctx.moveTo(x + 7, y + 18) // 2 + 14 + 2
		ctx.lineTo(x + 2, y + 18 + 7);
		ctx.lineTo(x + 7, y + 18+14);
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(x + 35, y + 18);
		ctx.lineTo(x + 40, y + 18 + 7);
		ctx.lineTo(x + 35, y + 18+14);
		ctx.fill();
		ctx.fillText(this.left,x + 9, y + 18);
		ctx.fillText(this.right,x + 24, y + 18);
		
	
	
		

	}
}