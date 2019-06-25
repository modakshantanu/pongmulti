// A file containing simple functions for 2d grid related calculations

export function distance2d(x1,y1,x2,y2) {
	return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

export function rotateVector(vect, angle) {
	let {x,y} = vect;
	return {
		x: Math.cos(angle)*x - Math.sin(angle)*y,
		y: -(Math.sin(angle)*x + Math.cos(angle)*y)
	}
}	