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
canvas.width *= 1.23;

const canvasRect = canvas.getBoundingClientRect();

// constants
const TAU = 6.28318530;
const NAN = + +'javascript é uma merda kkkkkk';
const nbsp = "\xa0";


const modeFunctionsByMode = new Map();
const mode1 = () => {
	console.log(`switching to layout 1`);
}

const mode2 = () => {
	console.log(`switching to layout 2`);
}

const mode3 = () => {
	console.log(`switching to layout 3`);
}

modeFunctionsByMode.set("mode1", mode1)
modeFunctionsByMode.set("mode2", mode2)
modeFunctionsByMode.set("mode3", mode3)

const onChangeMode = mode => {
	const switchMode = modeFunctionsByMode.get(mode);
	if (!switchMode) throw new Error(`Invalid mode: ${mode}`)

	stopPlaying();
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
	showStop();
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

	// resets data
	openSet.length = 0;
	pathSoFar.length = 0;
	setAsReady();
}

const hideStop = () => stopButton.classList.add("hidden");
const showStop = () => stopButton.classList.remove("hidden");


const setAsReady = () => {
	state = states.ready;
	hideStop();
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

const intersections = [
  { x: 50, y: 50 },
  { x: 150, y: 50 },
  { x: 250, y: 50 },
  { x: 350, y: 50 },
  { x: 450, y: 50 },
  { x: 50, y: 150 },
  { x: 150, y: 150 },
  { x: 250, y: 150 },
  { x: 350, y: 150 },
  { x: 450, y: 150 },
  { x: 50, y: 250 },
  { x: 150, y: 250 },
  { x: 250, y: 250 },
  { x: 350, y: 250 },
  { x: 450, y: 250 },
  { x: 50, y: 350 },
  { x: 150, y: 350 },
  { x: 250, y: 350 },
  { x: 350, y: 350 },
  { x: 450, y: 350 },
  { x: 50, y: 450 },
  { x: 150, y: 450 },
  { x: 250, y: 450 },
  { x: 350, y: 450 },
  { x: 450, y: 450 },
];


// CONFIG
const circleSize = 7;
const lineWidth = 2;
const textSize = 18;

const lineColor = "black"
const circleColor = "black";
const labelColor = "darkyellow";

const acceptColor = "magenta";
const nodesColor = "lime";
const destinColor = "magenta";
const indicesColor = "black";


// DEZ SEGUNDOS, DIMINUI PRA VER A ANIMAÇAO
// const animationDelay = 10_000;
const animationDelay = 20;


// unique for mode 2
const wid = 26
const hei = 16
const pad = 40;

const mode = 2;
const drawIndices = mode != 0;


if (mode === 0) {

	for (let i = 0; i < intersections.length; ++i) {
	// for (let i = 3000; i < 3500; ++i) {
		const intersection = intersections[i];
		// if (intersection.x % 10 === 0) continue;

		// addNode(intersection.x - 45, intersection.y + 10);
		addNode(intersection.x - 4, intersection.y - 4);
	}

} else if (mode === 1) {

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
} else if (mode === 2) {

	for (let y = 0; y < hei; ++y) {
		for (let x = 0; x < wid; ++x) {
			addNode(50 + x * pad, 50 + y * pad);
		}
	}

}




/** @type {Array.<{ a: { x: Number, y: Number }, b: { x: Number, y: Number }, dist: Number }>} */
const cons = [
]


// DEBUG AUTOMATIC NODES
// const wid = 7
// const hei = 7
// const pad = 100;
// for (let y = 0; y < hei; ++y) {
// 	for (let x = 0; x < wid; ++x) {
// 		addNode(50 + x * pad, 50 + y * pad);
// 	}
// }



// const charCodeOfA = "A".charCodeAt(0);
for (let nodeI = 0; nodeI < nodes.length; ++nodeI) {
	const node = nodes[nodeI];
	node.ind = nodeI;
	// node.letter = `${String.fromCharCode(charCodeOfA + nodeI)} ${nodeI}`
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

	cons.push(con);

	const conB = { dest: b, dist: con.dist }
	const conA = { dest: a, dist: con.dist }

	a.cons.push(conB);
	b.cons.push(conA);
}

if (mode === 1) {
	
	// AQUI XIMIA
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

} else if (mode === 2) {

	// TODO: AUTO MODE
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
}


const undoNode = (nodei) => {
	nodes.splice(nodei, 1);

	// REMOVE FROM CONS
	for (let i = cons.length - 1; i >= 0; --i) {
		const con = cons[i];
		if (con.a.ind === nodei || con.b.ind === nodei) {
			cons.splice(i, 1);
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

const reassignNodeIndices = () => {
	for (let i = 0; i < nodes.length; ++i) {
		nodes[i].ind = i;
	}
}

if (mode === 2) {
	// for (let i = 61; i >= 52; --i) {
	// 	undoNode(i);
	// }
	// reassignNodeIndices();

	// kool vertical
	for (let i = 237; i >= 3; i -= wid) {
		undoNode(i);
	}
	// reassignNodeIndices();
	
	for (let i = 402; i >= 90; i -= wid) {
		undoNode(i);
	}
	// reassignNodeIndices();



}





let origin = nodes[0];
let destin = nodes[nodes.length - 3];
// let destin = nodes[24];



// precalculates heuristics
for (const node of nodes) {
	const dist = distance(node, destin)
	node.heuristic = dist;
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
let pathCol = "blue"
const openSet = [];

// setTimeout(, 0);

const findMinScoreInd = openSet => {
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



const gScores = new Array(nodes.length).fill(infinity);

const runAStarAsync = async () => {

	state = states.playing;
	await sleep(100);

	// const fScores = new Array(nodes.length).fill(infinity);

	for (let i = 0; i < gScores.length; i++) gScores[i] = infinity;
	gScores[origin.ind] = 0;

	origin.fscore = 0;

	openSet.length = 0;
	openSet.push(origin);

	await resumeAStar(gScores);
}

const resumeAStar = async () => {
	while (openSet.length > 0) {

		const minScoreInd = findMinScoreInd(openSet);
		const minScoreNode = openSet[minScoreInd];

		if (minScoreNode === destin) {
			pathCol = acceptColor;
			pathSoFar.unshift(destin);
			
			console.log(`FOUND DESTIN`);
			setAsReady();
			return;
		}

		openSet.splice(minScoreInd, 1);

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

				await sleep(animationDelay);
			}

		}
	}
}



const render = () => {

	// reset
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.setLineDash([]);

	// ctx.drawImage(img, 0, 0, img.width, img.height);

	// RENDER CONNECTIONS
	ctx.lineWidth = 3;
	ctx.strokeStyle = lineColor
	for (let i = 0; i < cons.length; ++i) {
		const con = cons[i];

		ctx.strokeStyle = "#ff000050"
		ctx.lineWidth = lineWidth;
		drawLineBetween(con.a.x, con.a.y, con.b.x, con.b.y);

		// DESENHA HEURÍSTICAS PARCIAIS (DISTÂNCIA)
		// ctx.fillStyle = "green"
		// ctx.font = `${textSize.toFixed(0)}px sans-serif`
		// ctx.fillText(`${con.dist.toFixed(0)}`, Math.abs(con.a.x + con.b.x) * 0.5, Math.abs(con.a.y + con.b.y) * 0.5)
	}


	// render nodes
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];

		// console.log(`drawing ${node.x}`);
		ctx.fillStyle = circleColor;
		fillCircleIn(node.x, node.y, circleSize);

	
		// DESENHA HEURÍSTICAS
		// ctx.fillStyle = acceptColor
		// const distTxt = `${node.heuristic.toFixed(0)}`;
		// const w = ctx.measureText(distTxt).width;
		// ctx.fillText(distTxt, node.x - w * 0.5, node.y + 20);
	}
	

	
	// draws PATH
	ctx.fillStyle = "fuchsia"
	fillCircleIn(origin.x, origin.y, circleSize);
	ctx.fillStyle = acceptColor
	fillCircleIn(destin.x, destin.y, circleSize);
	ctx.fillStyle = destinColor
	fillCircleIn(destin.x, destin.y, circleSize * 2);




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


	ctx.fillStyle = indicesColor
	// DESENHA ÍNDICES
	for (let i = 0; i < nodes.length; ++i) {
		const node = nodes[i];
		if (drawIndices) {
			const letterMeasure = ctx.measureText(`${node.ind}`)
			const letterW = letterMeasure.width
			const letterH = letterMeasure.actualBoundingBoxAscent + letterMeasure.actualBoundingBoxDescent
			ctx.font = `${textSize.toFixed(0)}px sans-serif`
			ctx.fillStyle = labelColor;
			ctx.fillText(node.ind, node.x - letterW * 0.5, node.y - letterH * 0.5 - 1);
		}
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
// select.onchange = onChangeMode(select.value);
select.onchange = () => onChangeMode(select.value);

/** @type {HTMLInputElement} */
const playButton = document.getElementById("play");
playButton.onclick = onPlayButtonClick;

/** @type {HTMLInputElement} */
const stopButton = document.getElementById("stop");
stopButton.onclick = stopPlaying;

window.requestAnimationFrame(render);


})()