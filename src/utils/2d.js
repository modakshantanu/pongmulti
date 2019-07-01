// A file containing simple functions for 2d grid related calculations

export function distance2d(x1,y1,x2,y2) {
	return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

export function rotateVector(vect, angle) {
	let {x,y} = vect;
	return {
		x: Math.cos(angle)*x - Math.sin(angle)*y,
		y: Math.sin(angle)*x + Math.cos(angle)*y
	}
}	

// Returins a vector which is the result of *vect* bouncing off a surface with normal *normal*
// normal must have magnitude 1
// d' = d - 2(d.n)n
export function reflection(vect,normal,scalingFactor = 1.0) {
	let dotProduct = normal.x*vect.x + normal.y*vect.y;
	let result = vect;
	result.x -= 2*dotProduct*normal.x;
	result.y -= 2*dotProduct*normal.y;
	return result;
}

export function angleBetween(vect1, vect2) {
	let mag1 = Math.sqrt(vect1.x ** 2 + vect1.y ** 2);
	let mag2 = Math.sqrt(vect2.x ** 2 + vect2.y ** 2);
	let dotProduct = vect1.x*vect2.x + vect1.y*vect2.y;
	return Math.acos(dotProduct/(mag1*mag2));
}