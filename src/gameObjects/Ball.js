
// why named export ? 
// so you can import in another module
// no i mean export default at the end 
// Like what?
//SEE BELOW 
// Yeah that also works same thing okkay i 
// is context a dependency for this ? under package.json?
// okay so its not 
// then how is context part of it ? 
// See App.js
class Ball {
	constructor(args) {
        this.x = 150; 
        this.y = 250;
        /*
			(0,0)							(500,0)
				.							.
				.
				.
				.
				.
            (0,300)							(500,300)
            
        */		
    }

    render(state){ 
		
        var ctx = state.context;
		// Ok now try addi
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();

    }
}

export default Ball;