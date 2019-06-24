
  /*
			(0,0)							(500,0)
				.							.
				.
				.
				.
				.
            (0,300)							(500,300)
            
        */	


class Ball {
	constructor(args) {
        this.x = 150; 
        this.y = 250;
        this.speed = 1;
        this.gravity = 1; // changes the direction of movement  1 means up and -1 means down &  left or right 
        this.canvas = { 
            height: 300,
            width: 500,
        };
    }

//Left or right 
    ballCollision() { 
        
        //Check if the ball will hit the left or right sides of the canvas
        if (((Ball.y + Ball.speed) <= 0) || ((Ball.y + Ball.speed) >= this.canvas.width)) {
            Ball.speed = Ball.speed * -1; //If it does, change the speed value to move in the opposite direction
            Ball.y += Ball.speed; //Move the Ball
            Ball.x += Ball.gravity;
        } 
        else { 
            //If the ball doesn’t hit the sides, then move the Ball as normal
            Ball.y += Ball.speed;
            Ball.x += Ball.gravity;
        }

        this.draw();// Call the draw function
    }
    
// top and bottom 
    ballBounce() { 
        
        //Check if the ball will hit the top or bottom of the canvas
        if (((Ball.x + Ball.gravity) <= 0) || ((Ball.x + Ball.gravity + Ball.height) >= this.canvas.height)){
            Ball.gravity = Ball.gravity * -1; 
            // If it does, change the gravity value to move in the opposite direction
            Ball.x += Ball.gravity; // Move the Ball
            Ball.y += Ball.speed;
        }
         else { 
            //If the ball doesn’t hit the top or bottom, then move the Ball as normal
            Ball.x += Ball.speed;
            Ball.y += Ball.gravity
        }

        this.ballCollision();
    }

    render(state){ 

		
        var ctx = state.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();

    }
}

export default Ball;