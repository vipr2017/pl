$(document).ready(function() {

	//check("car");

});

clicked = function() {

	check($("#c").val());

}

check = function(c) {

	var fileName = "chars/check.php";
	//alert(fileName);
	
	var d = {}; 
	d["c"] = c
	
	$.post(
	
		fileName, 
		d,
		function(data, textStatus, jqXHR) {
		
			//alert(data);
			
			try {
			
				eval(data);
				$("#r").html("Checked: " + c  + "<br/>Result: OK");
				
			} catch(e) {
			
				$("#r").html("Checked: " + c  + "<br/>Result: Error<br/>Reason: " + e.name + "&nbsp" + e.message);
			
			}
		
		}
		
	);

}