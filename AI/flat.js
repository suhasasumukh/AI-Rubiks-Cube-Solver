var FlatCube = function(containerId, size, down){
	var WHITE="#ffffff", YELLOW="#ffff00" , GREEN="#009900" , BLUE="#000099", RED="#cc0000", ORANGE="#ff8000", CLEAR = "#000000";
	var colors = [GREEN,RED,WHITE,ORANGE,BLUE,YELLOW];


	this.container = document.getElementById(containerId);

	while(this.container.firstChild){
		this.container.removeChild(this.container.firstChild);
	}

	this.container.style.position = 'absolute';
	if(down){
		this.container.style.top = size*45/28 + 45 + 'px';
		this.container.style.left = '15px';
	} else {
		this.container.style.top = '15px';
		this.container.style.left = size + 30 + 'px';
	}

	this.faceSize = size/3 || 100;

	this.container.style.width = (this.faceSize*3)+'px';
	this.container.style.height = (this.faceSize*4.75)+'px';

	this.faces = [];

	var tops = [0, 1, 1, 1, 2, 3];
	var lefts = [1, 0, 1, 2, 1, 1];

	for(var i=0; i<6; i++){
		this.faces.push(new FlatFace(this, this.faceSize, tops[i]*this.faceSize, lefts[i]*this.faceSize, colors[i]));
	}
	this.faces.forEach(function(face){
		this.container.appendChild(face.container);
	}, this);

	this.message = document.createElement('div');
	this.message.style.position = 'absolute';
	this.message.style.left = this.faceSize/8 + 'px';
	this.message.style.top = this.faceSize*4.03 + 'px';
	this.message.style.color = '#ff0000';
	this.message.style.fontSize = this.faceSize/9 + 'px';
	this.container.appendChild(this.message);

	this.picker = new FlatColorPicker(colors, this.faceSize/4);
	this.picker.container.style.right = 0;
	this.picker.container.style.left = 0;
	this.picker.container.style.bottom  = 0;
	this.container.appendChild(this.picker.container);
};

FlatCube.prototype.getState = function() {
	
	var me = this;
	var result = "";
	var cubicles = ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL", "UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"]
	var colorToFace = {};

	var getFaceColor = function(c, direction){
		//direction is a string 'x', 'y', or 'z'
		return result;
	}
	
	faceNames.forEach(function(face){
		colorToFace[me.faces[faceToIndex[face]]].stickers[5].getColor() = face;
	});
	
	cubicles.forEach(function(cubicle){
		var c = me.getCubie(cubicle);
		var cubieName = "";
		lucid.array.forEach(cubicle.split(''), function(face){
			var color = getFaceColor(c, faceToDirection[face]);
			cubieName += colorToFace[color];
		});
		result += cubieName + " ";
	})
	
	return result.trim();
}

FlatCube.prototype.update = function() {
	if(this.message.firstChild){
		this.message.removeChild(this.message.firstChild);
	}
	if(this.cube){
		this.cube.updateColors();
		if(!this.cube.isSolvable()){
			this.message.appendChild(document.createTextNode(this.cube.solver.currentState));
		}
	}
};

FlatCube.prototype.setColors = function(top, front, right, colors){
	// var FRONT=4, TOP=1, BOTTOM=2, LEFT=0, RIGHT=5, BACK=3;

	var stickers = this.getStickers(top, front, right);
	colors.forEach(function(color, i){
		color && stickers[i] && stickers[i].setColor(color);
	});
}

FlatCube.prototype.getColors = function(top, front, right){
	return this.getStickers(top,front,right).map(function(sticker){
		return sticker && sticker.color;
	});
}

FlatCube.prototype.getStickers = function(top, front, right){
	var faceToIndex = {
		'B':0,
		'L':1,
		'U':2,
		'R':3,
		'F':4,
		'D':5,
	};
	var FRONT=4, TOP=1, BOTTOM=2, LEFT=0, RIGHT=5, BACK=3; 
	
	var me = this;
	var colors = [null,null,null,null,null,null];
	var getColor = function(face, sticker){
		return me.faces[face].stickers[sticker];
	}

	numFaces = Math.abs(top)+Math.abs(front)+Math.abs(right);
	if(numFaces == 3){
		if(top == 1 && right == 1 && front == 1){
			colors[TOP] = getColor(2,8);
			colors[FRONT] = getColor(4,2);
			colors[RIGHT] = getColor(3,6);
		}
		else if(top == 1 && right == 1 && front == -1){
			colors[TOP] = getColor(2,2);
			colors[RIGHT] = getColor(3,0);
			colors[BACK] = getColor(0,8);
		}
		else if(top == 1 && right == -1 && front == 1){
			colors[TOP] = getColor(2,6);
			colors[FRONT] = getColor(4,0);
			colors[LEFT] = getColor(1,8);
		}
		else if(top == 1 && right == -1 && front == -1){
			colors[TOP] = getColor(2,0);
			colors[BACK] = getColor(0,6);
			colors[LEFT] = getColor(1,2);
		}
		else if(top == -1 && right == 1 && front == 1){
			colors[FRONT] = getColor(4,8);
			colors[RIGHT] = getColor(3,8);
			colors[BOTTOM] = getColor(5,2);
		}
		else if(top == -1 && right == 1 && front == -1){
			colors[RIGHT] = getColor(3,2);
			colors[BACK] = getColor(0,2);
			colors[BOTTOM] = getColor(5,8);
		}
		else if(top == -1 && right == -1 && front == 1){
			colors[FRONT] = getColor(4,6);
			colors[LEFT] = getColor(1,6);
			colors[BOTTOM] = getColor(5,0);
		}
		else if(top == -1 && right == -1 && front == -1){
			colors[BACK] = getColor(0,0);
			colors[LEFT] = getColor(1,0);
			colors[BOTTOM] = getColor(5,6);
		}
	}
	else if(numFaces == 2){
		if(top == 1){
			if(front == 1){
				colors[FRONT] = getColor(4,1);
				colors[TOP] = getColor(2,7);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,7);
				colors[TOP] = getColor(2,1);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,3);
				colors[TOP] = getColor(2,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,5);
				colors[TOP] = getColor(2,3);
			}
		}
		else if(top == -1){
			if(front == 1){
				colors[FRONT] = getColor(4,7);
				colors[BOTTOM] = getColor(5,1);
			}
			else if(front == -1){
				colors[BACK] = getColor(0,1);
				colors[BOTTOM] = getColor(5,7);
			}
			else if(right == 1){
				colors[RIGHT] = getColor(3,5);
				colors[BOTTOM] = getColor(5,5);
			}else if(right == -1){
				colors[LEFT] = getColor(1,3);
				colors[BOTTOM] = getColor(5,3);
			}
		}
		else if(front == 1){
			if(right==1){
				colors[FRONT] = getColor(4,5);
				colors[RIGHT] = getColor(3,7);
			}else if(right==-1){
				colors[FRONT] = getColor(4,3);
				colors[LEFT] = getColor(1,7);
			}
		}
		else if(front == -1){
			if(right==1){
				colors[BACK] = getColor(0,5); 
				colors[RIGHT] = getColor(3,1);
			}else if(right==-1){
				colors[BACK] = getColor(0,3);
				colors[LEFT] = getColor(1,1);
			}
		}
	}
	else if(numFaces == 1){
		//center
		if(top==1)
			colors[TOP] = getColor(2,4);
		else if(top== -1)
			colors[BOTTOM] = getColor(5,4);
		else if(front==1)
			colors[FRONT] = getColor(4,4);
		else if(front== -1)
			colors[BACK] = getColor(0,4);
		else if(right == 1)
			colors[RIGHT] = getColor(3,4);
		else if(right == -1)
			colors[LEFT] = getColor(1,4);
	}
	return colors;
}

FlatCube.prototype.getColor = function() {
	return this.picker.getColor();
};

var FlatFace = function(cube, size, top, left, color){
	this.container = document.createElement('div');
	this.container.style.position = 'absolute';
	this.container.style.width = size + 'px';
	this.container.style.height = size + 'px';
	this.container.style.top = top + 'px';
	this.container.style.left = left + 'px';
	this.cube = cube;
	this.stickers = [];
	var tops = [0, 0, 0, 1, 1, 1, 2, 2, 2];
	var lefts = [0, 1, 2, 0, 1, 2, 0, 1, 2];
	for(var i=0; i<9; i++){
		var sticker = new FlatSticker(size/3, tops[i]*size/3, lefts[i]*size/3, color);
		this.stickers.push(sticker);
		this.container.appendChild(sticker.container);
	}

	var me = this;
	this.stickers.forEach(function(sticker){
		sticker.container.onclick = function(){
			if(me.cube.getColor()){
				sticker.setColor(me.cube.getColor());
				me.cube.update();
			}
		}
	}, this);
};

var FlatSticker = function(size, top, left, color){
	this.container = document.createElement('div');
	this.container.style.width = (size-2) + 'px';
	this.container.style.height = (size-2) + 'px';
	this.container.style.border = '1px solid black';
	this.container.style.position = 'absolute';
	this.container.style.top = top + 'px';
	this.container.style.left = left + 'px';

	this.setColor(color);
};

FlatSticker.prototype.setColor = function(color) {
	this.color = color;
	this.container.style.backgroundColor = color;
};

var FlatColorPicker = function(colors, size){
	var me = this;
	size*=1.5;
	this.container = document.createElement('div');
	this.container.style.position = 'absolute';
	// this.container.style.width  = (size*4) + 'px';
	this.container.style.height = (size*1.5) + 'px';
	this.container.style.border = '1px solid black';
	this.container.onclick = function(){me.setSelection(-1)}
	this.size = size;
	this.colors = colors;

	this.choices = [];
	var tops = [0,0,0,0,0,0];
	var lefts = [0,1,2,3,4,5];
	for(var i=0; i<6; i++){
		this.choices.push(new FlatSticker(size, .25*size, .25*size + 1.29*lefts[i]*size, colors[i]))
		this.choices[this.choices.length-1].container.style.cursor = 'pointer';
	}
	this.choices.forEach(function(choice, i){
		this.container.appendChild(choice.container);
		choice.container.onclick = function(e){
			me.setSelection(i);
			e.stopPropagation();
		}
	}, this);
};

FlatColorPicker.prototype.setSelection = function(index) {
	this.selection = index;
	this.choices.forEach(function(choice, i){
		if(i == index){
			choice.container.style.width = (this.size-6) + 'px';
			choice.container.style.height = (this.size-6) + 'px';
			choice.container.style.border = '3px solid black';
		} else {
			choice.container.style.width = (this.size-2) + 'px';
			choice.container.style.height = (this.size-2) + 'px';
			choice.container.style.border = '1px solid black';
		}
	}, this);
};

FlatColorPicker.prototype.getColor = function(){
	return this.selection < 0 ? '' : this.colors[this.selection];
}

var clock90 =   "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABe0lEQVR42u2Y4a2EIBCE6cASKIESLIUSLMESLIESLMESKMESrgQeP3jJxdzJrSDgMl8yPy7mojPskgUhAAAAAAAAADcivbSX8dq83Ims1+o1eaknmx6CCRsxHNPutYQQqZhaxmevV6LxTzKEIEz4T1Gmm4wftYSgY+ZdyR7fChg/tsYYMV8kgLHQqn+TPjF/ewC6ovHj3mC+PGNvPqbbyt71GoCs3PPVA9geZD57AFOGD7JhUBrfRl0Zfk9hDG4ygCGx9ClTXM5pMhtzwoqrhNDXFgK4uvomMrLeHb6r2fs5T2KmdgD2QtkPDZjPEoC88FLViPksAehKpZ/DvKvxIbIh81kC2Ii9n8rS2iBEednM8UaXEsDYewCq9wAEKgB7QN8BTBwDoJwDVo4BUM/jA7cAqEdhdsOQIgbw4lgFOzEEdnvBlSspVq1w5VLEcqsCI+pciT2uClia//WygrV5EcztvZo/mwu6Mf+P7tn8+37QrXkAAAAAAAAezh/ic2r7MgbjxQAAAABJRU5ErkJggg==')";
var counter90 = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABeklEQVR42u2aYc3DIBCGcYAEJCChUpBQCZVQCUiohEqohEqoBD6WsGRZ8nU9euwYvE/y/liyZfBwsCuZUgAAAAAAAIBC2JgxZonZYsJJ1hgf42JMLRPwGZ95DH6O2T9M+FO2JE9LCggECSa9NzDniJmkRIQLEnRa8VA4R6oIEQH/SRgYSp2a9ZtnRDiR4L488fdqGCQEPCV4wcm/xkkIqC2udwGh5Hb4FQFHqYMx/FDW2gUs6Xd8eFktm15PF1rlKxlrE0Dt4u52kwd3x3h3xXMHY29UxFSDAI5B6MxqYK2CXAGecRG85FkQKpCgM7bDVsshyCXBZny3qUEApwTqVnC1COCSYCTEczZCM8N4KGdBkc5QmokovTmG3gXY3gUoVADOgL4FjL0LWCSeB2pBZ9xHdN0Eja2t/kEUYHvd+4/sPZc++72gNDmXo6a1/U+R4FWDUCQY1ShXJMyqcc4k7Er4D1XSEqzqiHcJTnXIU8KsAAAAAAAAABT+AGABavtiD0FIAAAAAElFTkSuQmCC')";
var clock180 = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAABSxJREFUeJztmUtMG1cUhv/xi3fGU8DITYqLaUFRBYlwUaUUhS6ANV04W7qCJd3BDrojK6ruYGOq7vCi2TZGggVUReEZlwUUbEJauaVJxlOw8aN4urDHDGZs5nHHIHU+6Qozc+499/z3dWYGMDAwMDAwMDAwMPhfQpXJjwvAF7nyYe5vMbYAHAJYypVt/bqlLzSAUQCbAHgNJQxgGlkRleLTFIFKaAATAFhoC1yq+CBfCF+uTlkZhT6BF5ZpZIUuhk9kWxZcABahf+CFS6NXoi++Ajvd6UV5Rr1YGRL1pTB43QUY0iEgNcUH6eB1FeC2BH9d0YXeWxDYjQngws2u+RsXYPEWBEVMAIvC4EdROo2VwxaAZ8imuVFkU10Xsinyw1z7gxp96AINbVPfB/lZHMlskhgTKjuwCeCBSp80gB9V+iUqgNrR96F0yioXteITE2BUhWMfKeconuSUTQClj7SbIDPygLbgiQjgUuFU7ZovRGvwRAQYUuiQ1NQnETwRAZR2xHUDPnUVYFGBs00C/qYV+CuLAEqcTZBwWE5MhNtbItye7pAWIEq4Pd2R811AyToq13cGYpCeAaTO/7JBWgA74fZ0h7QAD7U2QFGU22yx9plMZg8p+4rqmuHWju6Dzp4BvrmtY01sK2fNbkJ+YM8AfJn7zbR2dK/V0IxbuBk9jqwf7QX7kX2yLIRpvOuacba0e4ULMY4NhXc2nmQy5+uFxiaT2dPU7J5qvNfSJ7Y/2guOp5MJv3DNWlHpvd/9eF5cN5U4Y3fXlz/leT4kZwYcyrARGETuIai6jh4WBw8AdofTY7ZYpUaKaW7rCIiDB4AamnG3dT0KFI6uyWT2tHU9CoiDF+zvdz+er6iuGc77bGjyAsD+9ur4y+XnVCS867dVVjFVtXe8gLwlsCTDRszXAJCInS7IrVBdRw/bHU7JKWyrrGLqnffGxNdaPumat1VWMcXaa+/6fIaiKHex+2L0EoDOZM7XgyuB1v3t1fHrKtD1jkvT+OXy8/ci4d38NBbPDGtFpbdwWe38stgf3tl4Km6z1l4/DADRN3/5AeCjB59NdfYM8M6Wdm8qccaenf7jB+QJsA1ly8AOYA4AeJ4PJc/iV9avFqy2iksje7QX7D//N71wwr4Zjx5H8r5qacYDAOlkwr+7sTIS49gQkBVsb+Pnfp7nQ4D8t8JzACYV9HMQ2eeCb+QYc2+PF4T1XEMz7s6egXfi+6/3grMlquc31HQqIbW5IhmPzR4EX0i2IfcYnJNpJ0b2q+34CVcqQJxyrOz9RClyBXgFZSJsQcH3A8bhnCp13+n6eKzUfS0oSYQmZdoJwXNyjCmKcn/Q1pE/tmIcG9rfXh3/+/dwftTtDqdHfLSRRIkArwB8e42NouABQDiPBUK/rvXHT7inkcPf+oWNCwDuMA19V2trR2kqPIniJ4Li4KXgef5iU0tebGoWq63YuZ+/brVVFs0NiqFUAA7Sm5vq4NOpZEj8f+Nd14zZYu2rrqPHxMnRKceuS9k3t3UEzBZrXx3TMCVlfx1KP44C2bzgK1xsippGPp1M+GMcGxKSG2dLu7cwJQaA0+jbWSl7u8PpsTucgWL216H2afB7ZPcDItM+vLPxJJU4kzzDAWB3Y2VESFzU2JfCrKyrl/gJwAyAZCkjPpMJpRLx9+n6Js/rveBs/IT77ooNz0fe/fnHAkVR7po7F2lujGNDB8EXI6nE2Q9a7Etx615hURTlNpktbj6TYaUeg7XaGxgYGBgYGBgY5PgPHc4RtaXi8ysAAAAASUVORK5CYII=)";

var RubiksCubeControls = function(id, cube, width){
	var me = this;

	this.cube = cube;

	this.container = document.getElementById(id);
	this.container.style.position = 'absolute';
	this.container.style.border = '1px solid black';

	this.buttons = {};

	this.cube.addUpdateCallback(function(){
		for(var face in me.buttons){
			var color = me.cube.getFaceColor(face.substr(0,1));
			me.buttons[face].style.backgroundColor = color;
		}
	});

	var addButton = function(name, background){
		var color = me.cube.getFaceColor(name.substr(0,1));
		var button = document.createElement('div');

		me.buttons[name] = button;
		me.container.appendChild(button);

		button.addEventListener('click', function(){
			me.cube.makeMove(name);
		});
		button.setAttribute('name',name);
		button.style.backgroundColor = color;
		button.style.position = 'absolute';
		button.style.border = '1px solid black';
		button.style.backgroundImage = background;
		button.style.backgroundSize = 'contain';

	}

	addButton('L',clock90);
	addButton('R',clock90);
	addButton('U',clock90);
	addButton('D',clock90);
	addButton('F',clock90);
	addButton('B',clock90);
	addButton('L\'',counter90);
	addButton('R\'',counter90);
	addButton('U\'',counter90);
	addButton('D\'',counter90);
	addButton('F\'',counter90);
	addButton('B\'',counter90);

	this.solveButton = document.createElement('div');
	this.solveButton.appendChild(document.createTextNode('Solve'));
	this.solveButton.addEventListener('click', function(){
		me.progress.display = '';
		me.cube.solve(function(data){
			setProgress(data);
		});
		me.setSolution('');
	});
	
	this.solveSlowButton = document.createElement('div');
	this.solveSlowButton.appendChild(document.createTextNode('Solve Step by Step'));
	this.solveSlowButton.addEventListener('click', function(){
		me.cube.getSolutionAsync(function(solution){me.setSolution(solution);},function(data){
			setProgress(data);
		});
	});

	function setProgress(data){
		me.progress.style.width = data*100 + '%';
		if(data == 1){
			me.progress.style.width = '0%';
		}
	}

	this.overlay = document.createElement('div');

	this.stepButton = document.createElement('div');
	this.stepButton.addEventListener('click', function(){
		me.nextMove();
	});

	this.scrambleButton = document.createElement('div');
	this.scrambleButton.appendChild(document.createTextNode('Scramble'));
	this.scrambleButton.addEventListener('click', function(){
		me.cube.scramble();
	});

	this.progress = document.createElement('div');
	this.progress.style.position = 'absolute';
	this.progress.style.top = 0;
	this.progress.style.left = 0;
	this.progress.style.bottom = 0;
	this.progress.style.width = '0%';
	this.progress.style.backgroundColor = 'rgba(0,0,255,0.2)';

	this.overlay.appendChild(this.stepButton);
	this.container.appendChild(this.scrambleButton);
	this.container.appendChild(this.overlay);
	this.container.appendChild(this.progress);
	this.container.appendChild(this.solveButton);
	this.container.appendChild(this.solveSlowButton);
	if(width){
		this.setWidth(width);
	}
}

RubiksCubeControls.prototype.setSolution = function(solution) {
	if(solution.length > 0){
		this.solution = solution.split(' ');
		this.updateStepButton();
		this.overlay.style.display = '';
	} else {
		this.solution = [];
		this.overlay.style.display = 'none';
	}
}

RubiksCubeControls.prototype.updateStepButton = function() {
	if(this.solution && this.solution.length > 0){
		var move = this.solution[0];
		var color = this.cube.getFaceColor(move.substr(0,1));
		this.stepButton.style.backgroundColor = color;
		var bgImg = move.length == 1 ? clock90 : move[1] == '2' ? clock180 : counter90;
		this.stepButton.style.backgroundImage = bgImg;
		if(this.stepButton.firstChild){
			this.stepButton.removeChild(this.stepButton.firstChild);
		}
		this.stepButton.appendChild(document.createTextNode(this.solution.length));
	}
}
RubiksCubeControls.prototype.nextMove = function() {
	var move = this.solution.shift();
	this.cube.makeMove(move);
	if(this.solution.length > 0){
		this.updateStepButton();
	} else {
		this.overlay.style.display = 'none';
	}
}
RubiksCubeControls.prototype.setWidth = function(width) {
	this.container.style.width = (width-2) + 'px';
	this.container.style.height = (width*15/28 - 2) + 'px';
	this.container.style.left = '15px';
	this.container.style.top = 30 + width + 'px';
	var buttonWidth = width/8;
	var current = 0;
	for(var name in this.buttons){
		this.buttons[name].style.width = (buttonWidth-2) + 'px';
		this.buttons[name].style.height = (buttonWidth-2) + 'px';
		this.buttons[name].style.left = buttonWidth*2/7 + 9/7*buttonWidth*(current < 6 ? current : current - 6) + 'px';
		this.buttons[name].style.top = width/28 + (current < 6 ? 0 : (buttonWidth + width/28)) + 'px';
		current++;
	}

	function styleSolve(button, left, bottom){
		button.style.position = 'absolute';
		button.style.cursor = 'pointer';
		button.style.bottom = (bottom || width*3/28) + 'px';
		button.style.left = left + 'px';
		button.style.width = buttonWidth*25/7 - 2 + 'px';
		button.style.height = buttonWidth/2 + 'px';
		button.style.lineHeight = buttonWidth/2 + 'px';
		button.style.textAlign = 'center';
		button.style.border = '1px solid black';
		button.style.fontSize = buttonWidth/3+'px';
		button.style.backgroundColor = '#fafafa';

	}

	styleSolve(this.solveButton, width/28);
	styleSolve(this.solveSlowButton, width*29/56);
	styleSolve(this.scrambleButton, width/28, width/58);

	this.scrambleButton.style.width = '';
	this.scrambleButton.style.right = (width/28 - 2) + 'px';


	if(!this.solution || this.solution.length == 0){
		this.overlay.style.display = 'none';
	}
	this.overlay.style.position = 'absolute';
	this.overlay.style.left = 0;
	this.overlay.style.right = 0;
	this.overlay.style.top = 0;
	this.overlay.style.bottom = 0;
	this.overlay.style.backgroundColor = 'rgba(0,0,0,.5)'; 


	this.stepButton.style.backgroundSize = 'contain';
	this.stepButton.style.position = 'absolute';
	this.stepButton.style.border = '1px solid black';
	this.stepButton.style.width = buttonWidth * 16/7 - 2 + 'px';
	this.stepButton.style.height = buttonWidth * 16/7 - 2 + 'px';
	this.stepButton.style.top = width/28 + 'px';
	this.stepButton.style.left = width/28 + (buttonWidth + width/28)*2 + 'px';
};