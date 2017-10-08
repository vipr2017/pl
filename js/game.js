Function.prototype.bind = Function.prototype.bind || function(fixThis) {

	var func = this;

	return function() {

		return func.apply(fixThis, arguments)

	}
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function s2t(sec) {

	return Math.round( sec*120 );

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var LevelManager = (function () {
    
	var instance;
 
    function createInstance() {
        var object = new Object("I am the instance");
		object.startLevel = function(level) {
			this.currentLevel = new Level(level);
			
		}
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

function Level(level) {

	this.id = level;
	this.tick = 0;
	
	this.transX = 0;
	this.transY = 0;
	
	$(window).keydown(function(event){
	
		var keycode = (event.keyCode ? event.keyCode : event.which);
		keystab[String.fromCharCode(keycode)] = true;
		
	});
	
	$(window).keyup(function(event){
	
		var keycode = (event.keyCode ? event.keyCode : event.which);
		keystab[String.fromCharCode(keycode)] = false;
		
	});
	
	/*
	$(window).on("swipe", function(event) {
	
		//alert(swipeDistance);
		mouse.xF = swipeDistance/10; 
		
		return false;
	
	});
	*/
	
	$(window).mousemove(this.xF.bind(this));	
	
	this.getSVG(level);
	//this.getChars(level);
}

Level.prototype.getSVG = function(level) {

	var d = new Date();
	var fileName = "levels/level" + level + ".svg?" + d.getTime();
	$("#c").load(fileName, this.gotSVG.bind(this));
		
}

Level.prototype.gotSVG = function() {
	
	var objects = $("*[id*=image]");
	
	for(i=0; i < objects.length; i++) {
			
		try {
	
			var href = objects[i].getAttribute("xlink:href");
			var res = href.match(/img\/.*$/);
			objects[i].setAttribute("xlink:href", res);
	
		} catch(err) { alert(err); }
	
	}
	
	this.getChars(this.id);
}

Level.prototype.xF = function(event) {

	mouse.prevX = mouse.x
	mouse.x = event.pageX;
	mouse.xF = mouse.x - mouse.prevX;
	
	return false;
}

Level.prototype.getChars = function(level) {
	
	var fileName = "chars/getchars.txt";
	
	var d = {}; 
	d["dummy"] = "dummy"
	
	$.post(
	
		fileName, 
		d,
		this.gotChars.bind(this)
		
	);
}

Level.prototype.gotChars = function(data, textStatus, jqXHR) {
		
	this.levelMessageArray = new Array();
	this.levelUpdateArray = new Array();
	this.levelDrawArray = new Array();
	this.levelRevMap = new Object();
	
	com.setLevelRevMap(this.levelRevMap);
	
	var chars = data.split(",");
	
	for(i=0; i < chars.length; i++) {
			
		var objects = $("*[id*=" + chars[i] + "]");
		
		for(j=0; j < objects.length; j++) {
		
			var s = "new " + chars[i] + "(this, objects.get(j));";
			eval(s);
		
		}
	
	}
	
	for (var key in this.levelRevMap) {
	
		 try { this.levelRevMap[key].start(); } catch(err) {}
	
	}

	this.layer = $("#layer2");
	setInterval(this.loop.bind(this), 1000/120);
}

Level.prototype.transformLayer = function(x, y) {

	this.transX += x;
	this.transY += y;
	
	var transform = "translate(" + this.transX.toString() + " " + this.transY.toString() + ")";
	this.layer.attr("transform", transform);
}

Level.prototype.loop = function() {
	
	if(asking) { return; };
	
	this.tick++;
	
	for(j=0; j < this.levelUpdateArray.length; j++) {
	
		this.levelUpdateArray[j].update(this.tick);
	
	}	
	
	for(i=0; i < this.levelDrawArray.length; i++) {
	
		if(com.multi) {
		
			if(com.started) {
			
				if(this.player) {
				
					if(this.levelDrawArray[i].nr == com.id) {
				
						this.levelDrawArray[i].draw();
				
					}
					
				} else {
				
					this.levelDrawArray[i].draw();
				
				}				
			}	

		} else {
		
			this.levelDrawArray[i].draw();
		
		}	
	}	
	
	mouse.xF = turn;
}

Level.prototype.send = function(message, parms) {
	
	for(x=0; x < this.levelMessageArray.length; x++) {
	
		try {
				this.levelMessageArray[x][message](parms);
				
		} catch(err) {}
	}
}

$(document).ready(function() {

	$.support.cors=true;	
	$.mobile.allowCrossDomainPages = true;
	document.body.addEventListener('touchmove', function(event) { event.preventDefault(); }, false);
	
	$.event.special.swipe.handleSwipe = function( start, stop ) {
	
		if ( 
	
			stop.time - start.time < $.event.special.swipe.durationThreshold &&
			Math.abs( start.coords[ 0 ] - stop.coords[ 0 ] ) > $.event.special.swipe.horizontalDistanceThreshold &&
			Math.abs( start.coords[ 1 ] - stop.coords[ 1 ] ) < $.event.special.swipe.verticalDistanceThreshold 
			
			) {
 
				swipeDistance = stop.coords[0] - start.coords[0];
				
				start.origin.trigger( "swipe" ).trigger( start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight" );					
		}
	}
	
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.appVersion) ) {
	
		$(document).bind('deviceready', function() {
	
			//var options = { frequency: 1000/120 };
			//var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
				
			new Game();
			
		}); 

	} else {
	
		new Game();
	}
		
});

accY = 0;

function onSuccess(acc) {

	accY = acc.y;

    $("#m").html(accY);
};

function onError() {
    alert('onError!');
};

var keystab = new Array();
var border = new Object();
border.type = "border";
 
var mouse = new Object();

mouse.prevX = 0;
mouse.x = 0;
mouse.xF = 0;

var players = new Array();

function Com() {

	this.name = "";
	this.multi = false;
	this.id = 0;
	this.started = false;
	
}

Com.prototype.start = function() {

	this.ws = new WebSocket("ws://goloca.org:8080/echo");
	
	this.ws.onopen = this.onOpen.bind(this);
	this.ws.onmessage = this.onMessage.bind(this);
	this.ws.onclose = this.onClose.bind(this);

}

Com.prototype.onOpen = function() {

	this.ws.send("c#" + this.name);
}

Com.prototype.onMessage = function(evt) {

	var data = evt.data.split("#");
	
	if(data[0] == "c") {
	
		this.gid = data[1];
		this.id = data[2];
		$("#m").html(this.id);
		return;	
	}
	
	if(data[0] == "l") {
	
		this.list = data[1];		
		return;
	}
	
	if(data[0] == "d") {
	
		alert(data[1] + " left");
		return;
	}
	
	if(data[0] == "s") {
	
		this.started = true;
		players[com.id].rotate = true;
		alert("started");
		return;
	}
		
	dA = evt.data.split(",");	
	
	if(dA[0] == "t") {
	
		var p = parseInt(dA[1]);
		var x = parseFloat(dA[2]);
		var y = parseFloat(dA[3]);
		var a = parseFloat(dA[4]);
		
		players[p].transXCum = x;
		players[p].transYCum = y;
		players[p].angle = a;
		players[p].draw();
	
	}
	
	if(dA[0] == "c") {
	
		var p = parseInt(dA[1]);
		var id = dA[2];
				
		try {
		
			this.levelRevMap[id].col(players[p]);

		} catch(e) {}
		
		try {
		
			players[p].col(this.levelRevMap[id]);

		} catch(e1) {}
	
	}
	
}

Com.prototype.onClose = function() {

	alert("closed");
}

Com.prototype.send = function(text) {

	this.ws.send("f#" + this.gid + "#" + text);
}

Com.prototype.setLevelRevMap = function(levelRevMap) {

	this.levelRevMap = levelRevMap;
}

com = new Com();

function Game() {
	
	$("#start").on("tap", this.start.bind(this));
 
}

Game.prototype.start = function() {

	$("#start").hide();	
	
	if(com.multi) {
	
		while(com.name == "" || com.name == null) {
	
			com.name = prompt("Please enter your name", "");
		
		}
	
		com.start();
	
	}
	
	LevelManager.getInstance().startLevel(1);
	
	return false;
}
