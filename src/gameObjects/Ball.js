import Paddle from './Paddle';


let player1 = new Paddle({x1:10, y1:0, x2:10, y2:300});
let player2 = new Paddle({x1:490,y1:0,x2:490,y2:300});

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


        if (((this.x + this.speed <= player1.x + player1.width) && (this.y + this.gravity > player1.y) && this.y + this.gravity <= player1.y + player1.height) || ((this.x + this.width + this.speed >= player2.x) && (this.y + this.gravity > player2.y) && this.y + this.gravity <= player2.y + player2.height)) { 
    
             //If this is in the same space as the player 1 paddle (AND) if this will be in the same X position as the left paddle (player 1) AND the this’s Y position is between the player 1 paddles top and bottom Y values, then they have collided

             //  run the same checks against the player 2 paddle on the right
            this.speed = this.speed * -1;
    
          // If this hits either paddle then change the direction by changing the speed value
        } 

        else if (this.x + this.speed < player1.x) { 
            
            //If this doesn’t hit the left paddle, but goes past it then…
            this.speed = this.speed * -1; 
            //Change the direction of this to go to the right
            this.x = 100 + this.speed;
        
            //Reposition this and move it along the X axis
            this.y += this.gravity; 
            //Reposition this and move it along the Y axis

        } else if (this.x + this.speed > player2.x + player2.width) { 
            //This is similar to the above lines of code -> moves it towards the left
            this.speed = this.speed * -1;
            this.x = 500 + this.speed;
            this.y += this.gravity;
        } else {
            // If this doesn’t hit the paddles, or pass either paddle, then we want to move this as normal
            this.x += this.speed;
            this.y += this.gravity;
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