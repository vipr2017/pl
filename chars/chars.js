function conbox(level, svgObject) {

this.type = "conbox";
this.nr = this.count;
conbox.prototype.count++;

C.call(this, level, svgObject);


}

conbox.prototype = Object.create(C.prototype);
conbox.prototype.constructor = conbox;
conbox.prototype.count = 0;

function context(level, svgObject) {

this.type = "context";
this.nr = this.count;
context.prototype.count++;

C.call(this, level, svgObject);

//alert("context");
this.svgObject.style.cursor="pointer";
this.drag = true;
this.b = null;
}

context.prototype = Object.create(C.prototype);
context.prototype.constructor = context;
context.prototype.count = 0;

context.prototype.update = function(tick)
 {

if(this.b != null) {

	try{
	var p = this.parent.parentNode;
	//p.removeChild(this.b.parentNode);
	//p.appendChild(this.b.parentNode);
	this.b.setAttribute("x", (this.x + this.transXCum - 10).toString());
	this.b.setAttribute("y", (this.y + this.transYCum - 40).toString());
	} catch(e) {alert(e);}
}
}

function door(level, svgObject) {

this.type = "door";
this.nr = this.count;
door.prototype.count++;

C.call(this, level, svgObject);

this.svgObject.style.cursor="pointer";
}

door.prototype = Object.create(C.prototype);
door.prototype.constructor = door;
door.prototype.count = 0;

door.prototype.onclick = function()
 {

alert("Yes");
}

function dropje(level, svgObject) {

this.type = "dropje";
this.nr = this.count;
dropje.prototype.count++;

C.call(this, level, svgObject);


}

dropje.prototype = Object.create(C.prototype);
dropje.prototype.constructor = dropje;
dropje.prototype.count = 0;

dropje.prototype.drop = function(o)
 {

alert(o.id);
}

function label(level, svgObject) {

this.type = "label";
this.nr = this.count;
label.prototype.count++;

C.call(this, level, svgObject);

//alert("Start");
$("#i").html("<input id=\"answer\" type=\"text\" style=\"position:fixed;left:100;top:100;widht:300;height:20;z-index:9999\" size=25/>");
//alert("Stop");
}

label.prototype = Object.create(C.prototype);
label.prototype.constructor = label;
label.prototype.count = 0;

function man(level, svgObject) {

this.type = "man";
this.nr = this.count;
man.prototype.count++;

C.call(this, level, svgObject);

//alert("man");
}

man.prototype = Object.create(C.prototype);
man.prototype.constructor = man;
man.prototype.count = 0;

man.prototype.start = function()
 {

try {
var cbox = this.getObject("conbox"); 
var ctext = this.getObject("context");

var id = 1;

for(var y=200; y < 500; y += 100) {
var conbox_svg = cbox.svgObject.cloneNode(false);
conbox_svg.setAttribute("x", "200");
conbox_svg.setAttribute("y", y.toString());

var context_svg = ctext.svgObject.cloneNode(false);
context_svg.append("hans");
context_svg.setAttribute("x", "210");
context_svg.setAttribute("y", (y + 40).toString());

cbox.svgObject.parentNode.parentNode.appendChild(conbox_svg);
ctext.svgObject.parentNode.parentNode.appendChild(context_svg);

b = new conbox(this.level, conbox_svg);
t = new context(this.level, context_svg);
t.b = conbox_svg;
t.drag = true;
t.id = "context" + id.toString();

id++;
}

} catch(e) {alert(e);}
}

function rot(level, svgObject) {

this.type = "rot";
this.nr = this.count;
rot.prototype.count++;

C.call(this, level, svgObject);


}

rot.prototype = Object.create(C.prototype);
rot.prototype.constructor = rot;
rot.prototype.count = 0;

rot.prototype.start = function()
 {

//alert("Start");
this.c = 2;
}

rot.prototype.update = function(tick)
 {

if((s2t(this.c) % tick) == 0) {

	this.angle += 1;
	this.c += 2;

}

}

function sca(level, svgObject) {

this.type = "sca";
this.nr = this.count;
sca.prototype.count++;

C.call(this, level, svgObject);


}

sca.prototype = Object.create(C.prototype);
sca.prototype.constructor = sca;
sca.prototype.count = 0;

sca.prototype.animate = function()
 {

this.scale(1.001, 1.001);
}

sca.prototype.update = function(tick)
 {

if(s2t(2) < tick && s2t(4) > tick) {

	this.animate();

}

}

function trans(level, svgObject) {

this.type = "trans";
this.nr = this.count;
trans.prototype.count++;

C.call(this, level, svgObject);


}

trans.prototype = Object.create(C.prototype);
trans.prototype.constructor = trans;
trans.prototype.count = 0;

trans.prototype.animate = function()
 {

this.translate(1,0);
}

trans.prototype.mouseout = function()
 {

alert("Out");
}

trans.prototype.mouseover = function()
 {

alert("Over");
}

trans.prototype.update = function(tick)
 {

if(s2t(2) < tick && s2t(4) > tick) {

	this.animate();

}

}

