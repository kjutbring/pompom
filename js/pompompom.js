/*
	pompompom.js

	pomodoro timer for add kids like me

	- TODO
		webkit notification
			- display (done)
			- close on click (done)
			- start new pompom on click (done)
		progress bar(?)
		firebase
			- login (done)
			- logout/terminate session (done)
			- write to firebase at completed pompom
			- get statistics from firebase

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
	var logoutBtn = document.getElementById("logout");

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

	logoutBtn.onclick = function() {
		pompomLogout();
	}

	ref = new Firebase("https://pompomodoro.firebaseio.com/pompompom");
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

		pompomAdd();

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

	notification.onclick = function() {
		window.focus();
		pompomReset();
		pompomStart();
		this.cancel();
	}
}

function pompomRandom() {
	var pompomStr = "";
	var pomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!¤%&/()=?@£€{}";

	for (var i = 0; i <10; i++) {
		pompomStr += pomChars.charAt(Math.floor(Math.random() * pomChars.length));
	}

	return(pompomStr);
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

				document.getElementById("loginForm").style.display = "none";
				document.getElementById("logout").style.display = "block";

				if (document.getElementById("invalid").style.display = "block") {
					document.getElementById("invalid").style.display = "none";
				}
			}
	});
}

function pompomLogout() {
	ref.unauth();

	document.getElementById("logout").style.display = "none";
	document.getElementById("loginForm").style.display = "block";

}

function pompomAdd() {
	var pompomRef = ref.child("pompoms");
	var pompomDate = new Date();
	var pompomId = pompomRandom();
	alert(pompomId);

	pompomRef.child(pompomId).set({
			year: pompomDate.getFullYear(),
			month: pompomDate.getMonth() + 1,
			day: pompomDate.getDay(),
			hour: pompomDate.getHours(),
			min: pompomDate.getMinutes()
	});

}

window.onload = function() {
	init();
	checkNotificationPerm();
};

