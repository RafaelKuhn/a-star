(() => {


/** @return {Number} */
const clamp = (x, min, max) => Math.max(min, Math.min(x, max));

/** @return {Number} */
const lerp = (a, b, t) => (1 - t) * a + t * b;

/** @return {Number} */
const inverseLerp = (a, b, v) => (v - a) / (b - a);

/** @return {Number} */
const dot = (x0, y0, x1, y1) => x0 * x1 + y0 * y1;

/** @param {Number} p0x @param {Number} p1x  @param {Number} p1x  @param {Number} p1y */
const distanceSq = (p0x, p0y, p1x, p1y) => {
	const pointsVecX = p1x - p0x;
	const pointsVecY = p1y - p0y;
	return pointsVecX * pointsVecX + pointsVecY * pointsVecY;
}





// DISTANCE



const subtract = (vec, x, y) => {
	vec.x -= x;
	vec.y -= y;
}

const scale = (vec, scale) => {
	vec.x *= scale;
	vec.y *= scale;
}

const rotate90DegCounterclockwise = vec => {
	const temp = vec.x;
	vec.x = -vec.y
	vec.y =  temp;
}

const rotate90DegClockwise = vec => {
	const temp = vec.x;
	vec.x =  vec.y
	vec.y = -temp;
}

const rotate180 = vec => {
	vec.x = -vec.x;
	vec.y = -vec.y;
}

// TODO: fast approximate normalize for 2D
const normalize = vec => {
	const len = magnitudeOf(vec);
	vec.x /= len;
	vec.y /= len;
}

const magnitudeOf = vec => Math.sqrt(vec.x * vec.x + vec.y * vec.y);

const isApprox = (v, dest) => isApproxThreshold(v, dest, 0.005);
const isApproxThreshold = (v, dest, threshold) => Math.abs(v - dest) < threshold;

})()