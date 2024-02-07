function hexToRgb(hex) {
	if (hex.length == 7) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: 1
		} : null;
	}
	else if (hex.length == 9) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16),
			a: parseInt(result[4], 16) / 256
		} : null;
	}
}

function makeRotationAffine(x, y, z) {
	return multiplyAffine(multiplyAffine(makeRotateAffineX(x), makeRotateAffineY(y)), makeRotateAffineZ(z));
}


var arrayFind = function (arr, f) {
	var i = arrayFindIndex(arr, f);
	return i < 0 ? null : arr[i];
};



arrayFindIndex = function (arr, f) {
	var l = arr.length;
	var arr2 = arr;
	for (var i = 0; i < l; i++) {
		if (i in arr2 && f(arr2[i], i, arr)) {
			return i;
		}
	}
	return -1;
};
var xAutorotate = 0, yAutorotate = 0, zAutorotate = 0;

function AffineMatrix(e0, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11) {
	this.e0 = e0;
	this.e1 = e1;
	this.e2 = e2;
	this.e3 = e3;
	this.e4 = e4;
	this.e5 = e5;
	this.e6 = e6;
	this.e7 = e7;
	this.e8 = e8;
	this.e9 = e9;
	this.e10 = e10;
	this.e11 = e11;
};


function multiplyAffine(a, b) {
	var a0 = a.e0, a1 = a.e1, a2 = a.e2, a3 = a.e3, a4 = a.e4, a5 = a.e5;
	var a6 = a.e6, a7 = a.e7, a8 = a.e8, a9 = a.e9, a10 = a.e10, a11 = a.e11;
	var b0 = b.e0, b1 = b.e1, b2 = b.e2, b3 = b.e3, b4 = b.e4, b5 = b.e5;
	var b6 = b.e6, b7 = b.e7, b8 = b.e8, b9 = b.e9, b10 = b.e10, b11 = b.e11;
	return new AffineMatrix(
		a0 * b0 + a1 * b4 + a2 * b8,
		a0 * b1 + a1 * b5 + a2 * b9,
		a0 * b2 + a1 * b6 + a2 * b10,
		a0 * b3 + a1 * b7 + a2 * b11 + a3,
		a4 * b0 + a5 * b4 + a6 * b8,
		a4 * b1 + a5 * b5 + a6 * b9,
		a4 * b2 + a5 * b6 + a6 * b10,
		a4 * b3 + a5 * b7 + a6 * b11 + a7,
		a8 * b0 + a9 * b4 + a10 * b8,
		a8 * b1 + a9 * b5 + a10 * b9,
		a8 * b2 + a9 * b6 + a10 * b10,
		a8 * b3 + a9 * b7 + a10 * b11 + a11
	);
}
function makeIdentityAffine() {
	return new AffineMatrix(
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0
	);
}

function makeRotateAffineX(theta) {
	var s = Math.sin(theta);
	var c = Math.cos(theta);
	return new AffineMatrix(
		1, 0, 0, 0,
		0, c, -s, 0,
		0, s, c, 0
	);
}
function makeRotateAffineY(theta) {
	var s = Math.sin(theta);
	var c = Math.cos(theta);
	return new AffineMatrix(
		c, 0, s, 0,
		0, 1, 0, 0,
		-s, 0, c, 0
	);
}
function makeRotateAffineZ(theta) {
	var s = Math.sin(theta);
	var c = Math.cos(theta);
	return new AffineMatrix(
		c, -s, 0, 0,
		s, c, 0, 0,
		0, 0, 1, 0
	);
}

function transformPoint(t, p) {
	return {
		x: t.e0 * p.x + t.e1 * p.y + t.e2 * p.z + t.e3,
		y: t.e4 * p.x + t.e5 * p.y + t.e6 * p.z + t.e7,
		z: t.e8 * p.x + t.e9 * p.y + t.e10 * p.z + t.e11
	};
}
function averagePoints(ps) {
	var avg = { x: 0, y: 0, z: 0 };
	for (var i = 0, il = ps.length; i < il; ++i) {
		var p = ps[i];
		avg.x += p.x;
		avg.y += p.y;
		avg.z += p.z;
	}

	var f = 1 / il;

	avg.x *= f;
	avg.y *= f;
	avg.z *= f;

	return avg;
}

function averageUnRotatedPoints(ps) {
	var avg = { x: 0, y: 0, z: 0 };
	for (var i = 0, il = ps.length; i < il; ++i) {
		var p = ps[i];
		avg.x += p.xo;
		avg.y += p.yo;
		avg.z += p.zo;
	}

	var f = 1 / il;

	avg.x *= f;
	avg.y *= f;
	avg.z *= f;

	return avg;
}
var Point = function (parent, xyz, project, rubiks) {
	this.project = project;
	this.rubiks = rubiks;
	this.xo = xyz[0];
	this.yo = xyz[1];
	this.zo = xyz[2];
	this.cube = parent;
};
Point.prototype.projection = function () {
	var p = transformPoint(this.cube.rotationAffine, { x: this.xo, y: this.yo, z: this.zo });
	p = transformPoint(this.rubiks.cameraAffine, p);
	p = transformPoint(this.rubiks.customAffine, p);
	if (this.rubiks.affinediff) {
		p = transformPoint(this.rubiks.affinediff, p);
	}
	this.x = p.x;
	this.y = p.y;
	this.z = p.z;
	var x = p.x;
	var y = p.y;
	var z = p.z;
	if (this.project) {
		this.visible = (350 + z > 0);
		this.X = ((75 / 2) + x * (250 / (z + 350))) * (this.rubiks.width / 75);
		this.Y = ((75 / 2) + y * (250 / (z + 350))) * (this.rubiks.width / 75);
	}
};
var Face = function (cube, index, normalVector, color, rubiks) {
	this.rubiks = rubiks;
	this.cube = cube;
	this.p0 = cube.points[index[0]];
	this.p1 = cube.points[index[1]];
	this.p2 = cube.points[index[2]];
	this.p3 = cube.points[index[3]];
	this.normal = new Point(this.cube, normalVector, false, rubiks);
	this.color = color;
};
Face.prototype.distanceToCamera = function () {
	var dx = (this.p0.x + this.p1.x + this.p2.x + this.p3.x) * 0.25;
	var dy = (this.p0.y + this.p1.y + this.p2.y + this.p3.y) * 0.25;
	var dz = (350 + 250) + (this.p0.z + this.p1.z + this.p2.z + this.p3.z) * 0.25;
	this.distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
};
Face.prototype.draw = function () {
	var ctx = this.rubiks.ctx;
	ctx.beginPath();
	ctx.moveTo(this.p0.X, this.p0.Y);
	ctx.lineTo(this.p1.X, this.p1.Y);
	ctx.lineTo(this.p2.X, this.p2.Y);
	ctx.lineTo(this.p3.X, this.p3.Y);
	ctx.closePath();
	this.normal.projection();
	var light = (
		false ?
			this.normal.y + this.normal.z * 0.5 :
			this.normal.z
	);
	var r = g = b = light;
	light += (1 - light) * .8;
	var rgb = hexToRgb(this.color);
	ctx.fillStyle = "rgba(" +
		Math.round(rgb.r * light) + "," +
		Math.round(rgb.g * light) + "," +
		Math.round(rgb.b * light) + "," + rgb.a + ")";
	ctx.fill();
};
Face.prototype.getRenderData = function () {

	this.normal.projection();
	var light = (
		false ?
			this.normal.y + this.normal.z * 0.5 :
			this.normal.z
	);
	var r = g = b;
	var rgb = hexToRgb(this.color);
	r = Math.round(rgb.r * light).toString(16);
	g = Math.round(rgb.g * light).toString(16);
	b = Math.round(rgb.b * light).toString(16);
	r = r.length == 1 ? '0' + r : r;
	g = g.length == 1 ? '0' + g : g;
	b = b.length == 1 ? '0' + b : b;
	var fillColor = "#" + r + g + b;
	return {
		FillColor: fillColor,
		StrokeColor: null,
		LineWidth: null,
		Actions: [
			{
				Action: 'move',
				x: this.p0.X,
				y: this.p0.Y
			}, {
				Action: 'line',
				x: this.p1.X,
				y: this.p1.Y
			}, {
				Action: 'line',
				x: this.p2.X,
				y: this.p2.Y
			}, {
				Action: 'line',
				x: this.p3.X,
				y: this.p3.Y
			}, {
				Action: 'close'
			}
		]
	}
}
var Cube = function (x, y, z, w, rubiks, colors) {
	this.rubiks = rubiks;
	this.w = w;
	this.points = [];
	var p = [
		[x - w, y - w, z - w],
		[x + w, y - w, z - w],
		[x + w, y + w, z - w],
		[x - w, y + w, z - w],
		[x - w, y - w, z + w],
		[x + w, y - w, z + w],
		[x + w, y + w, z + w],
		[x - w, y + w, z + w]
	];
	for (var i in p) this.points.push(
		new Point(this, p[i], true, rubiks)
	);
	var f = [
		[0, 1, 2, 3],
		[0, 4, 5, 1],
		[3, 2, 6, 7],
		[0, 3, 7, 4],
		[1, 5, 6, 2],
		[5, 4, 7, 6]
	];
	var nv = [
		[0, 0, 1],
		[0, 1, 0],
		[0, -1, 0],
		[1, 0, 0],
		[-1, 0, 0],
		[0, 0, -1]
	];
	this.alpha = 1;
	this.faces = [];
	for (var i in f) {
		this.faces.push(
			new Face(this, f[i], nv[i], colors[i], rubiks)
		);
	}
	this.rotationAffine = makeIdentityAffine();
	this.rotateX = 0;
	this.rotateY = 0;
	this.rotateZ = 0;
};

RubiksCube.prototype.update = function () {
	if (this.flatCube && !this.rotating) {
		this.blocks.forEach(function (block) {
			var p = block.getPosition();
			var colors = block.getColors();
			this.flatCube.setColors(
				p.y < 0 ? 1 : p.y > 0 ? -1 : 0,
				p.x < 0 ? -1 : p.x > 0 ? 1 : 0,
				p.z < 0 ? -1 : p.z > 0 ? 1 : 0,
				colors
			);
		}, this);
	}
	if (!this.rotating) {
		this.updateCallbacks.forEach(function (f) { f(); });
	}
}

RubiksCube.prototype.addUpdateCallback = function (f) {
	this.updateCallbacks.push(f);
}

Cube.prototype.updateColors = function (colors) {
	this.faces.forEach(function (face) {
		if (colors[0] && face.normal.zo == 1)
			face.color = colors[0];
		else if (colors[1] && face.normal.yo == 1)
			face.color = colors[1];
		else if (colors[2] && face.normal.yo == -1)
			face.color = colors[2];
		else if (colors[3] && face.normal.xo == 1)
			face.color = colors[3];
		else if (colors[4] && face.normal.xo == -1)
			face.color = colors[4];
		else if (colors[5] && face.normal.zo == -1)
			face.color = colors[5];
	});
}

Cube.prototype.getColors = function () {
	var colors = [null, null, null, null, null, null];
	this.faces.forEach(function (face) {
		if (face.normal.zo == 1)
			colors[0] = face.color;
		else if (face.normal.yo == 1)
			colors[1] = face.color;
		else if (face.normal.yo == -1)
			colors[2] = face.color;
		else if (face.normal.xo == 1)
			colors[3] = face.color;
		else if (face.normal.xo == -1)
			colors[4] = face.color;
		else if (face.normal.zo == -1)
			colors[5] = face.color;
	});
	return colors;
}

Cube.prototype.getPosition = function () {
	var points = [];
	for (var i = 0; i < this.points.length; i++) {
		var p = transformPoint(makeRotateAffineX(this.rotateX), { x: this.points[i].xo, y: this.points[i].yo, z: this.points[i].zo });
		p = transformPoint(makeRotateAffineY(this.rotateY), p);
		p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
		points.push(p);
	};
	var result = averagePoints(points);
	result.x = Math.round(result.x);
	result.y = Math.round(result.y);
	result.z = Math.round(result.z);
	return result;
};
Cube.prototype.setRotationAffine = function () {
	if (this.rotateX != 0 || this.rotateY != 0 || this.rotateZ != 0)
		this.rotationAffine = makeRotationAffine(this.rotateX, this.rotateY, this.rotateZ);
}
Cube.prototype.resetRotation = function () {
	var points = [];
	for (var i = 0; i < this.points.length; i++) {
		var p = transformPoint(makeRotateAffineX(this.rotateX), { x: this.points[i].xo, y: this.points[i].yo, z: this.points[i].zo });
		p = transformPoint(makeRotateAffineY(this.rotateY), p);
		p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
		this.points[i].xo = p.x;
		this.points[i].yo = p.y;
		this.points[i].zo = p.z;
	};
	for (var i = 0; i < this.faces.length; i++) {
		var normal = this.faces[i].normal;
		var p = transformPoint(makeRotateAffineX(this.rotateX), { x: normal.xo, y: normal.yo, z: normal.zo });
		p = transformPoint(makeRotateAffineY(this.rotateY), p);
		p = transformPoint(makeRotateAffineZ(this.rotateZ), p);
		normal.xo = p.x;
		normal.yo = p.y;
		normal.zo = p.z;
	}
	this.rotateX = 0;
	this.rotateY = 0;
	this.rotateZ = 0;
	this.rotationAffine = makeIdentityAffine();
};
Cube.prototype.getRenderData = function () {
	var result = [];
	var faces = [];
	var j = 0, p;
	while (p = this.points[j++]) {
		p.projection();
	}
	for (var k = 0; k < this.faces.length; k++) {
		this.faces[k].distanceToCamera();
		faces.push(this.faces[k]);
	}
	faces.sort(function (p0, p1) {
		return p1.distance - p0.distance;
	});
	j = 0;
	while (f = faces[j++]) {
		if (f.visible) {
			result.push(f.getRenderData());
		} else break;
	}

	return result;
}
function RubiksCube(canvas, width) {
	this.canvas = document.getElementById(canvas);
	this.turnSpeed = 250;
	this.width = width;
	this.canvas.width = width;
	this.canvas.height = width;
	this.ctx = this.canvas.getContext('2d');
	this.blocks = [];
	this.points = [];
	this.faces = [];
	this.queue = [];
	this.moveHistory = [];
	this.rotating = false;
	this.rotating2 = false;
	this.cameraY = 1.0471973333333313;
	this.cameraX = 3.9269900000000044;
	this.cameraZ = 0;
	this.cx = 0.6;
	this.cy = 0.6;
	this.cz = 0;
	this.updateCallbacks = [];
	this.cameraAffine = makeRotationAffine(this.cameraX, this.cameraY, this.cameraZ);
	this.customAffine = makeIdentityAffine();
	var w = 54 / 6;
	for (var i = -1; i < 2; i++) {
		for (var j = -1; j < 2; j++) {
			for (var k = -1; k < 2; k++) {
				if (k != 0 || j != 0 || i != 0) {
					var WHITE = "#ffffff", YELLOW = "#ffff00", GREEN = "#009900", BLUE = "#000099", RED = "#cc0000", ORANGE = "#ff8000", CLEAR = "#000000";
					var colors = [CLEAR, CLEAR, CLEAR, CLEAR, CLEAR, CLEAR];
					if (j == 1) colors[2] = YELLOW;
					else if (j == -1) colors[1] = WHITE;
					if (i == 1) colors[4] = BLUE;
					else if (i == -1) colors[3] = GREEN;
					if (k == 1) colors[5] = ORANGE;
					else if (k == -1) colors[0] = RED;
					var block = new Cube(2.20 * i * w, 2.20 * j * w, 2.20 * k * w, w, this, colors);
					this.blocks.push(block);
					for (var f = 0; f < block.faces.length; f++)
						this.faces.push(block.faces[f]);
					for (var f = 0; f < block.points.length; f++)
						this.points.push(block.points[f]);
				}
			}
		}
	}
	this.solver = new RubiksCubeSolver();

	var onmousedown = function (e) {
		this.mouseDown = true;
		if (e.touches && e.touches.length > 0) {
			e = e.touches[0];
		}
		this.lastPos = { x: e.clientX, y: e.clientY };
		this.affinediff = makeIdentityAffine();
	}
	var onmouseup = function () {
		if (this.mouseDown) {
			this.mouseDown = false;
			if (this.affinediff) {
				this.customAffine = multiplyAffine(this.affinediff, this.customAffine);
			}
			this.affinediff = null;
		}
	}
	var onmousemove = function (e) {
		if (this.mouseDown) {
			e.preventDefault();
			if (e.touches && e.touches.length > 0) {
				e = e.touches[0];
			}
			var moved = { x: e.clientX - this.lastPos.x, y: e.clientY - this.lastPos.y };
			this.lastPos = { x: e.clientX, y: e.clientY };
			this.affinediff = multiplyAffine(multiplyAffine(makeRotateAffineX(moved.y / 100), makeRotateAffineY(-moved.x / 100)), this.affinediff);
		}
	}
	this.canvas.addEventListener('mousedown', onmousedown.bind(this));
	this.canvas.addEventListener('touchstart', onmousedown.bind(this));
	document.addEventListener('mouseup', onmouseup.bind(this));
	document.addEventListener('touchend', onmouseup.bind(this));
	document.addEventListener('touchcancel', onmouseup.bind(this));
	document.addEventListener('mousemove', onmousemove.bind(this));
	document.addEventListener('touchmove', onmousemove.bind(this));
}

RubiksCube.prototype.solve = function (progress) {
	var me = this;
	if (this.isSolvable()) {
		this.solver.solveAsync(this.getState(), function (solution) {
			me.makeMoves(solution);
		}, progress);
	}
}

RubiksCube.prototype.getSolutionAsync = function (callback, progress) {
	if (this.isSolvable()) {
		this.solver.solveAsync(this.getState(), callback, progress);
	}
	callback('');
}

RubiksCube.prototype.getSolution = function () {
	if (this.isSolvable()) {
		return this.solver.solve(this.getState());
	}
	return '';
}

RubiksCube.prototype.isSolvable = function () {
	return !this.rotating && this.solver.setState(this.getState());
}

RubiksCube.prototype.scramble = function (num) {
	var moves = 'u d f b l r'.split(' ');
	var me = this;
	if (this.rotating) {
		return;
	}
	num = num || 50;
	var turnSpeed = this.turnSpeed;
	this.turnSpeed = 100;
	for (var i = 0; i < num; i++) {
		var r = Math.random();
		this.makeMove(moves[Math.floor(Math.random() * moves.length)] + (Math.random() > 1 / 2 ? "'" : ""));
	}
	var checkAgain = function () {
		setTimeout(function () {
			if (me.queue.length == 0) {
				me.turnSpeed = turnSpeed;
			} else {
				checkAgain();
			}
		}, 100);
	}
	checkAgain();
};

RubiksCube.prototype.updateSize = function (size) {
	this.width = size;
	this.canvas.width = size;
	this.canvas.height = size;
};

RubiksCube.prototype.tick = function () {
	this.cameraX += ((this.cx - this.cameraX) * 0.05);
	this.cameraY += ((this.cy - this.cameraY) * 0.05);
	this.cameraZ += ((this.cz - this.cameraZ) * 0.05);
	if (xAutorotate != 0) this.cx += xAutorotate;
	if (yAutorotate != 0) this.cy += yAutorotate;
	if (zAutorotate != 0) this.cz += zAutorotate;

};

RubiksCube.prototype.updateColors = function () {
	if (this.rotating) {
		return;
	}
	this.blocks.forEach(function (block) {
		var p = block.getPosition();
		var colors = this.flatCube.getColors(
			p.y < 0 ? 1 : p.y > 0 ? -1 : 0,
			p.x < 0 ? -1 : p.x > 0 ? 1 : 0,
			p.z < 0 ? -1 : p.z > 0 ? 1 : 0
		);
		block.updateColors(colors);
	}, this);
	if (!this.rotating) {
		this.updateCallbacks.forEach(function (f) { f(); });
	}
};

RubiksCube.prototype.render = function () {
	this.cameraAffine = makeRotationAffine(this.cameraX, this.cameraY, this.cameraZ);

	this.blocks.forEach(function (block) {
		block.setRotationAffine();
	});

	this.points.forEach(function (point) {
		point.projection();
	});

	this.faces.forEach(function (face) {
		face.distanceToCamera();
	});

	this.faces.sort(function (p0, p1) {
		return p1.distance - p0.distance;
	});

	this.ctx.fillStyle = "#fafafa";
	this.ctx.fillRect(0, 0, this.width, this.width);
	for (var i = 0; i < this.faces.length; i++) {
		this.faces[i].draw();
	}
};

RubiksCube.prototype.opposites = {
	'F': 'B',
	'B': 'F',
	'T': 'D',
	'D': 'T',
	'R': 'L',
	'L': 'R'
};

RubiksCube.prototype.rotateFace = function (face, d) {
	if (this.rotating)
		return;
	this.rotating = face;
	var blocks = this.getBlocks(face);
	var rotations = [];
	blocks.forEach(function (block) {
		rotations.push({
			rotateY: block.rotateY,
			rotateX: block.rotateX,
			rotateZ: block.rotateZ
		});
	})
	var me = this;

	var start = Date.now();

	var duration = Math.abs(d) * this.turnSpeed;

	var rotate = function () {
		var p = Math.min((Date.now() - start) / duration, 1);
		blocks.forEach(function (block, i) {
			if (face == 'F' || face == 'B' || face == 'Z')
				block.rotateX = rotations[i].rotateX + d * (Math.PI / 2) * p;
			if (face == 'U' || face == 'D' || face == 'Y')
				block.rotateY = rotations[i].rotateY + d * (Math.PI / 2) * p;
			if (face == 'L' || face == 'R' || face == 'X')
				block.rotateZ = rotations[i].rotateZ + d * (Math.PI / 2) * p;
		});
		if (p < 1)
			requestAnimationFrame(rotate);
		else {
			for (var i = 0; i < blocks.length; i++) {
				blocks[i].resetRotation();
			}
			me.rotating = false;
			me.update();
			me.makeNextMove();
		}
	}
	requestAnimationFrame(rotate);
}

RubiksCube.prototype.getBlocks = function (face) {
	var result = [];
	if (face == 'B') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().x < 0)
				result.push(block);
		});
	}
	else if (face == 'F') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().x > 0)
				result.push(block);
		});
	}
	else if (face == 'U') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().y < 0)
				result.push(block);
		});
	}
	else if (face == 'D') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().y > 0)
				result.push(block);
		});
	}
	else if (face == 'L') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().z < 0)
				result.push(block);
		});
	}
	else if (face == 'R') {
		this.blocks.forEach(function (block) {
			if (block.getPosition().z > 0)
				result.push(block);
		});
	} else if (face == 'X' || face == 'Y' || face == 'Z') {
		result = this.blocks;
	}
	return result;
};
RubiksCube.prototype.makeMoves = function (moves) {
	moves = moves.split(/\s/);
	for (var i = 0; i < moves.length; i++) {
		this.makeMove(moves[i]);
	}
}

RubiksCube.prototype.makeMove = function (move) {
	if (this.rotating) {
		this.queue.push(move);
		return;
	}
	this.moveHistory.push(move);
	var spin = 1;
	if (move[move.length - 1] == '2') {
		spin++;
		move = move.substr(0, move.length - 1);
	}
	switch (move.toLowerCase()) {
		case "f":
			this.rotateFace('F', -spin);
			break;
		case "f'":
			this.rotateFace('F', spin);
			break;
		case "r":
			this.rotateFace('R', -spin);
			break;
		case "r'":
			this.rotateFace('R', spin);
			break;
		case "u":
			this.rotateFace('U', spin);
			break;
		case "u'":
			this.rotateFace('U', -spin);
			break;
		case "d":
			this.rotateFace('D', -spin);
			break;
		case "d'":
			this.rotateFace('D', spin);
			break;
		case "b":
			this.rotateFace('B', spin);
			break;
		case "b'":
			this.rotateFace('B', -spin);
			break;
		case "l":
			this.rotateFace('L', spin);
			break;
		case "l'":
			this.rotateFace('L', -spin);
			break;
		case "x":
			this.rotateFace('X', spin);
			break;
		case "x'":
			this.rotateFace('X', -spin);
			break;
		case "y":
			this.rotateFace('Y', spin);
			break;
		case "y'":
			this.rotateFace('Y', -spin);
			break;
		case "z":
			this.rotateFace('Z', -spin);
			break;
		case "z'":
			this.rotateFace('Z', spin);
			break;
	}
};

RubiksCube.prototype.makeNextMove = function () {
	if (this.queue.length > 0)
		this.makeMove(this.queue.shift());
};

RubiksCube.prototype.getFaceColor = function (face) {

	function getOutside(c) {
		var index = -1;
		var max = 0;
		for (var i = 0; i < c.faces.length; i++) {
			p = averageUnRotatedPoints([c.faces[i].p0, c.faces[i].p1, c.faces[i].p2, c.faces[i].p3]);
			if (Math.abs(p.x) > max) {
				index = i;
				max = Math.abs(p.x);
			}
			if (Math.abs(p.y) > max) {
				index = i;
				max = Math.abs(p.y);
			}
			if (Math.abs(p.z) > max) {
				index = i;
				max = Math.abs(p.z);
			}
		}
		return c.faces[index].color;
	}

	switch (face) {
		case 'D':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x == 0 && p.y > 0 && p.z == 0);
			}));
		case 'U':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x == 0 && p.y < 0 && p.z == 0);
			}));
		case 'L':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x == 0 && p.y == 0 && p.z < 0);
			}));
		case 'R':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x == 0 && p.y == 0 && p.z > 0);
			}));
		case 'F':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x > 0 && p.y == 0 && p.z == 0);
			}));
		case 'B':
			return getOutside(arrayFind(this.blocks, function (block) {
				var p = block.getPosition();
				return (p.x < 0 && p.y == 0 && p.z == 0);
			}));
	}
}
RubiksCube.prototype.getCubie = function (position) {
	var cubes = this.getBlocks(position[0]);
	switch (position) {
		case "UF":
		case "DF":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z == 0 && p.x > 0;
			});
		case "UB":
		case "DB":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z == 0 && p.x < 0;
			});
		case "UR":
		case "DR":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z > 0 && p.x == 0;
			});
		case "UL":
		case "DL":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z < 0 && p.x == 0;
			});
		case "FR":
		case "BR":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z > 0 && p.y == 0;
			});
		case "FL":
		case "BL":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z < 0 && p.y == 0;
			});
		case "UFR":
		case "DRF":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z > 0 && p.x > 0;
			});
		case "URB":
		case "DBR":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z > 0 && p.x < 0;
			});
		case "UBL":
		case "DLB":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z < 0 && p.x < 0;
			});
		case "ULF":
		case "DFL":
			return arrayFind(cubes, function (c) {
				var p = c.getPosition();
				return p.z < 0 && p.x > 0;
			});
	}
}

RubiksCube.prototype.faceNames = ['L', 'U', 'D', 'B', 'F', 'R'];

RubiksCube.prototype.getState = function () {
	var me = this;
	var result = "";
	var cubicles = ["UF", "UR", "UB", "UL", "DF", "DR", "DB", "DL", "FR", "FL", "BR", "BL", "UFR", "URB", "UBL", "ULF", "DRF", "DFL", "DLB", "DBR"]
	var colorToFace = {};
	var faceToDirection = {
		'F': 'x',
		'B': 'x',
		'U': 'y',
		'D': 'y',
		'R': 'z',
		'L': 'z'
	};
	var getFaceColor = function (c, direction) {
		var result = null;
		var max = 0;
		c.faces.forEach(function (f) {
			p = averageUnRotatedPoints([f.p0, f.p1, f.p2, f.p3]);
			if (Math.abs(p[direction]) > max) {
				max = Math.abs(p[direction]);
				result = f.color;
			}
		});
		return result;
	}
	this.faceNames.forEach(function (face) {
		colorToFace[me.getFaceColor(face)] = face;
	});

	cubicles.forEach(function (cubicle) {
		var c = me.getCubie(cubicle);
		var cubieName = "";
		cubicle.split('').forEach(function (face) {
			var color = getFaceColor(c, faceToDirection[face]);
			cubieName += colorToFace[color];
		});
		result += cubieName + " ";
	})

	return result.trim();
}
