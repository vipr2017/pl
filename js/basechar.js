Function.prototype.bind = Function.prototype.bind || function(fixThis) {

	var func = this;

	return function() {

		return func.apply(fixThis, arguments)

	}
}

function C(level, svgObject) {
	
	this.level = level;
	this.svgObject = svgObject;
	this.id = this.svgObject.id;
	
	this.clamp = false;
	this.rotate = false;
	this.drag = false;
	this.firstDragMove = true;
	this.emuKey = null;
	this.turn = null;
	this.speed = 1.25;
	this.clipRect = null;
	this.anim = false;
	this.saying = false;
	this.player = false;
	this.spin = true;
	this.scaleString = "";
	this.scaleX = 1;
	this.scaleY = 1;
	
	try {
	
		this.href = this.svgObject.getAttribute("xlink:href");
		var res = this.href.match(/img\/.*$/);
		this.img = res;
		this.imgBase = this.href.match(/img\/\w*\./);
		this.imgExt = this.href.match(/\.\w*$/);
		//alert(this.imgExt);
		this.svgObject.setAttribute("xlink:href", res);
	
	} catch(err) {}
	
	this.parent = this.svgObject.parentNode;	
	var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
	this.parent.removeChild(this.svgObject);
	g.appendChild(this.svgObject);
	this.parent.appendChild(g);
	
	this.parent = this.svgObject.parentNode;
	
	this.parent.setAttribute("x", "0");
	this.parent.setAttribute("y", "0");
	
	this.width = parseFloat(this.svgObject.getAttribute("width"));
	
	if(this.width.toString() == "NaN") {
	
		this.spin = false;
	
	}
	
	this.height = parseFloat(this.svgObject.getAttribute("height"));
	this.x = parseFloat(this.svgObject.getAttribute("x"));
	this.y = parseFloat(this.svgObject.getAttribute("y"));
	this.mX = this.x + this.width/2;
	this.mY = this.y + this.height/2;
	
	this.svgBase = document.getElementById('svg2');
	this.svgPoint = this.svgBase.createSVGPoint();
	
	this.angle = 0;
	
	this.transX = 0;
	this.transY = 0;
	
	this.transXCum = 0;
	this.transYCum = 0;
	
	this.level.levelMessageArray.push(this);
	this.level.levelUpdateArray.push(this);
	this.level.levelDrawArray.push(this);
	this.level.levelRevMap[this.id] = this;
	
	this.svgObject.onmousemove = this.onMouseMove.bind(this);
	//this.svgObject.onmouseup = this.onMouseUp.bind(this);
	this.svgObject.onmouseup = this.onTouchEnd.bind(this);
	
	this.svgObject.addEventListener('touchmove', this.onTouchMove.bind(this), false);
	this.svgObject.addEventListener('touchend', this.onTouchEnd.bind(this), false);
	
	$(this.svgObject).on("touchstart", this.onTouchStart.bind(this));
	//$(this.svgObject).on("touchend", this.onTouchEnd.bind(this));
	//$(this.svgObject).mouseover(this.onTouchStart.bind(this));
	//$(this.svgObject).mouseout(this.onTouchEnd.bind(this));
	//alert(svgObject.id);
	$(this.svgObject).mouseover(this.mouseover.bind(this));
	$(this.svgObject).mouseout(this.mouseout.bind(this));
	$(this.svgObject).click(this.onclick.bind(this));
	
	
	
		
	this.animArray = new Array();
	this.animRow = 1;
	this.animLength = 2;
	this.animX = 1;
	this.animSpeed = 0.5;
	this.animCount = 0;
}

turn = 0;
asking = false;

C.prototype.mouseover = function() {

	return false;

}

C.prototype.onclick = function() {

	return false;

}

C.prototype.mouseout = function() {

	return false;

}

C.prototype.ask = function(x, y, txt, callBack) {

	asking = true;
	
	this.callBackQuestion = callBack;
			
	var box = "<div style=\"position:fixed;left:" + (x - 5).toString() + ";top:" + (y - 80).toString() +";width:250;height:140;z-index:9999;border: 2px solid #a1a1a1;border-radius: 25px;background-color: white;\" />"
	
	var text = "<div style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y - 50).toString() +";width:200;height:100;z-index:9999\">" + txt + "</div>"
	
	var input = "<input id=\"answer\" type=\"text\" style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y - 20).toString() +";widht:300;height:20;z-index:9999\" size=25/>"
	
	var button = "<button id=\"ab\" type=\"button\" style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y + 10).toString() +";widht:300;height:20;z-index:9999\">Esta bien</button>"
	
	var button2 = "<button id=\"cb\" type=\"button\" style=\"position:fixed;left:" + (x + 80).toString() + ";top:" + (y + 10).toString() +";widht:300;height:20;z-index:9999\">Cancelar</button>"
			
	$("#i").html(box+text+input+button+button2);
		
	$("#ab").on("click", this.ans.bind(this));
	$("#ab").on("tap", this.ans.bind(this));
	
	$("#cb").on("click", this.can.bind(this, txt));
	$("#cb").on("tap", this.can.bind(this, txt));
}

C.prototype.askText = function(x, y, width, height, txt, callBack) {

	asking = true;
		
	this.callBackQuestion = callBack;
	
	var box = "<div style=\"position:fixed;left:" + (x - 5).toString() + ";top:" + (y - 80).toString() +";width:" + (width*10).toString() + ";height:" + (160+height*10).toString() + ";z-index:9999;border: 2px solid #a1a1a1;border-radius: 25px;background-color: white;\" />"
	
	var text = "<div style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y - 50).toString() +";width:" + (width*10).toString() + ";height:100;z-index:9999\">" + txt + "</div>"
	
	var input = "<textarea id=\"answer\" cols=" + width.toString() + " rows=" + height.toString() + " style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y - 20).toString() +";z-index:9999\"></textarea>"
	
	var button = "<button id=\"ab\" type=\"button\" style=\"position:fixed;left:" + (x + 10).toString() + ";top:" + (y + 20 + height*10).toString() +";widht:300;height:20;z-index:9999\">Esta bien</button>"

	var button2 = "<button id=\"cb\" type=\"button\" style=\"position:fixed;left:" + (x + 80).toString() + ";top:" + (y + 20 + height*10).toString() +";widht:300;height:20;z-index:9999\">Cancelar</button>"
			
	$("#i").html(box+text+input+button+button2);
	
	$("#ab").on("click", this.ans.bind(this));
	$("#ab").on("tap", this.ans.bind(this));
	
	$("#cb").on("click", this.can.bind(this, txt));
	$("#cb").on("tap", this.can.bind(this, txt));
}

C.prototype.ans = function() {

	var answer = $("#answer").val();
	$("#i").empty();
	
	asking = false;
	
	try {
	
		this.callBackQuestion(answer);
	
	} catch(e) {}
	
	return false;
}

C.prototype.can = function() {

	$("#i").empty();
	
	asking = false;
	
	try {
	
		this.callBackQuestion("cancalled");
	
	} catch(e) {}
	
	return false;
}

C.prototype.say = function(x, y, width, height, txt, t) {
    
	if(!this.saying) {
		
		var box = "<div style=\"position:fixed;left:" + (x).toString() + ";top:" + (y).toString() +";width:" + width.toString() + ";height:" + height.toString() + ";z-index:9999;border: 2px solid #a1a1a1;border-radius: 25px;background-color: white;\" />"
				
		var text = "<div style=\"position:fixed;left:" + (x+10).toString() + ";top:" + (y+10).toString() +";width:" + (width-20).toString() + ";height:" + (height-20).toString() + ";z-index:9999\">" + txt + "</div>"
						
		$("#i").html(box+text);
		this.saying = true;
		this.sayInterval = setInterval(this.stopSaying.bind(this), t*1000);
	}
}

C.prototype.stopSaying = function() {

	this.saying = false;
	$("#i").empty();
	clearInterval(this.sayInterval);
}

C.prototype.setAnim = function(animName) {

	this.animRow = this.animArray[animName][0];
	this.animLength = this.animArray[animName][1];
	this.drawNow();
}

C.prototype.drawNow = function() {
		
	this.svgObject.setAttribute("xlink:href", this.imgBase + this.animRow.toString() + "." + this.animX.toString() + this.imgExt);
}

C.prototype.onTouchStart = function() {
		
	if(this.emuKey != null) {
	
		keystab[this.emuKey] = true;
		
	}
	
	if(this.turn != null) {
	
		turn = this.turn;
	
	}

	this.onclick();
	
	return false;
}

C.prototype.onTouchMove = function(event) {

	if(this.drag) {
	
		if(this.firstDragMove) { 
			
			var p = this.parent.parentNode;
			p.removeChild(this.parent);
			p.appendChild(this.parent);
			
			this.prevPosX = event.targetTouches[0].pageX;
			this.prevPosY = event.targetTouches[0].pageY;
			
			this.firstDragMove = false;
			
			return false;
	
		} else {
	
			var divX = event.targetTouches[0].pageX - this.prevPosX;
			var divY = event.targetTouches[0].pageY - this.prevPosY;
			
			this.prevPosX = event.targetTouches[0].pageX;
			this.prevPosY = event.targetTouches[0].pageY;
			
			this.transXCum += (divX/this.level.scaleX);
			this.transYCum += (divY/this.level.scaleY);
			
		}		
	}
	
	return false;

}

C.prototype.onTouchEnd = function(event) {

	if(this.emuKey != null) {
	
		keystab[this.emuKey] = false;
	
	}
	
	if(this.turn != null) {
	
		turn = 0;
	
	}
	
	//alert(this.drag);
	if(!this.drag) { return false; }

	this.firstDragMove = true;
	
	var x = this.prevPosX/this.level.scaleX;
	var y = this.prevPosY/this.level.scaleY;
	
	if(x.toString() != "NaN") {
	
		//alert(x + " " + y);
		
		for(i=0; i < this.level.levelUpdateArray.length; i++) {
	
			if(this.id != this.level.levelUpdateArray[i].id) {
			
				var xRec = this.level.levelUpdateArray[i].transXCum + this.level.levelUpdateArray[i].x;
				var yRec = this.level.levelUpdateArray[i].transYCum + this.level.levelUpdateArray[i].y;
				var widthRec = this.level.levelUpdateArray[i].width;
				var heightRec = this.level.levelUpdateArray[i].height;
				
				if(widthRec.toString() != "NaN") {
				
					//alert(xRec + " " + yRec + " " + widthRec + " " + heightRec);
					
					if((x > xRec && x < (xRec + widthRec)) && (y > yRec && y < (yRec + heightRec))) {
					
						try {
							
							//alert("Hit");
							this.level.levelUpdateArray[i].drop(this);
			
						} catch(err) {}
					
					} else {
					
						//alert("No Hit");
					
					}
					
				}
			
			}
	
		}		
	}
	
	/*
	
	try {
	
		var hit = this.svgBase.getIntersectionList(rect, this.svgBase);
		//alert("Hier");
		
	} catch(err) {}
	
	for(i=0; i < hit.length; i++) {
	
		if(hit[i].id != this.id) {
		
			try {
			
				this.level.levelRevMap[hit[i].id].drop(this);
			
			} catch(err) {}
		
		}	
	}
	
	*/
	
	return false;
}

C.prototype.onMouseMove = function(event) {

	if(this.drag && event.which == 1) {
	
		if(this.firstDragMove) { 
			
			var p = this.parent.parentNode;
			p.removeChild(this.parent);
			p.appendChild(this.parent);
			
			this.prevPosX = event.pageX;
			this.prevPosY = event.pageY;
			
			this.firstDragMove = false;
			
			return false;
	
		} else {
	
			var divX = event.pageX - this.prevPosX;
			var divY = event.pageY - this.prevPosY;
			
			this.prevPosX = event.pageX;
			this.prevPosY = event.pageY;
			
			this.transXCum += (divX/this.level.scaleX);
			this.transYCum += (divY/this.level.scaleY);
			
		}		
	}
	
	return false;
}

C.prototype.onMouseUp = function(event) {

	if(!this.drag) { return false; }

	this.firstDragMove = true;
	
	var rect = this.svgBase.createSVGRect();
	
	rect.x = event.pageX - 1;
	rect.y = event.pageY - 1;
	rect.width = 2;
	rect.height = 2;
	
	try {
	
		var hit = this.svgBase.getIntersectionList(rect, this.svgBase);
		
	} catch(err) {}
	
	for(i=0; i < hit.length; i++) {
	
		if(hit[i].id != this.id) {
		
			try {
			
				this.level.levelRevMap[hit[i].id].drop(this);
			
			} catch(err) {}
		
		}	
	}
	
	return false;
}

C.prototype.translate = function(x, y) {

	//alert(x + " " + y);
	this.transX = x;
	this.transY = y;
	this.draw();
	//$(this.svgObject).velocity( {translateX: [ x, x ]}, {duration:10000});
	
}

C.prototype.scale = function(xScale, yScale) {

	//alert("Scale");
	this.scaleX *= xScale;
	this.scaleY *= yScale;
	
	this.startScale(this.scaleX, this.scaleY);
	this.scaleString = "scale(" + (this.scaleX).toString() + "," + (this.scaleY).toString() + ")";
	//alert(this.scaleString);
	this.draw();

}

C.prototype.startScale = function(xScale, yScale) {
	
	var x = this.x/xScale;
	var y = this.y/yScale;
	
	this.svgObject.setAttribute("x", x.toString());
	this.svgObject.setAttribute("y", y.toString());	
}

C.prototype.inScale = function(elements, complete, remaining, start, tweenValue) {

	if(complete > 0) {
	
		$(this.svgObject).show();
	
	}	
}

C.prototype.completeScale = function(xScale, yScale) {

	$(this.svgObject).velocity("finish");
	$(this.svgObject).velocity( {scaleX: [ xScale, xScale ], scaleY: [ yScale, yScale ]}, {duration:10000});
}

C.prototype.draw = function() {

	if(this.anim) {
		
		if(this.animCount > this.animSpeed * 120) {
		
			this.animCount = 0;			
			this.animX++;
			
			if(this.animX > this.animLength) {
			
				this.animX = 1;

			} 
			
			this.svgObject.setAttribute("xlink:href", this.imgBase + this.animRow.toString() + "." + this.animX.toString() + this.imgExt);
		}
		
		this.animCount++;
	}
	
	if(this.rotate) {
	
		if(com.multi) {
		
			if(com.started) {
			
				this.angle += mouse.xF;
			}
		
		} else {
	
			this.angle += mouse.xF;	
			
		}		
	}
	
	if(this.angle > 360) {
	
		this.angle = this.angle - 360;
	
	}
	
	if(this.angle < 0) {
	
		this.angle = this.angle + 360;
	
	}
	
	var m = this.svgBase.createSVGMatrix();
	var m1 = m.rotate(this.angle);
	
	var m2 = m.translate(this.transX, this.transY);
	
	this.svgPoint.x = 0;
	this.svgPoint.y = 0;
	
	var trans = this.svgPoint.matrixTransform(m2);
	trans = trans.matrixTransform(m1);
	
	this.transXCum += trans.x;
	this.transYCum += trans.y;

	var transform = "translate(" + this.transXCum.toString() + " " + this.transYCum.toString() + ") " + this.scaleString;
	this.parent.setAttribute("transform", transform);
	
	if(this.clamp) {
	
		this.level.transformLayer((-1*trans.x), (-1*trans.y));
		
	}
	
	if(this.spin) {
	
		this.svgObject.setAttribute("transform", "rotate(" + this.angle + " " + this.mX + " " + this.mY + ")");
		
	}
	 
	if(com.multi && com.started && this.nr == com.id && this.player) {
	
		com.send("t" + "," + this.nr.toString() + "," + this.transXCum.toString() + "," + this.transYCum.toString() + "," + this.angle.toString());
		
	}
		
	this.transX = 0;
	this.transY = 0;
}

C.prototype.peek = function(direction) {
	
	var xT = 0;
	var yT = 0;
	
	if(direction == "right") {
	
		xT = this.speed;
	
	}
	
	if(direction == "left") {
	
		xT = -1*(this.speed);
	
	}
	
	if(direction == "down") {
	
		yT = this.speed;
	
	}
	
	if(direction == "up") {
	
		yT = -1*(this.speed);
	
	}
	
	var m = this.svgBase.createSVGMatrix();
	var m1 = m.rotate(this.angle);
	
	var m2 = m.translate(xT, yT);
	
	this.svgPoint.x = 0;
	this.svgPoint.y = 0;
	
	var trans = this.svgPoint.matrixTransform(m2);
	trans = trans.matrixTransform(m1);
	
	if(this.clamp) {
	
		var rect = this.svgBase.createSVGRect();
		rect.x = this.x + trans.x;;
		rect.y = this.y + trans.y;;
		rect.width = 64;
		rect.height = 64;
		
	} else {
	
		var rect = this.svgBase.createSVGRect();
		rect.x = this.x + this.transXCum + trans.x;
		rect.y = this.y + this.transYCum + trans.y;
		rect.width = 64;
		rect.height = 64;
	}
	
	for(i=0; i < this.level.levelDrawArray.length; i++) {
	
		var o = this.level.levelDrawArray[i];
		
		if(o != this) {
		
			try {
	
				var hit = this.svgBase.getIntersectionList(rect, o.svgObject.parentNode);
				
				if(hit.length > 0) {
					
					try { 
					 
						this.col(o);
						
					} catch(e) {}
					
					try { 
					
						o.col(this); 
						
					} catch(e1) {}
					
					if(com.multi && com.started && this.nr == com.id && this.player) {
	
						com.send("c" + "," + this.nr.toString() + "," + o.id);
		
					}
					
					return(o);				
				}
		
			} catch(err) {}		
		}
	}
	
	svgLayer = $("#layer4").get(0);
		
	if(svgLayer.childNodes.length == 0) {
	
		var o = new Object();
		o.type = "space";
		return(o);
	
	}
	
	try {
	
		var hit = this.svgBase.getIntersectionList(rect, svgLayer);
		
	} catch(err) {}
	
	if(hit.length > 0) {
	
		var o = new Object();
		o.type = "build";
	
	} else {			
	
		var o = new Object();
		o.type = "space";			
	}	
	
	return(o);
}

C.prototype.move = function(direction) {

	if(direction == "right") {
	
		this.transX += this.speed;
	}
	
	if(direction == "down") {
		
		this.transY += this.speed;
	}
	
	if(direction == "left") {
	
		this.transX -= this.speed;
	}
	
	if(direction == "up") {
		
		this.transY -= this.speed;
	}
}

C.prototype.keyUp = function(key) {

	if(typeof keystab[key] == 'undefined') {
  
		keystab[key] = false;
		
	} 
	
	return(!(keystab[key]));
}

C.prototype.keyDown = function(key) {

	if(typeof keystab[key] == 'undefined') {
 
		keystab[key] = false;
		
	} 
	
	return(keystab[key]);
}

C.prototype.update = function() {

}

C.prototype.getText = function(css, id, x, y, text) {

	var st = document.getElementById(css);	
	var clone = st.cloneNode(false);
	$(clone).append(text);
	$(clone).attr("x", (this.x + this.transXCum + x).toString());
	$(clone).attr("y", (this.y + this.transXCum + y).toString());
	$(clone).attr("id", id);
	$(clone).css("cursor", "default");
	this.parent.parentNode.appendChild(clone);
	return clone;
	
}

C.prototype.setPos = function(x, y) {

	this.transXCum = x;
	this.transYCum = y;
}

C.prototype.getObject = function(id) {

	return this.level.levelRevMap[id];

}