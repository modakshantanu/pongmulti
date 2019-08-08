import { rotateVector } from "../utils/2d";
import {lerp} from '../utils/math';
import { updateRate , updateTime , ballMinSpeed} from "../utils/constants";


class Ball {
	constructor(args) {
        this.x = args.x; 
        this.y = args.y;
        this.dx = args.dx;
        this.dy = args.dy; // changes the direction of movement  1 means up and -1 means down &  left or right 
        this.radius = 10;
        this.delete = false; // Whether the ball should be deleted in the next frame
        this.r = 0;
        this.dr = 0;
        this.color = "#000";
        this.prevX = args.x;
        this.prevY = args.y;
        this.lastUpdateTime = Date.now();

    }

    draw(state) {

        var currentTime = Date.now(); 
        var timeSinceLastUpdate = currentTime - this.lastUpdateTime;
        var {x:renderX,y:renderY} = lerp({x:this.prevX,y:this.prevY},{x:this.x,y:this.y}, timeSinceLastUpdate/updateTime); 
        // var renderX = this.x;
        // var renderY = this.y;


       
        var ctx = state.context;
        ctx.save();
        ctx.translate(renderX + 0.5,renderY + 0.5);
        ctx.rotate(this.r);

        if (this.color === 'red') ctx.fillStyle = "#800";
        else if (this.color === 'blue') ctx.fillStyle = "#008";
        else ctx.fillStyle = "#888";
       
        ctx.beginPath();
        ctx.arc(0,0,this.radius,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
    }

    update(state) {

        this.prevX = this.x;
        this.prevY = this.y;

        this.x += this.dx;
        this.y += this.dy;
        this.r += this.dr;
        if( Math.sqrt(this.dx ** 2 + this.dy ** 2) < ballMinSpeed ) {
            this.dx *= 1.2; this.dy *= 1.2;
        }

        this.lastUpdateTime = Date.now();
    
    }
    
}

export default Ball;