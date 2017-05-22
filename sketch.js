//Tuckers Temple Level Editor
var prefabSize = 100;
var tileSize = 100;
var dragging = false;
var prefabOffset = -20;
var prefabTileOffset = 10;
var currDrag;
var numCols = 3;
var numRows = 3;
var tileGrid = [];
var json;
var actors = [];
var statics = [];
var prefabs;
var cRC = [];
var assetPath = "./assets/";
var button1, button2;
var starCriteria = "killNone";
var numMoves = 3;

function preload(){
  prefabs = [];
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*0, "x", "tile", loadImage(assetPath + "xTile.png"), true));
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*1, "T", "tile", loadImage(assetPath + "tTile.png"), true));
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*2, "L", "tile", loadImage(assetPath + "lTile.png"), true));
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*3, "I", "tile", loadImage(assetPath + "iTile.png"), true));
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*4, "V", "tile", loadImage(assetPath + "vTile.png"), true));
  prefabs.push(new Prefab(10, 10 + (prefabSize + prefabTileOffset)*5, "N", "tile", loadImage(assetPath + "nTile.png"), true));
  prefabs.push(new Prefab(20 + prefabSize, (prefabOffset + prefabSize)*0, "roy", "actor", loadImage(assetPath + "roy.png"), true))
  prefabs.push(new Prefab(10 + prefabSize, (prefabOffset + prefabSize)*1, "emily", "actor",
  loadImage(assetPath + "emily.png"), true));
  prefabs.push(new Prefab(10 + prefabSize, (prefabOffset + prefabSize)*2, "jake", "actor",
  loadImage(assetPath + "jake.png"), true));
  prefabs.push(new Prefab(10 + prefabSize, (prefabOffset + prefabSize)*3, "tank", "actor",
  loadImage(assetPath + "tank.png"), true));
  prefabs.push(new Prefab(10 + prefabSize, (prefabOffset + prefabSize)*4, "goal", "static", loadImage(assetPath + "goal.png"), true));
  prefabs.push(new Prefab(10 + prefabSize*2, (prefabOffset + prefabSize)*0, "shadow", "actor", loadImage(assetPath + "shadow.png"), true));
  prefabs.push(new Prefab(10 + prefabSize*2, (prefabOffset + prefabSize)*1, "wraith", "actor",
  loadImage(assetPath + "wraith.png"), true));
  prefabs.push(new Prefab(10 + prefabSize*2, (prefabOffset + prefabSize)*2, "laser", "static",
  loadImage(assetPath + "laser.png"), true));
  prefabs.push(new Prefab(10 + prefabSize*2, (prefabOffset + prefabSize)*3, "trap", "static", loadImage(assetPath + "trap.png"), true));
}

function setup() {
  json = {}; // new JSON Object

  json.name = 'level';
  json.rows = numRows;
  json.cols = numCols;

  createCanvas(windowWidth, windowHeight);
  
  for(var c = 0; c < numCols; c++){
    var tempArray = [];
    tileGrid.push(tempArray);
    for(var r = 0; r < numRows; r++){
      tileGrid[c].push( new FillTile(prefabSize*3 + c * tileSize, prefabSize*1 + r * tileSize));
    }
  }
  
  button1 = createButton('-1');
  button1.position(prefabSize*3, 30);
  button1.mousePressed(subRow);
  button1.hide();
  
  button2 = createButton('+1');
  button2.position(prefabSize*3 + button1.width*2 + 7, 30);
  button2.mousePressed(addRow);
  /*
  button3 = createButton('-1');
  button3.position(prefabSize*3, 39);
  button3.mousePressed(subCol);
  
  button4 = createButton('+1');
  button4.position(prefabSize*3 + button1.width*2, 39);
  button4.mousePressed(addCol);
  */
    
  input = createInput();
  input.position(325, 5);
  button = createButton('Set Name');
  button.position(input.x + input.width, 5);
  button.mousePressed(setName);
}

function draw() {
  
  //clear canvas
  rectMode(CORNER);
  fill(175);
  noStroke();
  rect(0, 0, width, height);
  
  //write the row/col text
  fill(0);
  textSize(16);
  text("Grid Dimensions", 400, 50);
  //text("column", 400, 52);
  text(numRows + "x" + numRows, 330, 50);
  //text(numCols, 340, 52);
    
  //write level name data
  text("Name: " + json.name, 575, 20);
   
  //warning
  textSize(11);
  fill(100);
  text("Warning: Changing the Grid Size removes added tiles.", 320, 80);
    
  
  //draw interactable tiletypes
  var p;
  for(p in prefabs){
    prefabs[p].display();
  }
  
  //draw fillable tiles
  fill(200);
  stroke(0);
  for(var c = 0; c < numCols; c++){
    for(var r = 0; r < numRows; r++){
      tileGrid[c][r].display();
    }
  }
  
  for(var s in statics){
    statics[s].display();
  }
  
  //draw other objects
  for(var i in actors){
    actors[i].display();
  }
  
  
  //draw the tile being dragged
  if(dragging){
    currDrag.x = mouseX - tileSize/2;
    currDrag.y = mouseY - tileSize/2;
    currDrag.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//pick up tiles
function mousePressed(){
  for(var i in actors){
    if(checkCollision(actors[i].x + tileSize/4, actors[i].y + tileSize/4, tileSize/2, tileSize/2)){
      actors[i].clicked();
      return;
    }
  }
  for(var i in statics){
    if(checkCollision(statics[i].x + tileSize/4, statics[i].y + tileSize/4, tileSize/2, tileSize/2)){
      statics[i].clicked();
      return;
    }
  }
  for(var i in prefabs){
    if(checkCollision(prefabs[i].x, prefabs[i].y, tileSize, tileSize)){
      prefabs[i].clicked();
      return;
    }
  }
  for(var c = 0; c < numCols; c++){
    for(var r = 0; r < numRows; r++){
      var t = tileGrid[c][r];
      if(checkCollision(t.x, t.y, tileSize, tileSize)){
        t.clicked();
        return;
      }
    }
  }
}

function checkCollision(xCord, yCord, sizeX, sizeY){
  if(mouseX > xCord && mouseX < xCord + sizeX && mouseY > yCord && mouseY < yCord + sizeY){
    return true;
  }
  return false;
}

//drop off tiles
function mouseReleased(){
  if(!dragging) return;
  for(var c = 0; c < numCols; c++){
    for(var r = 0; r < numRows; r++){
      if(checkCollision(tileGrid[c][r].x, tileGrid[c][r].y, tileSize, tileSize)){
        print(c + ", " + r);
        currDrag.x = tileGrid[c][r].x;
        currDrag.y = tileGrid[c][r].y;
        if(currDrag.type == "tile"){
          tileGrid[c][r].tile = currDrag;
        }
        else if(currDrag.type == "actor") {
          actors.push(currDrag);
        }
        else if(currDrag.type == "static") {
          statics.push(currDrag);
        }
      }
    }
  }

  dragging = false;
}

//fillable tile class
function FillTile(x, y){
  this.x = x;
  this.y = y;
  this.tile = null;

  this.display = function(){
    if(this.tile != null){
      this.tile.display();
    }
    else{
      rect(this.x, this.y, tileSize, tileSize);
    }
  }
  
  this.clicked = function(){
    print("tile was clicked");
    if(this.tile != null){
      currDrag = this.tile;
      dragging = true;
      this.tile = null;
    }
  }
}

//Everything you can add to the map is an instance of a prefab
function Prefab(x, y, name, type, img){
  Prefab(x,y,name,type,img, false);
}
function Prefab(x, y, name, type, img, perm){
  this.x = x;
  this.y = y;
  this.name = name;
  this.type = type;
  this.rotation = 2;
  this.img = img;
  this.perm = perm;
  this.size = 1;
  if(type == "actor" || type == "static") {
      this.size = 2;
  }

  this.display = function(){
    var s = tileSize/this.size;
    push();
    translate(this.x + (this.size - 1)*tileSize/4, this.y + (this.size - 1)*tileSize/4);
    switch(this.rotation){
      case 1:
        translate(s, 0);
        break;
      case 2:
        translate(s, s);
        break;
      case 3:
        translate(0, s);
        break;
    }
    rotate(radians(90*this.rotation));
    image(this.img, 0, 0, s, s);
    pop();
  }
  
  this.clicked = function(){
    print(name + " was clicked");
    if(perm){
      currDrag = new Prefab(mouseX, mouseY, this.name, this.type, this.img);
    }
    else {
      currDrag = this;
      if(this.type == "actor"){
			  actors.splice(actors.indexOf(this), 1);
		  }
		  if(this.type == "static"){
			  statics.splice(statics.indexOf(this), 1);
		  }
    }
    dragging = true;
  }
}

function keyTyped(){
  if(key === 'r') {
    currDrag.rotation++;
    if(currDrag.rotation > 3) currDrag.rotation = 0;
  }
}

function subRow(){
  if(numRows > 1) numRows--;
  button1.hide();
  button2.show();
  resetGrid()
}
function addRow(){
  numRows++;
  button1.show();
  button2.hide();
  resetGrid()
}
function subCol(){
  if(numCols > 1) numCols--;
  resetGrid()
}
function addCol(){
  numCols++;
  resetGrid()
}

function resetGrid(){
  json.rows = numRows;
  numCols = numRows;
  json.cols = numCols;

  createCanvas(windowWidth, windowHeight);
  tileGrid = [];
  for(var c = 0; c < numCols; c++){
    var tempArray = [];
    tileGrid.push(tempArray);
    for(var r = 0; r < numRows; r++){
      tileGrid[c].push( new FillTile(prefabSize*3 + c * tileSize, prefabSize*1 + r * tileSize));
    }
  }
}

//save JSON on enter press
function keyPressed(){
  if (keyCode === RETURN){
    json.tiles = [];
    for(var r = 0; r < numRows; r++){
      var tempArray = [];
      json.tiles.push(tempArray);
      for(var c = 0; c < numCols; c++){
        if(tileGrid[c][r].tile == null){
          print("Not all tiles filled");
          return;
        }
        var tileCode = tileGrid[c][r].tile.name;
        if(tileCode != 'x' && tileCode != 'N'){
          if(tileCode == 'I'){
              if(tileGrid[c][r].tile.rotation > 1){
                  tileGrid[c][r].tile.rotation -= 2;
              }
          }
          tileCode += tileGrid[c][r].tile.rotation;
        }
        json.tiles[r].push(tileCode);
      }
    }
    
    json.actors = {};
    for(var a in actors){
      var act = [];
      act.push(Math.floor((actors[a].x - prefabSize*3))/tileSize);
      act.push(numRows - 1 - Math.floor((actors[a].y - prefabSize*1))/tileSize);
      act.push(actors[a].rotation);
      switch(actors[a].name){
        case "roy":
          if(json.actors.roy == null) json.actors.roy = [];
          json.actors.roy.push(act);
          break;
        case "emily":
          if(json.actors.emily == null) json.actors.emily = [];
          json.actors.emily.push(act);
          break;
        case "jake":
          if(json.actors.jake == null) json.actors.jake = [];
          json.actors.jake.push(act);
          break;
        case "tank":
          if(json.actors.tank == null) json.actors.tank = [];
          json.actors.tank.push(act);
          break;
        case "shadow":
          if(json.actors.shadow == null) json.actors.shadow = [];
          json.actors.shadow.push(act);
          break;
        case "wraith":
          if(json.actors.wraith == null) json.actors.wraith = [];
          json.actors.wraith.push(act);
          break;
      }
    }
    json.static = {};
    for(var s in statics){
      switch(statics[s].name){
        case "goal":
          var goal = [];
          goal.push(Math.floor((statics[s].x - prefabSize*3))/tileSize);
          goal.push(numRows - 1 - Math.floor((statics[s].y - prefabSize*1))/tileSize);
          if(json.static.goal == null) json.static.goal = [];
          json.static.goal.push(goal);
          break;
        case "trap":
          var trap = [];
          trap.push(Math.floor((statics[s].x - prefabSize*3))/tileSize);
          trap.push(numRows - 1 - Math.floor((statics[s].y - prefabSize*1))/tileSize);
          if(json.static.trap == null) json.static.trap = [];
          json.static.trap.push(trap);
          break;
        case "laser":
          var laser = [];
          laser.push(Math.floor((statics[s].x - prefabSize*3))/tileSize);
          laser.push(numRows - 1 - Math.floor((statics[s].y - prefabSize*1))/tileSize);
          laser.push(statics[s].rotation);
          if(json.static.laser == null) json.static.laser = [];
          json.static.laser.push(laser);
          break;
      }
    }
    //add in star params
    json.moves = numMoves;
    json.star = starCriteria;
    
    saveJSON(json, 'level.json');
  }
}

function setName(){
    json.name = input.value();
}


