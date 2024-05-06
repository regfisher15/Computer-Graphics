/*Reggie Fisher CS 435 Project #6

This program builds a program that has 3 walls and a floor. The walls are wallpapered and
the floor is carpeted. In the middle of the room is a wooden table with 4 legs. The table 
has a glass cup on it which also has a red ball inside of the cup. The user can choose 
between 3 different views to see the object on the table.*/
"use strict"; 
 
var canvas;
var gl; 

//var numPositions  = 100; 

var index = 0;
var intervalId;

var program;
var flag = true;

var positionsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var electornicTextures = [];

//disk points
var origin = vec4(0.0, -0.01, 0.0, 1.0);
var edge = vec4(1.0, -0.01, 0.0, 1.0);

// var texture;
var texture1; //bricks
var texture2; //wallpaper
var texture3; //carpet
var texture4; //wood
var texture5; //bold and brash
var texture6; //patrick
var texture7; //spongebob
var texture8; //the houses
var texture9; //first group picture
var texture10; //second group picture
var texture11; //the third group picture
var texture12; //the fourth group picture

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    //exterior vertices
    vec4(-0.5, -0.5,  0.5, 1.0), //0
    vec4(-0.5,  0.5, 0.5, 1.0), //1
    vec4(0.5,  0.5, 0.5, 1.0), //2 
    vec4(0.5, -0.5, 0.5, 1.0), //3 
    vec4(-0.5, -0.5, -0.5, 1.0), //4
    vec4(-0.5,  0.5, -0.5, 1.0), //5
    vec4(0.5,  0.5, -0.5, 1.0), //6
    vec4(0.5, -0.5, -0.5, 1.0), //7

    //interior vertices
    vec4(-0.499, -0.499,  0.499, 1.0), //8
    vec4(-0.499,  0.499, 0.499, 1.0), //9
    vec4(0.499,  0.499, 0.499, 1.0), //10
    vec4(0.499, -0.499, 0.499, 1.0), //11
    vec4(-0.499, -0.499, -0.499, 1.0), //12
    vec4(-0.499,  0.499, -0.499, 1.0), //13
    vec4(0.499,  0.499, -0.499, 1.0), //14
    vec4(0.499, -0.499, -0.499, 1.0), //15

    //vertices for the front left leg
    vec4(-0.25, -0.5, -0.25, 1.0), //16
    vec4(-0.25, -0.1, -0.25, 1.0), //17
    vec4(-0.15, -0.1, -0.25, 1.0), //18
    vec4(-0.15, -0.5, -0.25, 1.0), //19
    vec4(-0.25, -0.5, -0.20, 1.0), //20
    vec4(-0.25, -0.1, -0.20, 1.0), //21
    vec4(-0.15, -0.1, -0.20, 1.0), //22
    vec4(-0.15, -0.5, -0.20, 1.0), //23

    //vertices for the front right leg
    vec4(-0.25, -0.5, 0.25, 1.0), //24 
    vec4(-0.25, -0.1, 0.25, 1.0), //25 
    vec4(-0.15, -0.1, 0.25, 1.0), //26
    vec4(-0.15, -0.5, 0.25, 1.0), //27
    vec4(-0.25, -0.5, 0.20, 1.0), //28
    vec4(-0.25, -0.1, 0.20, 1.0), //29
    vec4(-0.15, -0.1, 0.20, 1.0), //30
    vec4(-0.15, -0.5, 0.20, 1.0), //31

    //vertices for the table
    vec4(-0.25, -0.1, -0.25, 1.0), //32
    vec4(-0.25, -0.05, -0.25, 1.0), //33
    vec4(0.25, -0.05, -0.25, 1.0), //34
    vec4(0.25, -0.1, -0.25, 1.0), //35
    vec4(-0.25, -0.1, 0.25, 1.0), //36
    vec4(-0.25, -0.05, 0.25, 1.0), //37
    vec4(0.25, -0.05, 0.25, 1.0), //38
    vec4(0.25, -0.1, 0.25, 1.0), //39

    //vertices for left picture
    vec4(-0.15, -0.15,  -0.498, 1.0), //40
    vec4(-0.15, 0.15, -0.498, 1.0), //41
    vec4(0.15, 0.15, -0.498, 1.0), //42
    vec4(0.15, -0.15, -0.498, 1.0), //43

    //vertices for right picture
    vec4(-0.15, -0.15,  0.498, 1.0), //44
    vec4(-0.15, 0.15, 0.498, 1.0), //45
    vec4(0.15, 0.15, 0.498, 1.0), //46
    vec4(0.15, -0.15, 0.498, 1.0), //47

    //vertices for the back left leg
    vec4(0.15, -0.5, -0.25, 1.0), //48
    vec4(0.15, -0.1, -0.25, 1.0), //49
    vec4(0.25, -0.1, -0.25, 1.0), //50
    vec4(0.25, -0.5, -0.25, 1.0), //51
    vec4(0.15, -0.5, -0.20, 1.0), //52
    vec4(0.15, -0.1, -0.20, 1.0), //53
    vec4(0.25, -0.1, -0.20, 1.0), //54
    vec4(0.25, -0.5, -0.20, 1.0), //55

    //vertices for the back right leg
    vec4(0.15, -0.5, 0.25, 1.0), //56
    vec4(0.15, -0.1, 0.25, 1.0), //57
    vec4(0.25, -0.1, 0.25, 1.0), //58
    vec4(0.25, -0.5, 0.25, 1.0), //59
    vec4(0.15, -0.5, 0.20, 1.0), //60
    vec4(0.15, -0.1, 0.20, 1.0), //61
    vec4(0.25, -0.1, 0.20, 1.0), //62
    vec4(0.25, -0.5, 0.20, 1.0), //63
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 1.0, 1.0, 1.0),  // white
];

//initial view
var theta = vec3(90.0, 45.0, 90.0);
//theta = vec3(-45.0, 125.0, -45.0); //right view
//theta = vec3(55.0, 45.0, 45.0); //left view

//theta = vec3(-55.0, 135.0, -45.0); //right view

var thetaLoc;

function configureTexture( image ) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


    return texture;
}


function quad(a, b, c, d) {
     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     positionsArray.push(vertices[b]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     positionsArray.push(vertices[a]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     positionsArray.push(vertices[c]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     positionsArray.push(vertices[d]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

//function the calculate the base
function base(vertexOne, vertexTwo, degree) 
{
    var radians = (Math.PI / 180) * degree;
    var cos = Math.cos(radians);
    var sin = Math.sin(radians);
    var newX = (cos * (vertexTwo[0] - vertexOne[0])) + (sin * (vertexTwo[1] - vertexOne[1])) + vertexOne[0];
    var newY = (cos * (vertexTwo[1] - vertexOne[1])) - (sin * (vertexTwo[0] - vertexOne[0])) + vertexOne[1];

    positionsArray.push(vec2(newX, newY));
} 

//cup function
function cup(r, h, n) {
    var angleIncrement = (2 * Math.PI) / n;
   // var vertices = [];

    for (var i = 0; i <= n; i++) { // <= n because we want to repeat the first vertex at the end
        var angle = i * angleIncrement;
        var x = r * Math.cos(angle);
        var z = r * Math.sin(angle);

        // Bottom vertex
        positionsArray.push(vec4(x, -h / 2, z, 1.0)); // vec4 is used for WebGL's vec4 format
        // Top vertex
        positionsArray.push(vec4(x, h / 2, z, 1.0));

        // Add the same color for both the top and bottom vertices of a segment
        colorsArray.push( vec4(1.0, 1.0, 1.0, 0.7) ); // Bottom vertex color
        colorsArray.push(  vec4(1.0, 1.0, 1.0, 0.7) ); // Top vertex color
    }
}


//function for the exterior cube
function colorCube()
{
    //exterior faces
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(4, 5, 6, 7); 

    //interior faces
    quad(9, 8, 11, 10);
    quad(10, 11, 15, 14);
    quad(12, 13, 14, 15);

   //the floor
   quad(11, 8, 12, 15);

   //the front left leg
   quad(17, 16, 19, 18);
   quad(18, 19, 23, 22);
   quad(19, 16, 20, 23);
   quad(22, 21, 17, 18);
   quad(20, 21, 22, 23);
   quad(21, 20, 16, 17);

   //the front right leg
   quad(25, 24, 27, 26);
   quad(26, 27, 31, 30);
   quad(27, 24, 28, 31);
   quad(30, 29, 25, 26);
   quad(28, 29, 30, 31);
   quad(29, 28, 24, 25);

   //the table
   quad(33, 32, 35, 34);
   quad(34, 35, 39, 38);
   quad(35, 32, 36, 39);
   quad(38, 37, 33, 34);
   quad(36, 37, 38, 39);
   quad(37, 36, 32, 33);

   //the left picture
   quad(41, 40, 43, 42);

   //the right picture
   quad(45, 44, 47, 46);

   //the back left leg
   quad(49, 48, 51, 50);
   quad(50, 51, 55, 53);
   quad(51, 48, 52, 56);
   quad(54, 53, 49, 50);
   quad(52, 53, 54, 55);
   quad(53, 52, 48, 49);

   //the back right leg
   quad(57, 56, 59, 58);
   quad(58, 59, 63, 62);
   quad(59, 56, 60, 63);
   quad(62, 61, 57, 58);
   quad(60, 61, 62, 63);
   quad(61, 60, 56, 57);
}


window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
   /* gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);*/

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();
    

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    //display the sphere
    var mySphere = sphere();
    mySphere.scale(0.08, 0.08, 0.08);
    mySphere.rotate(45.0, [ 1, 1, 1]);
    mySphere.translate(0.0, 0.02, 0.0);

    positionsArray = positionsArray.concat(mySphere.TriangleVertices);
    colorsArray = colorsArray.concat(mySphere.TriangleVertexColors);

    //display the cup
    cup(0.10, 0.3, 32); 

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);

    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    //
    // Initialize a texture
    //

    //the brick image
    var img1 = document.getElementById("Img1");
    texture1=configureTexture(img1);

    //the wallpaper image
    var img2 = document.getElementById("Img2");
    texture2 = configureTexture(img2);

    //the carpet image
    var img3 = document.getElementById("Img3");
    texture3 = configureTexture(img3);

    //the wood image
    var img4 = document.getElementById("Img4");
    texture4 = configureTexture(img4);

    //the left image
    var img5 = document.getElementById("Img5");
    texture5 = configureTexture(img5);

    //the right image
    var img6 = document.getElementById("Img6");
    texture6 = configureTexture(img6);

    //the table image
    var img7 = document.getElementById("Img7");
    texture7 = configureTexture(img7);

    //the first electronic image
    var img8 = document.getElementById("Img8");
    texture8 = configureTexture(img8);
    electornicTextures.push(texture8);

    //the second electronic image
    var img9 = document.getElementById("Img9");
    texture9 = configureTexture(img9);
    electornicTextures.push(texture9);

    //the third electronic image
    var img10 = document.getElementById("Img10");
    texture10 = configureTexture(img10);
    electornicTextures.push(texture10);

    //the fourth electronic image
    var img11 = document.getElementById("Img11");
    texture11 = configureTexture(img11);
    electornicTextures.push(texture11);

    //the fifth electronic image
    var img12 = document.getElementById("Img12");
    texture12 = configureTexture(img12);
    electornicTextures.push(texture12);


    gl.uniform1i(gl.getUniformLocation(program, "uTextureMap"), 0);
        
    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //left button
    document.getElementById("ButtonLeft").onclick = function(){
        theta = vec3(55.0, 45.0, 45.0); //left view
        index = (index - 1) % electornicTextures.length; //keeps same pic
        render();
    };

    //right button
    document.getElementById("ButtonRight").onclick = function(){
        theta = vec3(-55.0, 135.0, -45.0); //right view
        index = (index - 1) % electornicTextures.length; //keeps same pic
        render();
    };

    //middle button
    document.getElementById("ButtonMiddle").onclick = function(){
        theta = vec3(90.0, 45.0, 90.0); //middle view
        index = (index - 1) % electornicTextures.length; //keeps same pic
        render();
    };

    render();

}

var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   // if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);
    // gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.drawArrays(gl.TRIANGLES, 0, 18);

    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(gl.TRIANGLES, 18, 18);

    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.drawArrays(gl.TRIANGLES, 36, 6);

    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.drawArrays(gl.TRIANGLES, 42, 108);

    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.drawArrays(gl.TRIANGLES, 150, 6);

    gl.bindTexture(gl.TEXTURE_2D, texture6);
    gl.drawArrays(gl.TRIANGLES, 156, 6);

    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.drawArrays(gl.TRIANGLES, 162, 72); 

    //the ball
    gl.drawArrays(gl.TRIANGLES, 234, 762);

    //the cup
    gl.drawArrays(gl.TRIANGLE_STRIP, 996, 80);

}

