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
	
	if(file_exists("ini.js")) {
	
		$s .= file_get_contents("ini.js");
		
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
    
		if (substr("$dirArray[$index]", 0, 1) != "." && substr("$dirArray[$index]", 0, 6 ) != "ini.js" && $dirArray[$index] != ($className . ".png")){
		
			$fileName = $dirArray[$index];
			$functionName = substr($fileName, 0, (strlen($fileName) - 3));
			
			$file = fopen($fileName, "r");
			
			$s .= "$className.prototype.$functionName = function" . fgets($file) . " {\n";
			
			while(!feof($file)) {
			
				$s .= fgets($file);
				
			}	

			fclose($file);
			
			$s .= "\n}\n\n";
		
		}
	}

	//nl2br($s);
	//echo $s;
	
	chdir("..");
	
	$fp = fopen("chars.js", "a");	
	fputs($fp, $s);	
	fclose($fp);

}

function getClasses() {

	unlink("chars.js");

	$myDirectory = opendir(".");

	while($entryName = readdir($myDirectory)) {
	
		$dirArray[] = $entryName;
	}

	closedir($myDirectory);

	$indexCount	= count($dirArray);

	sort($dirArray);

	for($index=0; $index < $indexCount; $index++) {
    
		if (substr("$dirArray[$index]", 0, 1) != "." && substr("$dirArray[$index]", 0, 5 ) != "index" && substr("$dirArray[$index]", 0, 8 ) != "getchars" && substr("$dirArray[$index]", 0, 5 ) != "check") {
		
				getClass($dirArray[$index]);
		
		}
	}
}

function getClassesList() {

	unlink("getchars.txt");

	$myDirectory = opendir(".");

	while($entryName = readdir($myDirectory)) {
	
		$dirArray[] = $entryName;
	}

	closedir($myDirectory);

	$indexCount	= count($dirArray);

	sort($dirArray);

	$s = "";
	
	for($index=0; $index < $indexCount; $index++) {
    
		if (substr("$dirArray[$index]", 0, 1) != "." && substr("$dirArray[$index]", 0, 5 ) != "index" && substr("$dirArray[$index]", 0, 8 ) != "chars.js" && substr("$dirArray[$index]", 0, 8 ) != "getchars" && substr("$dirArray[$index]", 0, 5 ) != "check"){
		
			if($s == "") {
			
				$s .= $dirArray[$index];
				
			} else {
			
				$s .= "," . $dirArray[$index];
				
			}
		}
	}
	
	$fp = fopen("getchars.txt", "w");	
	fputs($fp, $s);	
	fclose($fp);
}

getClasses();
getClassesList()
?> 
