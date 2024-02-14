(function() {

//  ########################################################################
//  ################################ HTML ##################################
//  ########################################################################

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvao");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

canvas.height = document.body.clientHeight - 16;
canvas.width  = canvas.height;

const canvasRect = canvas.getBoundingClientRect();

// constants
const TAU = 6.28318530;
const NAN = + +'javascript é uma merda kkkkkk';
const nbsp = "\xa0";

const img = new Image();
img.src = "Untitled.png"


//  #######################################################################
//  ############################### Maths #################################
//  #######################################################################

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

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
const distance = (point0, point1) => {
	const pointsVecX = point1.x - point0.x;
	const pointsVecY = point1.y - point0.y;
	return Math.sqrt(pointsVecX * pointsVecX + pointsVecY * pointsVecY);
}

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


//  ########################################################################
//  ############################## Graphics ################################
//  ########################################################################

// TODO: delete
const gameData = {
}

/** @param {MouseEvent} event */
const mouseMove = (event) => {
}

/** @type {Array.<{ x: Number, y: Number, cons: Array.<> }>} */
const nodes = [
	{ x: 250, y: 190, cons: [], },
	{ x: 350, y: 190, cons: [], },

	{ x: 430, y: 190, cons: [], },
	{ x: 430, y: 270, cons: [], },
	{ x: 530, y: 270, cons: [], },
	{ x: 530, y: 370, cons: [], },
	{ x: 630, y: 370, cons: [], },
	{ x: 630, y: 190, cons: [], },
	{ x: 530, y: 190, cons: [], },

	{ x: 350, y: 270, cons: [], },
	{ x: 250, y: 270, cons: [], },
	{ x: 250, y: 370, cons: [], },
	{ x: 430, y: 370, cons: [], },
	{ x: 430, y: 470, cons: [], },
	{ x: 630, y: 470, cons: [], },
	{ x: 630, y: 570, cons: [], },
	{ x: 350, y: 570, cons: [], },
	{ x: 350, y: 470, cons: [], },
	{ x: 250, y: 470, cons: [], },
	{ x: 250, y: 570, cons: [], },
]

/** @type {Array.<{ a: { x: Number, y: Number }, b: { x: Number, y: Number }, dist: Number }>} */
const cons = [
]

const charCodeOfA = "A".charCodeAt(0);
for (let nodeI = 0; nodeI < nodes.length; ++nodeI) {
	const node = nodes[nodeI];
	node.i = nodeI;
	node.letter = `${String.fromCharCode(charCodeOfA + nodeI)} ${nodeI}`
	// char += 1;
}


/**
 * @param {{ x: Number, y: Number }} bInd
 * @param {{ x: Number, y: Number }} aInd
 */
const buildCon = (aInd, bInd) => {
	const a = nodes[aInd];
	const b = nodes[bInd];
	const con = { a, b };
	con.dist = distance(a, b);

	// const conInd = cons.length;
	// a.cons.push(conInd);
	// b.cons.push(conInd);

	cons.push(con);
	// console.log(con);

	const conB = { dest: b, dist: con.dist }
	const conA = { dest: a, dist: con.dist }

	a.cons.push(conB);
	b.cons.push(conA);
}

buildCon(0, 1);
buildCon(1, 2);
buildCon(2, 3);
buildCon(3, 4);
buildCon(4, 5);
buildCon(5, 6);
buildCon(6, 7);
buildCon(7, 8);

buildCon(1, 9);
buildCon(9, 10);
buildCon(10, 11);
buildCon(11, 12);
buildCon(12, 13);
buildCon(13, 14);
buildCon(14, 15);
buildCon(15, 16);
buildCon(16, 17);
buildCon(17, 18);
buildCon(18, 19);

let origin = nodes[0];
let destin = nodes[14];

// precalculates heuristics
for (const node of nodes) {
	const dist = distance(node, destin)
	node.dist = dist;
}




let log = "";
for (let i = 0; i < nodes.length; ++i) {
	const node = nodes[i];
	log += `${node.i}\n`
	for (const con of node.cons) {
		log += `  -> ${con.dest.i}\n`
	}
	log += `\n`
}
console.log(log);



let lateDraw = () => {}

setTimeout(() => {
	// console.log("timeout");

	// let cur = origin;
	// let queue = []
	// queue.push(origin);

	lateDraw = () => {

		const visited = new Array(nodes.length).fill(0);
		// console.log(visited);

		let cur = origin;
		let queue = []
		// queue.push(origin);

		let next = cur.cons[0].dest;

		ctx.fillStyle = "black"
		fillCircleIn(next.x, next.y, 5);

		next = next.cons[0].dest
		ctx.fillStyle = "black"
		fillCircleIn(next.x, next.y, 5);

		// console.log(next.cons);
		ctx.fillStyle = "black"
		fillCircleIn(next.x, next.y, 5);


		for (const cInd of origin.cons) {




			// const con = cons[cInd];
			// console.log(con);
			// console.log(`${JSON.stringify(con)}`);
		}
	}

// }, 500);
}, 500);



const render = () => {
	// console.log(` render`);
	// console.trace();

	// reset
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);

	// ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, img.width * 1.2, img.height * 1.2) //, canvas.width, canvas.height);


	// render cons
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red"
	for (let i = 0; i < cons.length; ++i) {
		const con = cons[i];
		// console.log(`drawing ${con.a.x} ${con.a.y} ${con.b.x} ${con.b.y}`);
		drawLineBetween(con.a.x, con.a.y, con.b.x, con.b.y);

		const medx = Math.abs(con.a.x + con.b.x) * 0.5
		const medy = Math.abs(con.a.y + con.b.y) * 0.5

		ctx.fillStyle = "lime"
		ctx.fillText(`${con.dist}`, medx, medy)
	}


	// render nodes
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];

		// console.log(`drawing ${node.x}`);
		ctx.fillStyle = "lime"
		fillCircleIn(node.x, node.y, 7);

		ctx.fillStyle = "yellow"
		// TODO: recalculate from I
		const letterW = ctx.measureText(`${node.i}`).width
		ctx.fillText(node.i, node.x - letterW * 0.5, node.y - 12);
	
		ctx.fillStyle = "cyan"
		const distTxt = `${node.dist.toFixed(0)}`;
		const w = ctx.measureText(distTxt).width;
		ctx.fillText(distTxt, node.x - w * 0.5, node.y + 15);
	}

	ctx.fillStyle = "fuchsia"
	fillCircleIn(origin.x, origin.y, 7);
	ctx.fillStyle = "cyan"
	fillCircleIn(destin.x, destin.y, 7);


	lateDraw()

	// return;
	window.requestAnimationFrame(render);
	// ctx.setLineDash([5, 7]);
}


// TODO: delete
const clearHtmlCursor = () => {
	document.body.style.cursor = 'default';
}
const setHtmlCursorToPointer = () => {
	document.body.style.cursor = 'pointer';
}

const drawBezier = (startLocal, cp1, cp2, end) => {
	ctx.beginPath();
	ctx.moveTo(startLocal.x, startLocal.y);
	ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
	ctx.stroke();
}

const drawCircleIn = (x, y, size) => {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, TAU);
	ctx.stroke();
}

const fillCircleIn = (x, y, size) => {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, TAU);
	ctx.fill();
}

const drawLineBetween = (x0, y0, x1, y1) => {
	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}



//  ########################################################################
//  ############################# BOOTSTRAP ################################
//  ########################################################################

// TODO: delete
// window.addEventListener("mousedown", onMouseDown);
// window.addEventListener("mouseup",   onMouseUp);
// window.addEventListener("mousemove", mouseMove);

img.onload = evt => {
	// console.log(evt);
	// console.log(`loaded`);
	// render()
	requestAnimationFrame(render);
}

const formatVec = vec => formatXY(vec.x, vec.y);
const formatXY  = (x, y) => `(${x.toFixed(2)},${y.toFixed(2)})`

const formatXYAsCoords = (x, y, digits) => {
	const newX = pxToCoord(x);
	const newY = pxToCoord(canvas.width - y);
	return `(X: ${newX.toFixed(digits)}, Y: ${newY.toFixed(digits)})`
}


})()