module.exports = {

	randomBetween:(a,b) => {
		return a + Math.random()*(b-a);
	},

	lerp:(a,b,f)=> {
		// given 2 previous locations a -> b, a occured at t=0 and b ata t=1
		// function returns position at t = 1+f 
		f += 1;
		return {
			x: (a.x*(1-f) + b.x*f),
			y: (a.y*(1-f) + b.y*f)
		}
	}
}