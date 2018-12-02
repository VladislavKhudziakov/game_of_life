var field = document.getElementById('field');

//size options
var size = {
	height: 50,
	width: 50
};

//get buttons
var startBtn = document.getElementById('start');
var stopBtn = document.getElementById('stop');

var cyclesParagraph = document.getElementById('cycles');
var cyclesCounter = 0;

startBtn.addEventListener('click', startFunc);
stopBtn.addEventListener('click', stopFunc);

//create field
for (var i = 0; i < size.height; i++) {
	var line = document.createElement('div');
	line.classList.add('line');
	for (var j = 0; j < size.width; j++) {
		var block = document.createElement('div');
		block.classList.add('block');
		line.appendChild(block);
	}
	field.appendChild(line);	
}

//get lines
var lines = field.children;
lines.map = Array.prototype.map;
lines.forEach = Array.prototype.forEach;

//add array methods
lines.map((lineElement) => lineElement.children.map = Array.prototype.map);
lines.map((lineElement) => lineElement.children.map((blockElement) => blockElement.addEventListener('click', blockClick)));


var timerId;


//block click func
function blockClick() {
	this.classList.toggle('being');
}

function startFunc() {
	this.removeEventListener('click', startFunc);
	timerId = setInterval(mainFunc, 100);
}

function stopFunc() {
	startBtn.addEventListener('click', startFunc);
	clearInterval(timerId);
}


// main function
function mainFunc() {
	var beingsArr = [];
	var blocksArr;
	cyclesCounter++;
	cyclesParagraph.innerHTML = cyclesCounter;
	for (var i = 0; i < lines.length; i++) {
		for (var j = 0; j < lines[i].children.length; j++) {
			var block = lines[i].children[j];

			//create array of neighbors blocks
			if (block.classList[1] == 'being') {
				var positions = neighbArr(j, i);

				//block info array
				var beingInfo = {
					posX: j,
					posY: i,
					neighbPositions: positions,
					neighbCnt: neighbCheck(positions),
				};
				beingsArr.push(beingInfo);
			}
		}
	}

	//create beings neigbors arr
	blocksArr = createBlocksArr(beingsArr); 

	blocksArr.forEach( function(element) {
		beingBorn(element);
	} );

	//remove or leave beings
	beingsArr.forEach( function(element) {
		var being = lines[element.posY].children[element.posX];
		lifeCycle(being, element.neighbCnt);
	} );
}


//creating neigbs arr
function neighbArr(x, y) {
	var positions = {
		leftTop: {posX: x - 1, posY: y - 1},
		midTop: {posX: x, posY: y - 1},
		rightTop: {posX: x + 1, posY: y - 1},
		leftmid: {posX: x - 1, posY: y},
		rightMid: {posX: x + 1, posY: y},
		leftBottom: {posX: x - 1, posY: y + 1},
		midBottom: {posX: x, posY: y + 1},
		rightBottom: {posX: x + 1, posY: y + 1},
	}
	return positions;
}


//check for neibs being
function neighbCheck(positions) {
	var keys = Object.keys(positions);
	var counter = 0;
	for (var i = 0; i < keys.length; i++) {
		var posY = positions[keys[i]].posY;
		var posX = positions[keys[i]].posX;

		var xTest = posX < 0 || posX >= size.width;
		var yTest = posY < 0 || posY >= size.height;

		if ( xTest || yTest) {
			continue;
		};

		if (lines[posY].children[posX].classList[1] == 'being') {
			counter++;
		};
	}
	return counter;
}


//life cycke func
function lifeCycle(being, neighbCnt) {
	var countTest = neighbCnt == 2 || neighbCnt == 3;
	if (!countTest) {
		being.classList.remove('being');
	} 
}


//block creating
function createBlocksArr(beingsArr) {
	var blocksArr = [];

	beingsArr.forEach( function(element, index) {
		var keys = Object.keys(element.neighbPositions);
		keys.forEach( function(element) {
			var blockInfo = {
				x: beingsArr[index].neighbPositions[element].posX,
				y: beingsArr[index].neighbPositions[element].posY,
			};

			var blockNeibs = neighbArr(blockInfo.x, blockInfo.y);
			blockInfo.neibsCnt = neighbCheck(blockNeibs);

			if (blocksArr.length > 0) {
				
				var repeatTest = blocksArr.some(function(element) {
					var xTest = element.x == blockInfo.x;
					var yTest = element.y == blockInfo.y;
					return xTest && yTest;
				});

				if (!repeatTest) {
					blocksArr.push(blockInfo);
			 	}
			} else {
				blocksArr.push(blockInfo);
			}

		});
	});
	blocksArr = blocksArr.filter((element) => (element.x >= 0 && element.x < size.width) && (element.y >= 0 && element.y < size.height));
	return blocksArr;
}


//being born func
function beingBorn(blockInfo) {
	if (blockInfo.neibsCnt == 3) {
		lines[blockInfo.y].children[blockInfo.x].classList.add('being');
	}
}




