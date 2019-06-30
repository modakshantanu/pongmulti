class Ball {
	constructor(args) {
        this.x = 400; 
        this.y = 250;
        this.dx = 2;
        this.dy = 2; // changes the direction of movement  1 means up and -1 means down &  left or right 
        this.radius = 10;
        this.delete = false; // Whether the ball should be deleted in the next frame

    }

    render(state){ 

        this.x += this.dx;
        this.y += this.dy;
        
        var ctx = state.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

export default Ball;