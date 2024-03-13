function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function mixColor(oldColor, strength = 1) {

	if(strength < 1) {
		let percent = Math.ceil(strength * 100);
		// console.log("percent", percent)
		if(randInt(0, 100) > percent) {
			return oldColor
		}
		strength = 1;
	}

	let rgb = oldColor.replace(/[^\d,]/g, '').split(',');
	let shift = randInt(-1 * strength, strength);
	let part = randInt(0, 2);

	rgb[part] = parseInt(rgb[part]) + shift;

	if(rgb[part] > 255 || rgb[part] < 0) {
		rgb[part] += shift * -2;
	}

	rgb[part] = rgb[part].toString();

	return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";
}
function colorGrad(oldColor, vec=[5,5,5]) {
	let rgb = oldColor.replace(/[^\d,]/g, '').split(',');
	for(let i = 0; i < 3; i++) {
		rgb[i] = parseInt(rgb[i]) + vec[i];
		if(rgb[i] > 255 || rgb[i] < 0) {
			rgb[i] += vec[i] + -2;
		}
	}
	return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";
}

class Scene {
	constructor(canvas) {
		this.canvas = canvas;
		this.width = canvas.width;
		this.height = canvas.height;
		this.particles = [];
	}

	update() {
		for(let p of this.particles) {
			p.update(this.canvas);
		}
	}
}

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	update(canvas) {
		this.x += randInt(-1, 1);
		this.y += randInt(-1, 1);

		if(this.x > (canvas.width / 10)) {
			this.x = (canvas.width / 10);
		} else if(this.x < 0) {
			this.x = 0;
		}
		if(this.y >= (canvas.height / 10)) {
			this.y = (canvas.height / 10);
		} else if(this.y < 0) {
			this.y = 0;
		}


		let pixel = canvas.getContext("2d").getImageData(this.x * 10, this.y * 10, 1, 1).data;
		let color = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";

		color = colorGrad(color);

		drawRect({context:canvas.getContext("2d"), x:this.x * 10, y:this.y * 10, width:10, height:10, color:color})
	}
}

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

function main() {
	drawRect({context: context, x:0, y:0, width:canvas.width, height:canvas.height, color:"rgb(30, 30, 25)"})
	let theScene = new Scene(canvas);

	theScene.particles.push(new Particle(20, 20));

	let ptr = setInterval(function() {theScene.update()}, 1);
	
} main();
