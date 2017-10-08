<?php

function getClass($className) {

	$s ="";
	
	$s .= "function $className(level, svgObject) {\n";
	$s .= "\n";
	$s .= "this.type = \"$className\";\n";
	$s .= "this.nr = this.count;\n";
	$s .= "$className.prototype.count++;\n";
	$s .= "\n";
	$s .= "C.call(this, level, svgObject);\n";
	$s .= "\n";
	
	chdir("$className");
	
	if(file_exists("ini.txt")) {
	
		$s .= file_get_contents("ini.txt");
		
	}
		
	$s .= "\n";
	$s .= "}\n";
	$s .= "\n";
	$s .= "$className.prototype = Object.create(C.prototype);\n";
	$s .= "$className.prototype.constructor = $className;\n";
	$s .= "$className.prototype.count = 0;";
	$s .= "\n\n";
	
	$myDirectory = opendir(".");

	while($entryName = readdir($myDirectory)) {
	
		$dirArray[] = $entryName;
	}

	closedir($myDirectory);

	$indexCount	= count($dirArray);

	sort($dirArray);

	for($index=0; $index < $indexCount; $index++) {
    
		if (substr("$dirArray[$index]", 0, 1) != "." && substr("$dirArray[$index]", 0, 7 ) != "ini.txt" && $dirArray[$index] != ($className . ".png")){
		
			$fileName = $dirArray[$index];
			$functionName = substr($fileName, 0, (strlen($fileName) - 4));
			
			$file = fopen($fileName, "r");
			
			$s .= "$className.prototype.$functionName = function" . fgets($file) . " {\n";
			
			while(!feof($file)) {
			
				$s .= fgets($file);
				
			}	

			fclose($file);
			
			$s .= "\n}\n\n";
		
		}
	}
	
	chdir("..");
	
	echo $s;
}

getClass($_POST["c"]);
?> 
