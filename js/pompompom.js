/*
	pompompom.js

	timer to run a pomodoro timer

	- TODO
		toast notification (partly done)
		progress bar(?)
		firebase 

	author kjutbring
*/

/* 
	timer logic below
*/

var totalSec = 3;
var noSpeed = 0;
var counter;
var amountPoms;
var ref;

function init() {
	// get btns
	var startBtn = document.getElementById("start");
	var stopBtn = document.getElementById("stop");
	var resetBtn = document.getElementById("reset");
	var loginBtn = document.getElementById("login");

	startBtn.onclick = function() {
		pompomStart();
	}

	stopBtn.onclick = function() {
		pompomStop();
	}

	resetBtn.onclick = function() {
		pompomReset();
	}

	loginBtn.onclick = function() {
		pompomLogin();
	}

	ref = new Firebase("https://pompomodoro.firebaseio.com");
	
};

function pompomStart() {

	if (noSpeed == 0) {
		clearInterval(counter);
		counter = setInterval(pompomup, 1000);
		pompomup();
		noSpeed = 1;
	}
};

function pompomStop() {
	clearInterval(counter);
	noSpeed = 0;
};

function pompomReset() {
	clearInterval(counter);
	totalSec = 	60 * 25;
	noSpeed = 0;
	document.getElementById("success").style.display = "none";
	document.getElementById("min").innerHTML = Math.floor(totalSec / 60);
	document.getElementById("sec").innerHTML = totalSec % 60 + "0";
};

function pompomup() {
	totalSec = totalSec -1;

	if (totalSec <= 0) {
		// fulhack below
		document.getElementById("min").innerHTML = "00";
		document.getElementById("sec").innerHTML = "00";

		makeNotification();

		totalSec = 25 * 60;
		pompomStop();

		document.getElementById("success").style.display = "block";
		return;
	}
	
	// add 0 before if needed
	if (Math.floor(totalSec / 60) < 10) {
		document.getElementById("min").innerHTML = "0" + Math.floor(totalSec / 60);
	}
	else {
		document.getElementById("min").innerHTML = Math.floor(totalSec / 60);
	};

	if (totalSec % 60 < 10) {
		document.getElementById("sec").innerHTML = "0" + totalSec % 60;
	}
	else {
		document.getElementById("sec").innerHTML = totalSec % 60;
	};
}

function checkNotificationPerm() {
	if (!window.webkitNotifications || window.webkitNotifications.checkPermission() == 0) {
		return;
	}
	else {
		window.webkitNotifications.requestPermission();
	}
}

function makeNotification() {
	var notification = new Notification("Pomodoro completed!", {
		body: "Click me to start a new pomodoro!"
	});
}


/*
	firebase shizzle below 
*/

function pompomLogin() {
	var inEmail = document.getElementById("inputEmail").value;
	var inPassword = document.getElementById("inputPassword").value;

	ref.authWithPassword({
		email : inEmail,
		password : inPassword
		}, function(error, authData) {
			if (error) {
				console.log("Login Failed!", error);
				document.getElementById("invalid").style.display = "block";
			} else {
				console.log("Authenticated successfully with payload:", authData);

			}
	});
}


window.onload = function() {
	init();
	checkNotificationPerm();
};

