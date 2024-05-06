/*Reggie Fisher, CS 435, Project #1

This project creates a snowflake with the use of recursion. The shape of the 
snowflake depends on how many times the reursive function is called*/

"use strict";

var canvas;
var gl;

var triangleLines = [];
var positions = [];


var numTimesToSnow = 5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //
    //  Initialize our data for the Koch Snowflake
    //


    // First, initialize the corners of our triangle with three positions.

    var vertices = [
        vec2( -0.6, -0.6 ),
        vec2(  0,  0.6 ),
        vec2(  0.6, -0.6 )
    ];

    // print out the first triangle
    filledTriangle(vertices[0], vertices[1], vertices[2]);

    // recursively add more triangles if the count is not 0
    if(numTimesToSnow > 0) {
        filledSnowflake(vertices[0], vertices[1], numTimesToSnow);  //left side
        filledSnowflake(vertices[1], vertices[2], numTimesToSnow);  //right side
        filledSnowflake(vertices[2], vertices[0], numTimesToSnow);  //bottom side
    }          

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU for the base case

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    render();
};

//this function displays the first triangle (NOT FILLED, must use lines)
function firstTriangle(a, b, c)
{
    positions.push(a);
    positions.push(b);
    positions.push(b);
    positions.push(c);
    positions.push(c);
    positions.push(a);
}

//this function displays the first triangle (FILLED, must use triangles)
function filledTriangle(a, b, c) {
    positions.push(a);
    positions.push(b);
    positions.push(c);
}

//this function is used to rotate to find the final point between the two thirds
function rotate(vertexOne, vertexTwo) 
{
    var radians = (Math.PI / 180) * 60;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newX = (cos * (vertexTwo[0] - vertexOne[0])) + (sin * (vertexTwo[1] - vertexOne[1])) + vertexOne[0];
    var newY = (cos * (vertexTwo[1] - vertexOne[1])) - (sin * (vertexTwo[0] - vertexOne[0])) + vertexOne[1];

    return [newX, newY];
}

// this function forms a non-filled snowflake (must use lines)
function snowflake(a, b, count) {
    // check for end of recursion 
    if (count === 0) {
        // Stop recursion and do nothing
    }
   
       else {
           // turn the given line into 4 separate sections 
           var ab1 = mix( a, b, 0.33333 );
           var ab2 = mix( a, b, 0.66666 );
           var abTop = rotate(ab2, ab1);
   
           positions.push(a);
           positions.push(ab1);
           positions.push(ab1);
           positions.push(abTop);
           positions.push(abTop);
           positions.push(ab2);
           positions.push(ab2);
           positions.push(b);
   
           --count;
           //recursively call the function to create snowflake 
           snowflake(a, ab1, count);
           snowflake(ab1, abTop, count);
           snowflake(abTop, ab2, count);
           snowflake(ab2, b, count);
       }
}

// this function forms a filled snowflake (must use triangles)
function filledSnowflake(a, b, count) {
    // check for end of recursion 
    if (count === 0) {
        // Stop recursion and do nothing
    }
   
       else {
           // turn the given line into 4 separate sections 
           var ab1 = mix( a, b, 0.33333 );
           var ab2 = mix( a, b, 0.66666 );
           var abTop = rotate(ab2, ab1);
   
           positions.push(ab1);
           positions.push(abTop);
           positions.push(ab2);
   
           --count;
           //recursively call the function to create snowflake effect
           filledSnowflake(a, ab1, count);
           filledSnowflake(ab1, abTop, count);
           filledSnowflake(abTop, ab2, count);
           filledSnowflake(ab2, b, count);
       }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, positions.length );
}
