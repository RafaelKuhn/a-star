(() => {

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

/**
 * @param {{ x: Number, y: Number }} point0 
 * @param {{ x: Number, y: Number }} point1 
 */
const distance = (point0, point1) => {
	const pointsVecX = point1.x - point0.x;
	const pointsVecY = point1.y - point0.y;
	return Math.sqrt(pointsVecX * pointsVecX + pointsVecY * pointsVecY);
}

const infinity = 9_999_999;


//  ########################################################################
//  ############################## Graphics ################################
//  ########################################################################


/** @type {Array.<{ x: Number, y: Number, cons: Array.<> }>} */
const nodes = [
]

const addNode = (x, y) => {
	nodes.push({ x, y, ind: nodes.length, cons: [], fscore: infinity, heuristic: 0 })
}

// HERE!
// addNode(250, 190);
// addNode(350, 190);

// addNode(430, 190);
// addNode(430, 270);
// addNode(530, 270);
// addNode(530, 370);
// addNode(630, 370);
// addNode(630, 190);
// addNode(530, 190);

// addNode(350, 270);
// addNode(250, 270);
// addNode(250, 370);
// addNode(430, 370);
// addNode(430, 470);
// addNode(630, 470);
// addNode(630, 570);
// addNode(350, 570);
// addNode(350, 470);
// addNode(250, 470);
// addNode(250, 570);



/** @type {Array.<{ a: { x: Number, y: Number }, b: { x: Number, y: Number }, dist: Number }>} */
const cons = [
]


// TODO: REMOVE AUTO
const wid = 7
const hei = 7

const pad = 100;

for (let y = 0; y < hei; ++y) {
	for (let x = 0; x < wid; ++x) {
		addNode(50 + x * pad, 50 + y * pad);
	}
}



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

// HERE!
// buildCon(0, 1);
// buildCon(1, 2);
// buildCon(2, 3);
// buildCon(3, 4);
// buildCon(4, 5);
// buildCon(5, 6);
// buildCon(6, 7);
// buildCon(7, 8);

// buildCon(1, 9);
// buildCon(9, 10);
// buildCon(10, 11);
// buildCon(11, 12);
// buildCon(12, 13);
// buildCon(13, 14);
// buildCon(14, 15);
// buildCon(15, 16);
// buildCon(16, 17);
// buildCon(17, 18);
// buildCon(18, 19);

// TODO: REMOVE AUTO
for (let y = 0; y < hei; ++y) {
	for (let x = 0; x < wid - 1; ++x) {
		const lin0 = y * wid + x
		const lin1 = y * wid + x + 1
		buildCon(lin0, lin1)
	}
}

for (let y = 0; y < hei - 1; ++y) {
	for (let x = 0; x < wid; ++x) {
		const lin0 = y * wid + x
		const lin1 = (y + 1) * wid + x
		buildCon(lin0, lin1)
	}
}

// TODO: Implement
const undoCon = (ai, bi) => {
	const a = nodes[ai];
	const b = nodes[bi];
	
}




let origin = nodes[0];
// HERE!
// let destin = nodes[13];
let destin = nodes[46];
// let destin = nodes[14];

// precalculates heuristics
for (const node of nodes) {
	const dist = distance(node, destin)
	node.heuristic = dist;
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
// console.log(log);


const sleep = ms => new Promise(r => setTimeout(r, ms));


let pathSoFar = []
let pathCol = "blue"
const openSet = [];

setTimeout(async () => {
	
	render();

	// await sleep(500);
	await sleep(100);


	// const fScores = new Array(nodes.length).fill(infinity);
	const gScores = new Array(nodes.length).fill(infinity);
	gScores[origin.ind] = 0;

	origin.fscore = 0;

	openSet.push(origin);
	// return;

	while (openSet.length > 0) {

		let minScoreInd = 0;
		let minScore = openSet[minScoreInd].fscore;
		for (let i = 1; i < openSet.length; ++i) {
			const openNode = openSet[i];
			if (openNode.fscore < minScore) {
				minScoreInd = i;
				minScore = openNode.fscore;
			}
		}


		const minScoreNode = openSet[minScoreInd];
		console.log(` min score so far is ${minScore}, node is ${minScoreNode.ind}`);

		if (minScoreNode === destin) {
			pathCol = "cyan";
			console.log(`UHU FOUND DESTIN`);
			pathSoFar.unshift(destin);
			return;
		}

		// TODO: bad, will return an []
		openSet.splice(minScoreInd, 1);

		// ctx.fillStyle = "black"
		// fillCircleIn(minScoreNode.x, minScoreNode.y, 5);

		for (let i = 0; i < minScoreNode.cons.length; i++) {
			const con = minScoreNode.cons[i];
			const connectedNode = con.dest;

			const tentativeGScore = gScores[minScoreNode.ind] + con.dist;
			// console.log(`tentative ${gScores[minScoreNode.ind].toFixed(2)} + ${con.dist.toFixed(2)} = ${tentativeGScore}`);
			
			// ctx.fillStyle = "black"
			// fillCircleIn(dest.x, dest.y, 5);
			
			console.log(`tentative ${tentativeGScore} < ${gScores[connectedNode.ind]} ? ${tentativeGScore < gScores[connectedNode.ind]}`);
			if (tentativeGScore < gScores[connectedNode.ind]) {

				gScores[connectedNode.ind] = tentativeGScore;
				connectedNode.fscore = tentativeGScore + connectedNode.heuristic;
				connectedNode.cameFrom = minScoreNode;

				if (!openSet.includes(connectedNode)) openSet.push(connectedNode);

				pathSoFar.length = 0;
				let last = connectedNode.cameFrom;
				let cur  = connectedNode;
				// pathSoFar.push(cur);

				while (last) {
					ctx.lineWidth = 5
					drawLineBetween(cur.x, cur.y, last.x, last.y)

					pathSoFar.push(last);
					cur  = last
					last = last.cameFrom
				}

				await sleep(200);

				// ctx.fillStyle = "white"
				// fillCircleIn(minScoreNode.x, minScoreNode.y, 5);
			}

			// ctx.fillStyle = "white"
			// fillCircleIn(minScoreNode.x, minScoreNode.y, 5);

		}
	}


	// let next = origin.cons[0].dest;

	// ctx.fillStyle = "black"
	// fillCircleIn(next.x, next.y, 5);

	// next = next.cons[0].dest
	// ctx.fillStyle = "black"
	// fillCircleIn(next.x, next.y, 5);

	// // console.log(next.cons);
	// ctx.fillStyle = "black"
	// fillCircleIn(next.x, next.y, 5);

}, 0);





const render = () => {
	// console.log(` render`);
	// console.trace();

	// reset
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);

	// ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	// ctx.drawImage(img, 0, 0, img.width * 1.2, img.height * 1.2) //, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0, img.width * 1.3, img.height * 1.3) //, canvas.width, canvas.height);


	// render cons
	ctx.lineWidth = 3;
	ctx.strokeStyle = "red"
	for (let i = 0; i < cons.length; ++i) {
		const con = cons[i];
		// console.log(`drawing ${con.a.x} ${con.a.y} ${con.b.x} ${con.b.y}`);
		drawLineBetween(con.a.x, con.a.y, con.b.x, con.b.y);

		const medx = Math.abs(con.a.x + con.b.x) * 0.5
		const medy = Math.abs(con.a.y + con.b.y) * 0.5

		ctx.fillStyle = "white"
		ctx.font = "15px sans-serif"
		ctx.fillText(`${con.dist}`, medx, medy)
	}


	// render nodes
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];

		// console.log(`drawing ${node.x}`);
		ctx.fillStyle = "white"
		fillCircleIn(node.x, node.y, 7);

		ctx.fillStyle = "yellow"
		// TODO: recalculate from I
		const letterW = ctx.measureText(`${node.i}`).width
		ctx.fillText(node.i, node.x - letterW * 0.5, node.y - 12);
	
		ctx.fillStyle = "cyan"
		const distTxt = `${node.heuristic.toFixed(0)}`;
		const w = ctx.measureText(distTxt).width;
		ctx.fillText(distTxt, node.x - w * 0.5, node.y + 20);
	}

	ctx.fillStyle = "fuchsia"
	fillCircleIn(origin.x, origin.y, 7);
	ctx.fillStyle = "cyan"
	fillCircleIn(destin.x, destin.y, 14);
	ctx.fillStyle = "black"
	fillCircleIn(destin.x, destin.y, 7);




	// lateDraw()
	console.log(`pathSoFar ${pathSoFar.length}`);
	if (pathSoFar.length > 0) {
		ctx.beginPath();
		const startNode = pathSoFar[0];
		ctx.moveTo(startNode.x, startNode.y)
		for (let i = 1; i < pathSoFar.length; ++i) {
			const next = pathSoFar[i];
			ctx.lineTo(next.x, next.y)
		}

		ctx.lineWidth = 15;
		ctx.strokeStyle = pathCol;
		ctx.stroke();
	}


	for (const node of openSet) {
		ctx.fillStyle = "lime"
		fillCircleIn(node.x, node.y, 15)
	}

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

	// requestAnimationFrame(render);
	
	// render();
}

const formatVec = vec => formatXY(vec.x, vec.y);
const formatXY  = (x, y) => `(${x.toFixed(2)},${y.toFixed(2)})`

const formatXYAsCoords = (x, y, digits) => {
	const newX = pxToCoord(x);
	const newY = pxToCoord(canvas.width - y);
	return `(X: ${newX.toFixed(digits)}, Y: ${newY.toFixed(digits)})`
}


})()