/*Reggie Fisher CS 435 Project #2

This program allows a user to add, move, and delete 6 different blocks throughout the program. Users are 
allowed to build something of their choosing using these 3 simple functions within the program.*/ 

"use strict"

var canvas;
var gl;

var projection; // projection matrix uniform shader variable location
var transformation; // projection matrix uniform shader variable location
var vPosition; // loc of attribute variables
var vColor;

// state representation
var Blocks; // seven blocks
var BlockIdToBeMoved; // this black is moving
var MoveCount;
var OldX;
var OldY;

//class that creates blocks
function CShape (n, color, x0, y0, x1, y1, x2, y2, x3, y3) {
    this.NumVertices = n;
    this.origin = [x0, y0];
    this.edge = [x1, y1];
    this.degree = 10;
    this.color = color;
    this.points=[];

    this.colors=[];
    for (var i=0; i<38; i++) this.colors.push(color);

    this.vBuffer=0;
    this.cBuffer=0;

    this.OffsetX=0;
    this.OffsetY=0;
    this.Angle=0;

    //function to get the points of the disk
    this.diskVertices = function(vertexOne, vertexTwo, degree) {
        var radians = (Math.PI / 180) * degree;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var newX = (cos * (vertexTwo[0] - vertexOne[0])) + (sin * (vertexTwo[1] - vertexOne[1])) + vertexOne[0];
        var newY = (cos * (vertexTwo[1] - vertexOne[1])) - (sin * (vertexTwo[0] - vertexOne[0])) + vertexOne[1];

        this.points.push(vec2(newX, newY));
    }

    //push the vertices for a disk if vertices is greater than 4
    if(this.NumVertices == 4) {
        this.points.push(vec2(x0, y0));
        this.points.push(vec2(x1, y1));
        this.points.push(vec2(x2, y2));
        this.points.push(vec2(x3, y3));
    }
    else {
        this.points.push(vec2(x0, y0));
        this.points.push(vec2(x1, y1));

        for (var i = 0; i < 36; i++) {
            this.diskVertices(this.origin, this.edge, this.degree);
            this.degree += 10;
        }
    }

    this.UpdateOffset = function(dx, dy) {
        this.OffsetX += dx;
        this.OffsetY += dy;
    }

    this.SetOffset = function(dx, dy) {
        this.OffsetX = dx;
        this.OffsetY = dy;
    }

    this.UpdateAngle = function(deg) {
        this.Angle += deg;
    }

    this.SetAngle = function(deg) {
        this.Angle = deg;
    }

    this.isLeft = function(x, y, id) {	// Is Point (x, y) located to the left when walking from id to id+1?
        var id1=(id+1)%this.NumVertices;
        return (y-this.points[id][1])*(this.points[id1][0]-this.points[id][0])>(x-this.points[id][0])*(this.points[id1][1]-this.points[id][1]);
    }

    this.transform = function(x, y) {
        var theta = -Math.PI/180*this.Angle;	// in radians
        var x2 = this.points[0][0] + (x - this.points[0][0]-this.OffsetX) * Math.cos(theta) - (y - this.points[0][1]-this.OffsetY) * Math.sin(theta);
        var y2 = this.points[0][1] + (x - this.points[0][0]-this.OffsetX) * Math.sin(theta) + (y - this.points[0][1]-this.OffsetY) * Math.cos(theta);
        return vec2(x2, y2);
    }

    this.isInside = function(x, y) {
        var p = this.transform(x, y);
        if (this.NumVertices == 4) { // if the shape is a square
            for (var i=0; i<this.NumVertices; i++) {
                if (this.isLeft(p[0], p[1], i)) return false;
            }
        }

        if(this.NumVertices == 38) { // if the shape is a disk
            var distance = Math.hypot(p[0] - this.origin[0], p[1] - this.origin[1]);
            if(55 < distance) return false;
        }
        return true;
    }

    this.init = function() {

        this.vBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

        this.cBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    }

    this.draw = function() {
        var tm=translate(this.points[0][0]+this.OffsetX, this.points[0][1]+this.OffsetY, 0.0);
        tm=mult(tm, rotate(this.Angle, vec3(0, 0, 1)));
        tm=mult(tm, translate(-this.points[0][0], -this.points[0][1], 0.0));
        gl.uniformMatrix4fv( transformation, gl.FALSE, flatten(tm) );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );


        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor ); 

        //use triangle fan to draw all shapes
        gl.drawArrays( gl.TRIANGLE_FAN, 0, this.NumVertices );
    }

}



window.onload = function initialize() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");
  
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    // Initial State
    Blocks = [];

    //functions to test if a key is pressed
    var pressedKeys = {};
    window.onkeyup = function(event) {
        pressedKeys[event.keyCode] = false;
    }

    window.onkeydown = function(event) {
        pressedKeys[event.keyCode] = true;
    }
    
    //how to add a block
    canvas.addEventListener("click", function(event){
        if (event.button!=0) return; // left button only
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        y=canvas.height-y;

        //red disk
        if(pressedKeys[82]) {
            Blocks.push(new CShape(38, vec4(1.0, 0.0, 0.0, 1.0), x, y, x+40, y+40, 0, 0, 0, 0));
            Blocks[Blocks.length - 1].init();
            render();
        }

        //green disk
        else if(pressedKeys[71]) {
            Blocks.push(new CShape(38, vec4(0.0, 1.0, 0.0, 1.0), x, y, 40+x, 40+y, 0, 0, 0, 0));
            Blocks[Blocks.length - 1].init();
            render();
        }

        //blue disk
        else if(pressedKeys[66]) {
            Blocks.push(new CShape(38, vec4(0.0, 0.0, 1.0, 1.0), x, y, 40+x, 40+y, 0, 0, 0, 0));
            Blocks[Blocks.length - 1].init();
            render();
        }

        //magenta square
        else if(pressedKeys[77]) {
            Blocks.push(new CShape(4, vec4(1.0, 0.0, 1.0, 1.0), x-40, y-40, x-40, y+40, x+40, y+40, x+40, y-40));
            Blocks[Blocks.length - 1].init();
            render();
        }

        //cyan square
        else if(pressedKeys[67]) {
            Blocks.push(new CShape(4, vec4(0.0, 1.0, 1.0, 1.0), x-40, y-40, x-40, y+40, x+40, y+40, x+40, y-40));
            Blocks[Blocks.length - 1].init();
            render();
        }

        //yellow square
        else if(pressedKeys[89]) {
            Blocks.push(new CShape(4, vec4(1.0, 1.0, 0.0, 1.0), x-40, y-40, x-40, y+40, x+40, y+40, x+40, y-40));
            Blocks[Blocks.length - 1].init();
            render();
        }

        else {

        }
    }); 
    

    canvas.addEventListener("mousedown", function(event){
        if (event.button!=0) return; // left button only
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        y=canvas.height-y;

        //check if the control key is being held down
        if (pressedKeys[17]) {  
            for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
              if (Blocks[i].isInside(x, y)) {
                // move Blocks[i] to the top
                var temp=Blocks[i];
                for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
                Blocks[Blocks.length-1]=temp;
                // remove the block
                Blocks.pop();
                render();
                return;
              }
            }
            return;
          }
    
        for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
            if (Blocks[i].isInside(x, y)) {
              // move Blocks[i] to the top
              var temp=Blocks[i];
              for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
              Blocks[Blocks.length-1]=temp;
              // remember the one to be moved
              BlockIdToBeMoved=Blocks.length-1;
              MoveCount=0;
              OldX=x;
              OldY=y;
              // redraw
              render();
              break;
            }
          }
    });

    canvas.addEventListener("mouseup", function(event){
        if (BlockIdToBeMoved>=0) {
          BlockIdToBeMoved=-1;
        }
      });

      canvas.addEventListener("mousemove", function(event){
        if (BlockIdToBeMoved>=0) {  // if dragging
          var x = event.pageX - canvas.offsetLeft;
          var y = event.pageY - canvas.offsetTop;
          y=canvas.height-y;
          Blocks[BlockIdToBeMoved].UpdateOffset(x-OldX, y-OldY);
          MoveCount++;
          OldX=x;
          OldY=y;
          render();
        }
      });

      BlockIdToBeMoved=-1; // no piece selected

    projection = gl.getUniformLocation( program, "projection" );
    var pm = ortho( 0.0, canvas.width, 0.0, canvas.height, -1.0, 1.0 );
    gl.uniformMatrix4fv( projection, gl.FALSE, flatten(pm) );

    transformation = gl.getUniformLocation( program, "transformation" );

    vPosition = gl.getAttribLocation( program, "aPosition" );
    vColor = gl.getAttribLocation( program, "aColor" );

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

        for (var i=0; i<Blocks.length; i++) {
            Blocks[i].draw();
        }
    
}

