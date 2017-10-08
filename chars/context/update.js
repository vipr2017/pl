(tick)

if(this.b != null) {

	try{
	var p = this.parent.parentNode;
	//p.removeChild(this.b.parentNode);
	//p.appendChild(this.b.parentNode);
	this.b.setAttribute("x", (this.x + this.transXCum - 10).toString());
	this.b.setAttribute("y", (this.y + this.transYCum - 40).toString());
	} catch(e) {alert(e);}
}