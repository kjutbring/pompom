/*
	pompompom.js

	timer to run a pomodoro timer

	author kjutbring
*/

var totalSec = 60 * 25;
var counter;

function init() {
	// get btns
	var startBtn = document.getElementById("start");
	var stopBtn = document.getElementById("stop");
	var resetBtn = document.getElementById("reset");

	startBtn.onclick = function() {
		pompomStart();
	}

	stopBtn.onclick = function() {
		pompomStop();
	}

	resetBtn.onclick = function() {
		pompomReset();
	}
};

function pompomStart() {
	counter = setInterval(pompomup, 1000);

	pompomup();
};

function pompomStop() {
	clearInterval(counter);
};

function pompomReset() {
	clearInterval(counter);
	totalSec = 	60 * 25;
	document.getElementById("min").innerHTML = Math.floor(totalSec / 60);
	document.getElementById("sec").innerHTML = totalSec % 60 + "0";
};

function pompomup() {
	totalSec = totalSec -1;

	if (totalSec <= 0) {
		clearInterval(counter);
		return;
	}

	document.getElementById("min").innerHTML = Math.floor(totalSec / 60);
	document.getElementById("sec").innerHTML = totalSec % 60;
}

window.onload = function() {
	init();
};

