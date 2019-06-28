class Ball {
	constructor(args) {
        this.x = 150; 
        this.y = 250;
        this.speed = 1;
        this.gravity = 1; // changes the direction of movement  1 means up and -1 means down &  left or right 
        this.width = 15;
        this.canvas = { 
            height: 300,
            width: 500,
        };
    }

    render(state){ 

        
        if (this.x <= 0 || this.x > this.canvas.width) {
            this.speed = this.speed * -1;
        }

        if (this.y <= 0 || this.y > this.canvas.height) {
            this.gravity = this.gravity * -1;
        }
     		
        var ctx = state.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();

    }
}

export default Ball;