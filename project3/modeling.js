/*Reggie Fisher CS 435 Project #3

This program allows a user to print a 3D message on a screen and tilt the screen up/down or left/right using the arrow keys.
I wasn't able to print a cylinder and I was not able to print more than one word. So I simply hard coded the word "hello" 
to demonstrate the functionality of the program.*/ 

"use strict";

var canvas, gl, program;

var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var colors = [];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = 1.0;
var BASE_WIDTH       = 10.0;
var LOWER_ARM_HEIGHT = 5.0;
var LOWER_ARM_WIDTH  = 0.5;
var UPPER_ARM_HEIGHT = 5.0;
var UPPER_ARM_WIDTH  = 5.0;

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var theta= [ 0, 90, 0, 5];

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


//--------------------------------------------------


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 0.0, 1.0, 0.2 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    //////////////////////////////////////////////////


    colorCube();

    ///////////////////////////////////////////////

    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Create and initialize  buffer objects

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    window.onkeydown = function(event) {
        switch(event.keyCode) {
            case 37: //left turn
                theta[1] = theta[1] + 5;
                break;

            case 39: //right turn
                theta[1] = theta[1] - 5;
                break;

            case 38: //up tilt
                theta[2] = theta[2] - 5;
                break;

            case 40: //down tilt
                theta[2] = theta[2] + 5;
                break;
        }
    };

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------


function base() {
    var s = scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);

    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    //var instanceMatrix = mult(s,  translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ));

    //console.log("instanceMatrix", instanceMatrix);

    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t)  );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );

    //console.log("base", t);
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale(1, 8, 15);
    //console.log("s", s);

    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    //var instanceMatrix = mult(s, translate(  0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ));

    //console.log("instanceMatrix", instanceMatrix);

    var t = mult(modelViewMatrix, instanceMatrix);

    //console.log("upper arm mv", modelViewMatrix);

    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)  );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    //console.log("upper arm t", t);

}

//----------------------------------------------------------------------------


function lowerArm()
{
    var s = scale(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);


    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)   );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

}

//----------------------------------------------------------------------------
function letterUp()
{
    var s = scale(-2.0, 1.5, 0.2);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);


    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)   );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );   
}
//----------------------------------------------------------------------------

function letterSide()
{
    var s = scale(-2.0, 0.2, 1.5);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);


    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t)   );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );   
}
//----------------------------------------------------------------------------

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


    ///////// the base
    modelViewMatrix = rotate(theta[Base], vec3(0, 0, 1 ));
    modelViewMatrix = rotate(theta[Base], vec3(0, 1, 1 ));
    //modelViewMatrix  = mult(modelViewMatrix, rotate(theta[3], vec3(1, 0, 0)) );
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -6.0, 0.0));
    base();

    ////////// the pole
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], vec3(0, 1, 0 )));
    lowerArm();
    printm( translate(0.0, BASE_HEIGHT, 0.0));
    printm(modelViewMatrix);

    /////////// the screen
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, 6.0, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], vec3(0, 0, 1)) );

    upperArm();
//******THE LETTER H ********************************** */
    /////////// top left
    modelViewMatrix = mult(modelViewMatrix, translate(1.0, 1.0, 6.5));
    letterUp();

    //////////  bottom right
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterUp();

    ////////// center middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 1.0, -1.0));
    letterSide();

    ///////// top right
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 1.0, -1.0));
    letterUp();

    ///////// top middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterUp();

//******THE LETTER E ********************************** */
    //top left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 2.0, -1.0));
    letterUp();

    //bottom left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterUp();

    //top middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.0));
    letterSide();

    //center middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterSide();

    //bottom middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterSide();

//******THE LETTER L ********************************** */
    //top left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.5));
    letterUp();

     //bottom left
     modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
     letterUp();

     //bottom left
     modelViewMatrix = mult(modelViewMatrix, translate(0.0, -1.0, -1.0));
     letterSide();

//******THE LETTER L ********************************** */
    //top left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.5));
    letterUp();

     //bottom left
     modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
     letterUp();

     //bottom left
     modelViewMatrix = mult(modelViewMatrix, translate(0.0, -1.0, -1.0));
     letterSide();

//******THE LETTER O ********************************** */
    //top left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.5));
    letterUp();

    //bottom left
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterUp();
    
    //top middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.0));
    letterSide();

    //bottom middle
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -4.0, 0.0));
    letterSide();

    //top right
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, -1.0));
    letterUp();

    //bottom right
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -2.0, 0.0));
    letterUp();

    requestAnimationFrame(render);
}

///////// testing for rotation
    /*modelViewMatrix = mult(modelViewMatrix, translate(0.0, 3.0, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[3], vec3(1, 0, 0)) );
    letterUp();*/