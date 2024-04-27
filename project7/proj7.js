/*Reggie Fisher CS 435 Project #7

This program is supposed to display a silhouette of a street view for a big city. This street 
view has 3 buildings on each side. The user can hold down the left or right arrow keys to control
the time of day for the city. This basically controls the sun. The user can also press the up arrow
for day and can press the down arrow for night.*/

"use strict";

var shadedCube = function() {

var canvas;
var gl;

var numPositions = 36;

var positionsArray = [];
var normalsArray = [];

var vertices = [
   //street vertices
        vec4(1.0, -1.0,  0.0, 1.0), //0
        vec4(0.0,  0.0,  0.0, 1.0), //1
        vec4(-1.0,  -1.0,  0.0, 1.0), //2

   //back left building
        vec4(-0.05,  -0.1,  0.0, 1.0), //3
        vec4(-0.05,  0.1,  0.0, 1.0), //4
        vec4(-0.1,  0.2,  0.0, 1.0), //5

        vec4(-0.1,  -0.1,  0.0, 1.0), //6
        vec4(-0.1,  0.2,  0.0, 1.0), //7
        vec4(-0.05,  -0.1,  0.0, 1.0), //8

        vec4(-0.1,  0.2,  0.0, 1.0), //9
        vec4(-0.3,  0.2,  0.0, 1.0), //10
        vec4(-0.1,  -0.1,  0.0, 1.0), //11

        vec4(-0.3,  0.2,  0.0, 1.0), //12
        vec4(-0.1,  -0.1,  0.0, 1.0), //13
        vec4(-0.3,  -0.3,  0.0, 1.0), //14

   //middle left buidling
        vec4(-0.3,  -0.3,  0.0, 1.0), //15
        vec4(-0.3,  0.3,  0.0, 1.0), //16
        vec4(-0.4,  0.5,  0.0, 1.0), //17

        vec4(-0.4,  0.5,  0.0, 1.0), //18
        vec4(-0.4,  -0.5,  0.0, 1.0), //19
        vec4(-0.3,  -0.3,  0.0, 1.0), //20

        vec4(-0.4,  0.5,  0.0, 1.0), //21
        vec4(-0.4,  -0.5,  0.0, 1.0), //22
        vec4(-0.8,  0.5,  0.0, 1.0), //23

        vec4(-0.8,  0.5,  0.0, 1.0), //24
        vec4(-0.8,  -0.5,  0.0, 1.0), //25
        vec4(-0.4,  -0.5,  0.0, 1.0), //26

   //front left budiling 
        vec4(-0.5,  0.05,  0.0, 1.0), //27
        vec4(-0.5,  -0.8,  0.0, 1.0), //28
        vec4(-0.9,  0.1,  0.0, 1.0), //29

        vec4(-0.9,  0.1,  0.0, 1.0), //30
        vec4(-0.9,  -0.9,  0.0, 1.0), //31
        vec4(-0.5,  -0.8,  0.0, 1.0), //32

        vec4(-0.9,  0.1,  0.0, 1.0), //33
        vec4(-0.7,  -0.8,  0.0, 1.0), //34
        vec4(-1.0,  0.1,  0.0, 1.0), //35

        vec4(-1.0,  0.1,  0.0, 1.0), //36
        vec4(-1.0,  -1.0,  0.0, 1.0), //37
        vec4(-0.7,  -0.8,  0.0, 1.0), //38

   //back right buidling
        vec4(0.05,  -0.1,  0.0, 1.0), //39
        vec4(0.05,  0.2,  0.0, 1.0), //40
        vec4(0.1,  0.4,  0.0, 1.0), //41

        vec4(0.1,  0.4,  0.0, 1.0), //42
        vec4(0.05,  -0.1,  0.0, 1.0), //43
        vec4(0.1,  -0.2,  0.0, 1.0), //44

        vec4(0.1,  0.4,  0.0, 1.0), //45
        vec4(0.1,  -0.2,  0.0, 1.0), //46
        vec4(0.3,  0.4,  0.0, 1.0), //47

        vec4(0.3,  0.4,  0.0, 1.0), //48
        vec4(0.1,  -0.2,  0.0, 1.0), //49
        vec4(0.3,  -0.4,  0.0, 1.0), //50

   //middle right building
        vec4(0.3,  -0.4,  0.0, 1.0), //51
        vec4(0.3,  0.15,  0.0, 1.0), //52
        vec4(0.4,  0.3,  0.0, 1.0), //53

        vec4(0.4,  0.3,  0.0, 1.0), //54
        vec4(0.3,  -0.4,  0.0, 1.0), //55
        vec4(0.4,  -0.4,  0.0, 1.0), //56

        vec4(0.4,  0.3,  0.0, 1.0), //57
        vec4(0.4,  -0.4,  0.0, 1.0), //58
        vec4(0.6,  0.3,  0.0, 1.0), //59

        vec4(0.6,  0.3,  0.0, 1.0), //60
        vec4(0.4,  -0.4,  0.0, 1.0), //61
        vec4(0.6,  -0.6,  0.0, 1.0), //62

   //front right building
        vec4(0.5,  -0.3,  0.0, 1.0), //63
        vec4(0.5,  0.6,  0.0, 1.0), //64
        vec4(0.7,  -0.9,  0.0, 1.0), //65

        vec4(0.7,  0.9,  0.0, 1.0), //66
        vec4(0.7,  -0.9,  0.0, 1.0), //67
        vec4(0.5,  0.6,  0.0, 1.0), //68

        vec4(0.7,  0.9,  0.0, 1.0), //69
        vec4(1.0,  0.9,  0.0, 1.0), //70
        vec4(1.0,  -1.0,  0.0, 1.0), //71

        vec4(0.7,  0.9,  0.0, 1.0), //72
        vec4(0.7,  -0.9,  0.0, 1.0), //73
        vec4(1.0,  -1.0,  0.0, 1.0), //74

   //the street lines
        vec4(-1.0,  -1.0,  0.0, 1.0), //75
        vec4(0.0,  0.0,  0.0, 1.0)//76

     /*   vec4(0.0,  0.0,  0.0, 1.0), //75
        vec4(-1.0,  0.5,  0.0, 1.0)//76 */
    ];

var lightPosition = vec4(0.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

var ctm;
var ambientColor, diffuseColor, specularColor;
var modelViewMatrix, projectionMatrix;
var viewerPos;
var program;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2; 
var axis = 0;
var theta = vec3(0, 0, 0);

var thetaLoc;

var flag = false;

function quad(a, b, c) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);



   //street and buildings
     positionsArray.push(vertices[0]);
     normalsArray.push(normal);
     positionsArray.push(vertices[1]);
     normalsArray.push(normal);
     positionsArray.push(vertices[2]);
     normalsArray.push(normal);
     positionsArray.push(vertices[3]);
     normalsArray.push(normal);
     positionsArray.push(vertices[4]);
     normalsArray.push(normal);
     positionsArray.push(vertices[5]);
     normalsArray.push(normal);
     positionsArray.push(vertices[6]);
     normalsArray.push(normal);
     positionsArray.push(vertices[7]);
     normalsArray.push(normal);
     positionsArray.push(vertices[8]);
     normalsArray.push(normal);
     positionsArray.push(vertices[9]);
     normalsArray.push(normal);
     positionsArray.push(vertices[10]);
     normalsArray.push(normal);
     positionsArray.push(vertices[11]);
     normalsArray.push(normal);
     positionsArray.push(vertices[12]);
     normalsArray.push(normal);
     positionsArray.push(vertices[13]);
     normalsArray.push(normal);
     positionsArray.push(vertices[14]);
     normalsArray.push(normal);
     positionsArray.push(vertices[15]);
     normalsArray.push(normal);
     positionsArray.push(vertices[16]);
     normalsArray.push(normal);
     positionsArray.push(vertices[17]);
     normalsArray.push(normal);
     positionsArray.push(vertices[18]);
     normalsArray.push(normal);
     positionsArray.push(vertices[19]);
     normalsArray.push(normal);
     positionsArray.push(vertices[20]);
     normalsArray.push(normal);
     positionsArray.push(vertices[21]);
     normalsArray.push(normal);
     positionsArray.push(vertices[22]);
     normalsArray.push(normal);
     positionsArray.push(vertices[23]);
     normalsArray.push(normal);
     positionsArray.push(vertices[24]);
     normalsArray.push(normal);
     positionsArray.push(vertices[25]);
     normalsArray.push(normal);
     positionsArray.push(vertices[26]);
     normalsArray.push(normal);
     positionsArray.push(vertices[27]);
     normalsArray.push(normal);
     positionsArray.push(vertices[28]);
     normalsArray.push(normal);
     positionsArray.push(vertices[29]);
     normalsArray.push(normal);
     positionsArray.push(vertices[30]);
     normalsArray.push(normal);
     positionsArray.push(vertices[31]);
     normalsArray.push(normal);
     positionsArray.push(vertices[32]);
     normalsArray.push(normal);
     positionsArray.push(vertices[33]);
     normalsArray.push(normal);
     positionsArray.push(vertices[34]);
     normalsArray.push(normal);
     positionsArray.push(vertices[35]);
     normalsArray.push(normal);
     positionsArray.push(vertices[36]);
     normalsArray.push(normal);
     positionsArray.push(vertices[37]);
     normalsArray.push(normal);
     positionsArray.push(vertices[38]);
     normalsArray.push(normal);
     positionsArray.push(vertices[39]);
     normalsArray.push(normal);
     positionsArray.push(vertices[40]);
     normalsArray.push(normal);
     positionsArray.push(vertices[41]);
     normalsArray.push(normal);
     positionsArray.push(vertices[42]);
     normalsArray.push(normal);
     positionsArray.push(vertices[43]);
     normalsArray.push(normal);
     positionsArray.push(vertices[44]);
     normalsArray.push(normal);
     positionsArray.push(vertices[45]);
     normalsArray.push(normal);
     positionsArray.push(vertices[46]);
     normalsArray.push(normal);
     positionsArray.push(vertices[47]);
     normalsArray.push(normal);
     positionsArray.push(vertices[48]);
     normalsArray.push(normal);
     positionsArray.push(vertices[49]);
     normalsArray.push(normal);
     positionsArray.push(vertices[50]);
     normalsArray.push(normal);
     positionsArray.push(vertices[51]);
     normalsArray.push(normal);
     positionsArray.push(vertices[52]);
     normalsArray.push(normal);
     positionsArray.push(vertices[53]);
     normalsArray.push(normal);
     positionsArray.push(vertices[54]);
     normalsArray.push(normal);
     positionsArray.push(vertices[55]);
     normalsArray.push(normal);
     positionsArray.push(vertices[56]);
     normalsArray.push(normal);
     positionsArray.push(vertices[57]);
     normalsArray.push(normal);
     positionsArray.push(vertices[58]);
     normalsArray.push(normal);
     positionsArray.push(vertices[59]);
     normalsArray.push(normal);
     positionsArray.push(vertices[60]);
     normalsArray.push(normal);
     positionsArray.push(vertices[61]);
     normalsArray.push(normal);
     positionsArray.push(vertices[62]);
     normalsArray.push(normal);
     positionsArray.push(vertices[63]);
     normalsArray.push(normal);
     positionsArray.push(vertices[64]);
     normalsArray.push(normal);
     positionsArray.push(vertices[65]);
     normalsArray.push(normal);
     positionsArray.push(vertices[66]);
     normalsArray.push(normal);
     positionsArray.push(vertices[67]);
     normalsArray.push(normal);
     positionsArray.push(vertices[68]);
     normalsArray.push(normal);
     positionsArray.push(vertices[69]);
     normalsArray.push(normal);
     positionsArray.push(vertices[70]);
     normalsArray.push(normal);
     positionsArray.push(vertices[71]);
     normalsArray.push(normal);
     positionsArray.push(vertices[72]);
     normalsArray.push(normal);
     positionsArray.push(vertices[73]);
     normalsArray.push(normal);
     positionsArray.push(vertices[74]);
     normalsArray.push(normal);


  /*   //the street lines
     positionsArray.push(vertices[75]);
     positionsArray.push(vertices[76]);*/

}


function colorCube()
{

    quad(0, 1, 2);


}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 1.0, 0.2);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "theta");

    viewerPos = vec3(0.0, 0.0, -20.0);

    projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    var addRight = 0.0;
    var addDown = 1.0;
    window.onkeydown = function(event) {
        switch(event.key) {
          case "ArrowRight":

               lightPosition = vec4(addRight - 0.1, 1.0, addDown, 0.0);
               gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addRight = addRight - 0.1;
  
               break;
            

            case "ArrowLeft":

                  lightPosition = vec4(addRight + 0.1, 1.0, addDown, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addRight = addRight + 0.1;
          
                  break;

            case 'ArrowDown':

                  lightPosition = vec4(10.0, 1.0, 1.0, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );

                  break;

            case 'ArrowUp':

            lightPosition = vec4(0.0, 1.0, 1.0, 0.0);
            gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
            lightPosition );

            break;

        }
    };

   /* document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};*/

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"), materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
       false, flatten(projectionMatrix));
    render();
}

var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));

    //console.log(modelView);

    gl.uniformMatrix4fv(gl.getUniformLocation(program,
            "uModelViewMatrix"), false, flatten(modelViewMatrix));

   

   // the street 
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    //back left building
    gl.drawArrays(gl.TRIANGLES, 3, 12);
   
    //middle left building
    gl.drawArrays(gl.TRIANGLES, 15, 12);

    //front left building
    gl.drawArrays(gl.TRIANGLES, 27, 12);

    //back right buidling
    gl.drawArrays(gl.TRIANGLES, 39, 12);

    //middle right building
    gl.drawArrays(gl.TRIANGLES, 51, 12);

    //front right building
    gl.drawArrays(gl.TRIANGLES, 63, 12);

    //the street lines
   // gl.drawArrays(gl.LINE_LOOP, 75, 2);


    requestAnimationFrame(render);
}

}

shadedCube();
