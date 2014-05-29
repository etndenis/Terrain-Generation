var canvas,
	ctx, 
	terrain, //2D array for heights
	size,
	waterLevel,
	height,
	pMap;
	 //Var for changing init map size

function init(){
	//get canvas element
	canvas = document.getElementById("canvas");
	//set up ctx
	if(canvas.getContext)
		ctx = canvas.getContext("2d");
	
	 ctx.imageSmoothingEnabled = false; //Best for pixel based graphics to prevent blurring
	//initilize vars
	size = 1025;
	terrain = new Array(size);

	//create 2d aray by iterating through 1d array
  	for (var x = 0; x < terrain.length; x++) {
    	terrain[x] = new Array(size);
    	for (var y = 0; y<terrain[x].length; y++){
    		terrain[x][y] = 0; 
    	}
  	}
  	pMap = new Array(size);

  	for (var x = 0; x < pMap.length; x++) {
    	pMap[x] = new Array(size);
    	for (var y = 0; y<pMap[x].length; y++){
    		pMap[x][y] = 0; 
    	}
  	}
  	//console.log(terrain)
  	//SETTING "SEEED" VALUES (four corners)
  	terrain[0][0]=50+Math.floor(Math.random()*100-50);
  	//top left
  	terrain[0][terrain[0].length-1]=50+Math.floor(Math.random()*100-50);
  	//top right
  	terrain[terrain.length-1][0]=50+Math.floor(Math.random()*100-50);
  	//bottom left
  	terrain[terrain.length-1][terrain[0].length-1]=50+Math.floor((Math.random()*100-50)*100)/100;
  	//bottom right

  //first recurive call
  diamond_square(size,1000);
  //particleMap(300000);
  //particlePostProcessing();
  for (var i = terrain.length - 1; i >= 0; i--) {
  	console.log("" + pMap[i])
  };
  //visualization of result
  drawTerrain();

}

function particleMap(particle){

	
	for (var i = particle; i >= 0; i--) {
		var pX = Math.floor(Math.random()*12+size/2-6),
			pY = Math.floor(Math.random()*12+size/2-6);

		do{
			
			var	rollLeft = pMap[pX][pY]>pMap[pX-1][pY],
				rollRight = pMap[pX][pY]>pMap[pX+1][pY],
				rollUp = pMap[pX][pY]>pMap[pX][pY-1],
				rollDown = pMap[pX][pY]>pMap[pX][pY+1];

			var pick = false;

			pMap[pX][pY]++;
			
			while((rollLeft||rollRight||rollDown||rollUp)&&!pick){

				var randy = Math.random();
				pick = true;
				if (randy<.25&&rollLeft) {
					pX--;
				}
				else if (randy>.25 && randy< .5 &&rollRight) {
					pX++;
				}
				else if (randy>.5&& randy< .75 &&rollUp) {
					pY--;
				}
				else if (randy<.75&&rollDown) {
					pY++;
				}
				else 
					pick = false;
			}
		}
		while((rollDown||rollUp||rollRight||rollLeft)&&pX<pMap.length-1&&pX>0&&pY<pMap.length-1&&pY>0);
	}
}

function particlePostProcessing(){
	var biggest = 0;
	for (var x = pMap.length - 1; x >= 0; x--) {
		for (var y = pMap.length - 1; y >= 0; y--) {
			if(pMap[x][y]>biggest)
				biggest = pMap[x][y];
		};
	};
	for (var x = pMap.length - 1; x >= 0; x--) {
		for (var y = pMap.length - 1; y >= 0; y--) {
			terrain[x][y]*=(pMap[x][y]/(biggest+10));
		}
	}
}

function diamond_square(size, smooth){
	//console.log("WHAT THE FUCK")
	//console.log(terrain)
	//console.log("size= " + size + " x: " + x + " y " + y);
	//CENTER
	var squareStep = false;
	for (var x = terrain.length - 1; x >= size-1; x = x-size+1) {
		//console.log(terrain);
		for (var y = terrain[x].length - 1; y >= size-1; y = y-size+1) {
	//console.log(size + " x" + x  + " y " + y);
	//console.log(x-size+1)
	//console.log(y-size+1)
	// /console.log(terrain)
	//
	//console.log("x "  + x + " y " + y + " " + (x-(size-1)/2-size+1) )
			var tl = terrain[x-size+1][y-size+1],
				tr = terrain[x][y-size+1],
				bl = terrain[x-size+1][y],
				br = terrain[x][y],

				c = terrain[x-(size-1)/2][y-(size-1)/2],

				cl = (x-(size-1)/2-size+1 >= 0) ? terrain[x-(size-1)/2-size+1][y-(size-1)/2] : c,//left neighbor center
				cr = (x+(size-1)/2 < terrain.length) ? terrain[x+(size-1)/2][y-(size-1)/2] : c,//right center neighbor
				cb = (y+(size-1)/2 < terrain.length) ? terrain[x-(size-1)/2][y+(size-1)/2] : c,//bottom neighbor center
				ct = (y-(size-1)/2-size+1 >= 0) ? terrain[x-(size-1)/2][y-(size-1)/2-size-1] : c;//top neighbor center

			if (!squareStep){
				//console.log(x+" " +y)
				terrain[x-(size-1)/2][y-(size-1)/2] = (br + bl + tr + tl)/4+Math.floor((Math.random()*smooth-smooth/2)*100)/100;
			}
			//console.log(terrain[x+(size-1)/2][y+(size-1)/2])
			

			if(squareStep){
				//console.log("yippee")
				terrain[x-(size-1)/2][y] = (br+bl+c+cb)/4+Math.random()*smooth-smooth/2; //MID X, Y 0
				//MID Y, X 0 
				terrain[x][y-(size-1)/2] = (br+tr+c+cr)/4+Math.random()*smooth-smooth/2;
				//MID X BOTTOM Y
				terrain[x-(size-1)/2][y-size-1] = (tr+tl+c+ct)/4+Math.random()*smooth-smooth/2;
				//MID Y left
				terrain[x-size+1][y-(size-1)/2] = (bl+tl+c+cl)/4+Math.random()*smooth-smooth/2;

			}

			if (x == size-1 && y == size-1 && !(squareStep))	 {	
				squareStep = true;
				x = terrain.length - 1;
				y = terrain[x].length -1;
			};
		};
	};
	if (size>3){
		//QUADRANT 1
		diamond_square((size-1)/2+1, smooth*.7);
	}

}

/*console.log(randy(124.03241,1.12933123))
function randy(x,y){
	n = x + y * 57
    n = (n<<13) ^ n;
    return ( 1.0 - ( (n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);     
}*/
function sortNumber(a,b) {
    return a - b;
}

function waterLevel(){
	var temp = [];
	for (var i = terrain.length - 1; i >= 0; i--) {
		for (var y = terrain[i].length - 1; y >= 0; y--) {
			temp.push(terrain[i][y]);
		};
	};
	temp.sort(sortNumber);
	height = temp[temp.length-1]
	waterLevel = temp[Math.floor(temp.length*.6)]
}

function drawTerrain(){
	waterLevel();
	console.log(height)
	for (var x = 0; x < terrain.length; x++) {

    	for (var y = 0; y<terrain[x].length; y++){

    		if(terrain[x][y]>(height-waterLevel)*.6+waterLevel){
    			ctx.fillStyle = "white";}

    		else if(terrain[x][y]>(height-waterLevel)*.4+waterLevel){
    			ctx.fillStyle = "bebebe";}

    		else if (terrain[x][y]>(height-waterLevel)*.25+waterLevel){
				ctx.fillStyle = "green"}

			else if(terrain[x][y]>(height-waterLevel)*.05+waterLevel){
				ctx.fillStyle = "6b8e23"}

    		else if(terrain[x][y]>waterLevel){
	    			ctx.fillStyle = "yellow";}

    		else if(terrain[x][y]<waterLevel){
    			ctx.fillStyle = "rgba(0,0,255,100)";}

    		if(terrain[x][y]==0)	
    			ctx.fillStyle = "black";

    		

    		ctx.fillRect(x*2049/size,y*2049/size,2049/size,2049/size);
    		terrain[x][y] = Math.floor(terrain[x][y]);
    	}
    	//console.log(terrain[x]);	
  }
}