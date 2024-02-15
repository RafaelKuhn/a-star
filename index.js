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

// for mode 1
canvas.width *= 1.22;

const canvasRect = canvas.getBoundingClientRect();

// constants
const TAU = 6.28318530;
const NAN = + +'javascript é uma merda kkkkkk';
const nbsp = "\xa0";


const modeFunctionsByMode = new Map();
const mode1 = () => {
	global.currentMode = modes.m1;

	addNode(250, 190);
	addNode(350, 190);

	addNode(430, 190);
	addNode(430, 270);
	addNode(530, 270);
	addNode(530, 370);
	addNode(630, 370);
	addNode(630, 190);
	addNode(530, 190);

	addNode(350, 270);
	addNode(250, 270);
	addNode(250, 370);
	addNode(430, 370);
	addNode(430, 470);
	addNode(630, 470);
	addNode(630, 570);
	addNode(350, 570);
	addNode(350, 470);
	addNode(250, 470);
	addNode(250, 570);

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

	global.origin = nodes[0];
	global.destin = nodes[nodes.length - 4];

	reassignNodeIndices();
	precalculateNodeHeuristics();

	global.animationDelayMs = 500;
}

const mode2 = () => {
	mode1();
	global.currentMode = modes.m1;

	undoNode(15);
	reassignNodeIndices();
	precalculateNodeHeuristics();
}

const mode3 = () => {
	global.currentMode = modes.m2;

	for (let y = 0; y < mode2hei; ++y) {
		for (let x = 0; x < mode2wid; ++x) {
			addNode(50 + x * mode2pad, 50 + y * mode2pad * 1.35);
		}
	}

	// TODO: AUTO MODE
	for (let y = 0; y < mode2hei; ++y) {
		for (let x = 0; x < mode2wid - 1; ++x) {
			const lin0 = y * mode2wid + x
			const lin1 = y * mode2wid + x + 1
			buildCon(lin0, lin1)
		}
	}
	
	for (let y = 0; y < mode2hei - 1; ++y) {
		for (let x = 0; x < mode2wid; ++x) {
			const lin0 = y * mode2wid + x
			const lin1 = (y + 1) * mode2wid + x
			buildCon(lin0, lin1)
		}
	}

	global.origin = nodes[0];
	global.destin = nodes[nodes.length - 4];

	reassignNodeIndices();
	precalculateNodeHeuristics();

	global.animationDelayMs = 10;
}

const mode4 = () => {
	global.currentMode = modes.m2;

	const gambiarra = [];

	for (let y = 0; y < mode2hei; ++y) {
		for (let x = 0; x < mode2wid; ++x) {

			if (x == 2 && y < mode2hei - 3) continue;
			if (x == 10 && y > 2) continue;
			if (x == 14 && y < mode2hei - 3) continue;

			addNode(50 + x * mode2pad, 50 + y * mode2pad * 1.35);
		}
	}


	// TODO: AUTO MODE
	for (let i = 0; i < nodes.length - 1; ++i) {
	
		const node0 = nodes[i];
		const node1 = nodes[i + 1];

		if (isApprox(node0.y, node1.y)) {
			if (Math.abs(node0.x - node1.x) > mode2pad) continue;

			buildCon(i, i + 1);
		}	
	}

	// GAMBIARRASSO (CRUZES)
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];
		const x = (node.x - 50) / mode2pad;
		if (!gambiarra[x]) gambiarra[x] = []
		gambiarra[x].push(i);
	}
	for (const gambi of gambiarra) {

		for (let i = 0; i < gambi.length - 1; ++i) {
			const superGambi0 = gambi[i];
			const superGambi1 = gambi[i + 1];
			buildCon(superGambi0, superGambi1);
		}

	}

	global.origin = nodes[0];
	global.destin = nodes[nodes.length - 4];

	reassignNodeIndices();
	precalculateNodeHeuristics();

	global.animationDelayMs = 20;
}

modeFunctionsByMode.set("mode1", mode1)
modeFunctionsByMode.set("mode2", mode2)
modeFunctionsByMode.set("mode3", mode3)
modeFunctionsByMode.set("mode4", mode4)

const onChangeMode = mode => {
	const switchMode = modeFunctionsByMode.get(mode);
	if (!switchMode) throw new Error(`Invalid mode: ${mode}`)

	stopPlaying();

	clearNodesAndCons();
	switchMode();
}



const states = {
	ready: 0,
	playing: 1,
	paused: 2,
}

/** @type {Number} */
let state = states.ready;

const onPlayButtonClick = () => {

	if (state === states.playing) {
		pausePlaying();
		return;
	}

	if (state === states.paused) {
		resumePlaying();
		return;
	}

	if (state === states.ready) {
		startPlaying();
		return;
	}

	throw new Error(`Invalid state: ${state}`)
}

const startPlaying = () => {
	state = states.playing;
	setPlayButtonToPause()
	runAStarAsync();
	showStopBtn();
}

const pausePlaying = () => {
	state = states.paused;
	clearTimeout(globalTimeoutHandle);
	setPlayButtonToResume();
}

const resumePlaying = () => {
	state = states.playing;
	resumeAStar();
	setPlayButtonToPause();
}


const stopPlaying = () => {
	state = states.ready;
	clearTimeout(globalTimeoutHandle);

	// resets data that we use to draw (could be in an object)
	openSet.length = 0;
	pathSoFar.length = 0;
	setAsReady();
}

const hideStopBtn = () => stopButton.classList.add("hidden");
const showStopBtn = () => stopButton.classList.remove("hidden");

const setAsReady = () => {
	state = states.ready;
	hideStopBtn();
	setPlayButtonToPlay();
}

const setPlayButtonToPause = () => {
	playButton.value = "Pause"
}

const setPlayButtonToResume = () => {
	playButton.value = "Resume"
}

const setPlayButtonToPlay = () => {
	playButton.value = "Play"
}



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

const isApprox = (v, dest) => isApproxThreshold(v, dest, 0.005);
const isApproxThreshold = (v, dest, threshold) => Math.abs(v - dest) < threshold;

const infinity = 9_999_999;


//  ########################################################################
//  ############################## Graphics ################################
//  ########################################################################

/** @type {Array.<{ x: Number, y: Number, cons: Array.<> }>} */
const nodes = [
]

const clearNodesAndCons = () => {
	nodes.length = 0;
	globalCons.length = 0;
}

const addNode = (x, y) => {
	nodes.push({ x, y, ind: nodes.length, cons: [], fscore: infinity, heuristic: 0 })
}



// CONFIG
const circleSize = 7;
const lineWidth = 2;
const textSize = 18;

const lineColor = "black"
const circleColor = "black";
const labelColor = "darkyellow";

const acceptColor = "blue";
const failColor = "red";
const destinColor = "blue";

const nodesColor = "lime";

const indicesColor = "black";


// unique for mode 2
const mode2wid = 26;
const mode2hei = 16;
const mode2pad = 40;


/** @type {Array.<{ a: { x: Number, y: Number }, b: { x: Number, y: Number }, dist: Number }>} */
const globalCons = [
]


/**
 * @param {{ x: Number, y: Number }} bInd
 * @param {{ x: Number, y: Number }} aInd
 */
const buildCon = (aInd, bInd) => {
	const a = nodes[aInd];
	const b = nodes[bInd];
	const con = { a, b };
	con.dist = distance(a, b);

	globalCons.push(con);

	const conB = { dest: b, dist: con.dist }
	const conA = { dest: a, dist: con.dist }

	a.cons.push(conB);
	b.cons.push(conA);
}



const undoNode = (nodei) => {
	nodes.splice(nodei, 1);

	// REMOVE FROM CONS
	for (let i = globalCons.length - 1; i >= 0; --i) {
		const con = globalCons[i];
		if (con.a.ind === nodei || con.b.ind === nodei) {
			globalCons.splice(i, 1);
		}
	}

	// REMOVE FROM OTHER NODES
	for (let i = nodes.length - 1; i >= 0; --i) {
		const node = nodes[i];

		for (let j = node.cons.length - 1; j >= 0; --j) {
			const con = node.cons[j];
			if (con.dest.ind === nodei) {
				node.cons.splice(j, 1);
			}
		}

	}

	reassignNodeIndices();
}

const precalculateNodeHeuristics = () => {
	for (const node of nodes) {
		const dist = distance(node, global.destin)
		node.heuristic = dist;
	}
}

const reassignNodeIndices = () => {
	for (let i = 0; i < nodes.length; ++i) {
		nodes[i].ind = i;
	}
}



// GAMBIARRA!
const modes = {
	m1: 1,
	m2: 2,
	m3: 3,
}

const global = {
	origin: nodes[0],
	destin: nodes[nodes.length - 3],
	animationDelayMs: 20,
	currentMode: modes.m1,
}



// DEBUG!
let log = "";
for (let i = 0; i < nodes.length; ++i) {
	const node = nodes[i];
	log += `${node.ind}\n`
	for (const con of node.cons) {
		log += `  -> ${con.dest.i}\n`
	}
	log += `\n`
}
// console.log(log);


let globalTimeoutHandle;
const sleep = ms => new Promise(r => {
	globalTimeoutHandle = setTimeout(r, ms);
});

let pathSoFar = []
let pathCol = acceptColor;

const findMinScoreInOpenSet = () => {
	let minScoreInd = 0;
	let minScore = openSet[minScoreInd].fscore;
	for (let i = 1; i < openSet.length; ++i) {
		const openNode = openSet[i];
		if (openNode.fscore < minScore) {
			minScoreInd = i;
			minScore = openNode.fscore;
		}
	}

	return minScoreInd;
}


const openSet = [];
const gScores = new Array(nodes.length).fill(infinity);

const runAStarAsync = async () => {

	state = states.playing;
	await sleep(100);

	gScores.length = nodes.length;
	for (let i = 0; i < gScores.length; ++i) gScores[i] = infinity;
	gScores[global.origin.ind] = 0;

	for (let i = 0; i < nodes.length; ++i) nodes[i].fscore = infinity;
	global.origin.fscore = 0;

	openSet.length = 0;
	openSet.push(global.origin);

	await resumeAStar(gScores);
}

const resumeAStar = async () => {

	pathCol = acceptColor;
	let failNode;
	while (openSet.length > 0) {

		const minScoreInd = findMinScoreInOpenSet();
		const minScoreNode = openSet[minScoreInd];
		failNode = minScoreNode;

		const hasFoundDestination = minScoreNode === global.destin;
		if (hasFoundDestination) {
			pathCol = acceptColor;
			pathSoFar.unshift(global.destin);
		
			setAsReady();
			return;
		}

		openSet.splice(minScoreInd, 1);

		let willSleep = false;
		for (let i = 0; i < minScoreNode.cons.length; i++) {
			const con = minScoreNode.cons[i];
			const connectedNode = con.dest;

			const tentativeGScore = gScores[minScoreNode.ind] + con.dist;
			
			// console.log(`tentative ${tentativeGScore} < ${gScores[connectedNode.ind]} ? ${tentativeGScore < gScores[connectedNode.ind]}`);
			if (tentativeGScore < gScores[connectedNode.ind]) {

				gScores[connectedNode.ind] = tentativeGScore;
				connectedNode.fscore = tentativeGScore + connectedNode.heuristic;
				connectedNode.cameFrom = minScoreNode;

				if (!openSet.includes(connectedNode)) openSet.push(connectedNode);

				pathSoFar.length = 0;
				let last = connectedNode.cameFrom;
				let cur  = connectedNode;

				while (last) {
					ctx.lineWidth = lineWidth;
					drawLineBetween(cur.x, cur.y, last.x, last.y)

					pathSoFar.push(last);
					cur  = last
					last = last.cameFrom
				}

				willSleep = true;
			}
		}

		if (willSleep) await sleep(global.animationDelayMs);
	}

	pathCol = failColor;
	pathSoFar.unshift(failNode);	
	setAsReady();
}



const render = () => {

	// reset
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);


	// RENDER CONNECTIONS
	ctx.lineWidth = 3;
	ctx.strokeStyle = lineColor
	for (let i = 0; i < globalCons.length; ++i) {
		const con = globalCons[i];

		ctx.strokeStyle = "#ff000050"
		ctx.lineWidth = lineWidth;
		drawLineBetween(con.a.x, con.a.y, con.b.x, con.b.y);
	}


	// render nodes
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];

		ctx.fillStyle = circleColor;
		fillCircleIn(node.x, node.y, circleSize);	
	}
	

	// draws PATH
	ctx.fillStyle = acceptColor
	fillCircleIn(global.origin.x, global.origin.y, circleSize);
	ctx.fillStyle = acceptColor
	fillCircleIn(global.destin.x, global.destin.y, circleSize);
	ctx.fillStyle = destinColor
	fillCircleIn(global.destin.x, global.destin.y, circleSize * 2);


	if (pathSoFar.length > 0) {
		ctx.beginPath();
		const startNode = pathSoFar[0];
		ctx.moveTo(startNode.x, startNode.y)
		for (let i = 1; i < pathSoFar.length; ++i) {
			const next = pathSoFar[i];
			ctx.lineTo(next.x, next.y)
		}

		ctx.lineWidth = 6;
		ctx.strokeStyle = pathCol;
		ctx.stroke();
	}

	for (const node of openSet) {
		ctx.fillStyle = nodesColor
		fillCircleIn(node.x, node.y, circleSize * 1.3)
	}


	const drawIndicesFn = node => {
		ctx.fillStyle = indicesColor
		const letterMeasure = ctx.measureText(`${node.ind}`)
		const letterW = letterMeasure.width
		const letterH = letterMeasure.actualBoundingBoxAscent + letterMeasure.actualBoundingBoxDescent
		ctx.font = `${textSize.toFixed(0)}px sans-serif`
		ctx.fillStyle = labelColor;
		ctx.fillText(node.ind, node.x - letterW * 0.5, node.y - letterH * 0.5 - 1);
	}

	const drawHeuristicsFn = node => {
		ctx.fillStyle = acceptColor
		const distTxt = `${node.heuristic.toFixed(0)}`;
		const w = ctx.measureText(distTxt).width;
		ctx.fillText(distTxt, node.x - w * 0.5, node.y + 20);
	}


	const drawFns = []

	// const drawIndices = global.currentMode !== modes.m2;
	const drawIndices = true;
	if (drawIndices) drawFns.push(drawIndicesFn)

	const drawHeuristics = global.currentMode === modes.m1;
	if (drawHeuristics) drawFns.push(drawHeuristicsFn)

	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];
		for (const draw of drawFns) draw(node);
	}

	const drawLocalHeuristics = global.currentMode === modes.m1;
	const drawLocalHeuristicsFn = drawLocalHeuristics ? con => {
		ctx.fillStyle = "green"
		ctx.font = `${textSize.toFixed(0)}px sans-serif`
		ctx.fillText(`${con.dist.toFixed(0)}`, Math.abs(con.a.x + con.b.x) * 0.5, Math.abs(con.a.y + con.b.y) * 0.5)
	} : () => {}

	for (let i = 0; i < globalCons.length; ++i) {
		const con = globalCons[i];
		drawLocalHeuristicsFn(con)
	}
	
	
	// return;

	// return;
	window.requestAnimationFrame(render);
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

const formatVec = vec => formatXY(vec.x, vec.y);
const formatXY  = (x, y) => `(${x.toFixed(2)},${y.toFixed(2)})`

const formatXYAsCoords = (x, y, digits) => {
	const newX = pxToCoord(x);
	const newY = pxToCoord(canvas.width - y);
	return `(X: ${newX.toFixed(digits)}, Y: ${newY.toFixed(digits)})`
}



// TODO: delete
// window.addEventListener("mousedown", onMouseDown);
// window.addEventListener("mouseup",   onMouseUp);
// window.addEventListener("mousemove", mouseMove);

// const img = new Image();
// img.src = "ijui.png"
// img.src = "image.png"
// img.onload = evt => {
// 	canvas.width = img.width;
// }


/** @type {HTMLSelectElement} */
const select = document.getElementById("modos");
select.onchange = () => onChangeMode(select.value);

/** @type {HTMLInputElement} */
const playButton = document.getElementById("play");
playButton.onclick = onPlayButtonClick;

/** @type {HTMLInputElement} */
const stopButton = document.getElementById("stop");
stopButton.onclick = stopPlaying;


select.value = "mode1";
select.onchange()


window.requestAnimationFrame(render);


})()