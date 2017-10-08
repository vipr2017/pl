()

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