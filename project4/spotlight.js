/*Reggie Fisher CS 435 Project #4

//My stage is a cube

This program is supposed to display a spotlight on a square stage that can be placed in 5x5 different positions.
The program should also divide the stage into smaller squares based on the input. The shading of the spotlight can
be done either per vertex or per fragment. My "per-vertex" and "per-fragment" buttons do not work but you can change 
to which ever one you want by switching the last two lines of code in the program.  */ 

"use strict";

var shadedFragment = function() {

var canvas;
var gl;
var index = 1;

var numTimesToSubdivide = 4;

var positionsArray = [];
var normalsArray = [];

var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

var lightPosition = vec4(0.0, 10.0, -0.9, 0.0);

var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

//spotlight variables
var spotlightDirection = vec3(0.0, -1.0, 0.0);
var spotlightCutOff = 0.7;
var fallOffRate = 200.0;

var modelViewMatrix, projectionMatrix;

var program;


var eye = vec3(0.0, 1.0, 1.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);


function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[a]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
     positionsArray.push(vertices[d]);
     normalsArray.push(normal);

     index += 4;
}

function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
   // quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);

}

var num = 8;
function divideSquare(a, b, c, d, count) {
    if (count > 0) {
        colorCube();

        //middle point for the sides
        var ab = mix(a, b, 0.5);
        var bc = mix(b, c, 0.5);
        var cd = mix(c, d, 0.5);
        var da = mix(d, a, 0.5);
        var center = mix(a, c, 0.5);

        a = normalize(a, false);
        b = normalize(b, false);
        c = normalize(c, false);
        d = normalize(d, false); 

        ab = normalize(ab, false);
        bc = normalize(bc, false);
        cd = normalize(cd, false);
        da = normalize(da, false); 
        center = normalize(center, false);

        //right ****************************
        vertices.push(a);
        vertices.push(ab);
        vertices.push(center);
        vertices.push(da);

        quad(num, num+1, num+2, num+3);
        num = num + 4;

        //top ******************************
        vertices.push(ab);
        vertices.push(b);
        vertices.push(bc);
        vertices.push(center);

        quad(num, num+1, num+2, num+3);
        num = num+4;

        //left *****************************
        vertices.push(center);
        vertices.push(bc);
        vertices.push(c);
        vertices.push(cd);

        quad(num, num+1, num+2, num+3);
        num = num+4;

        //bottom ***************************
        vertices.push(da);
        vertices.push(center);
        vertices.push(cd);
        vertices.push(d);

        quad(num, num+1, num+2, num+3);
        num = num+4;

        divideSquare(a, ab, center, da, count-1); //right
        divideSquare(ab, b, bc, center, count-1); //top
        divideSquare(center, bc, c, cd, count-1); //left
        divideSquare(da, center, cd, d, count-1); //bottom
    }

    else {
      colorCube();
    }
}


window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl,"vertex-shader", "fragment-shader");
    gl.useProgram(program);


    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    //slider
    document.getElementById("slider").onchange = function(event) {
        numTimesToSubdivide = parseInt(event.target.value);

        divideSquare(vertices[6], vertices[5], vertices[1], vertices[2], numTimesToSubdivide);
         positionsArray = [];
         normalsArray = [];
         init();
    }; 

    //******************************************** */
    divideSquare(vertices[6], vertices[5], vertices[1], vertices[2], numTimesToSubdivide);

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


    projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);

    var addRight = 0.0;
    var addDown = -0.9;
    window.onkeydown = function(event) {
        switch(event.key) {
          case "ArrowLeft":

            if(addRight > -0.2) {
               lightPosition = vec4(addRight - 0.1, 10.0, addDown, 0.0);
               gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addRight = addRight - 0.1;
            }     
               break;
            

            case "ArrowRight":
               if(addRight < 0.2) {
                  lightPosition = vec4(addRight + 0.1, 10.0, addDown, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addRight = addRight + 0.1;
               }
                  break;

            case "ArrowUp":
               if(addDown > -1.1) {
                  lightPosition = vec4(addRight, 10.0, addDown - 0.1, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addDown = addDown - 0.1;
               }
                  break;

            case "ArrowDown":
               if(addDown < -0.7) {
                  lightPosition = vec4(addRight, 10.0, addDown + 0.1, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                  lightPosition );
                  addDown = addDown + 0.1;
               }
                  break;
        }
    };

    var uSpotlightDirectionLocation = gl.getUniformLocation(program, "uSpotlightDirection");
    var uSpotlightCutoffLocation = gl.getUniformLocation(program, "uSpotlightCutoff");
    var uFallOffRateLocation = gl.getUniformLocation(program, "uFallOffRate");

    gl.uniform3fv(uSpotlightDirectionLocation, spotlightDirection);
    gl.uniform1f(uSpotlightCutoffLocation, spotlightCutOff);
    gl.uniform1f(uFallOffRateLocation, fallOffRate); 

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
       ambientProduct);
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
       diffuseProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
       specularProduct );
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
       lightPosition );

    gl.uniform1f(gl.getUniformLocation(program,
       "uShininess"),materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
       false, flatten(projectionMatrix));

    modelViewMatrix = lookAt(eye, at, up);

    gl.uniformMatrix4fv( gl.getUniformLocation(program,
               "uModelViewMatrix"), false, flatten(modelViewMatrix));
      

    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    gl.drawArrays(gl.TRIANGLES, 0, positionsArray.length);
    //gl.drawArrays(gl.LINES, 0, positionsArray.length);

    requestAnimationFrame(render);
  }
}

// ******************* vertex version ***************************************
var shadedVertex = function() {

   var canvas;
   var gl;
   var index = 1;
   
   var numTimesToSubdivide = 4;
   
   var positionsArray = [];
   var normalsArray = [];
   
   var vertices = [
           vec4(-0.5, -0.5,  0.5, 1.0),
           vec4(-0.5,  0.5,  0.5, 1.0),
           vec4(0.5,  0.5,  0.5, 1.0),
           vec4(0.5, -0.5,  0.5, 1.0),
           vec4(-0.5, -0.5, -0.5, 1.0),
           vec4(-0.5,  0.5, -0.5, 1.0),
           vec4(0.5,  0.5, -0.5, 1.0),
           vec4(0.5, -0.5, -0.5, 1.0)
       ];
   
   var lightPosition = vec4(0.0, 10.0, 0.9, 0.0);
   
   var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
   var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
   var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);
   
   var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
   var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
   var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
   var materialShininess = 100.0;
   
   //spotlight variables
   var spotlightDirection = vec3(0.0, -1.0, 0.0);
   var spotlightCutOff = 0.7;
   var fallOffRate = 100.0;
   
   var modelViewMatrix, projectionMatrix;
   
   var program;
   
   
   var eye = vec3(0.0, 1.0, 1.0);
   var at = vec3(0.0, 0.0, 0.0);
   var up = vec3(0.0, 1.0, 0.0);
   
   
   function quad(a, b, c, d) {
   
        var t1 = subtract(vertices[b], vertices[a]);
        var t2 = subtract(vertices[c], vertices[a]);
        var normal = cross(t1, t2);
        normal = vec3(normal);
   
        positionsArray.push(vertices[a]);
        normalsArray.push(normal);
        positionsArray.push(vertices[b]);
        normalsArray.push(normal);
        positionsArray.push(vertices[c]);
        normalsArray.push(normal);
        positionsArray.push(vertices[a]);
        normalsArray.push(normal);
        positionsArray.push(vertices[c]);
        normalsArray.push(normal);
        positionsArray.push(vertices[d]);
        normalsArray.push(normal);
   
        index += 4;
   }
   
   function colorCube()
   {
       quad(1, 0, 3, 2);
       quad(2, 3, 7, 6);
       quad(3, 0, 4, 7);
    //   quad(6, 5, 1, 2);
       quad(4, 5, 6, 7);
       quad(5, 4, 0, 1);
   
   }
   
   var num = 8;
   function divideSquare(a, b, c, d, count) {
       if (count > 0) {
   
           //middle point for the sides
           var ab = mix(a, b, 0.5);
           var bc = mix(b, c, 0.5);
           var cd = mix(c, d, 0.5);
           var da = mix(d, a, 0.5);
           var center = mix(a, c, 0.5);
   
           a = normalize(a, false);
           b = normalize(b, false);
           c = normalize(c, false);
           d = normalize(d, false); 
   
           ab = normalize(ab, false);
           bc = normalize(bc, false);
           cd = normalize(cd, false);
           da = normalize(da, false); 
           center = normalize(center, false);
   
           //right ****************************
           vertices.push(a);
           vertices.push(ab);
           vertices.push(center);
           vertices.push(da);
   
           quad(num, num+1, num+2, num+3);
           num = num + 4;
   
           //top ******************************
           vertices.push(ab);
           vertices.push(b);
           vertices.push(bc);
           vertices.push(center);
   
           quad(num, num+1, num+2, num+3);
           num = num+4;
   
           //left *****************************
           vertices.push(center);
           vertices.push(bc);
           vertices.push(c);
           vertices.push(cd);
   
           quad(num, num+1, num+2, num+3);
           num = num+4;
   
           //bottom ***************************
           vertices.push(da);
           vertices.push(center);
           vertices.push(cd);
           vertices.push(d);
   
           quad(num, num+1, num+2, num+3);
           num = num+4;
   
           divideSquare(a, ab, center, da, count-1); //right
           divideSquare(ab, b, bc, center, count-1); //top
           divideSquare(center, bc, c, cd, count-1); //left
           divideSquare(da, center, cd, d, count-1); //bottom
       }
   
       else {
           colorCube();
       }
   }
   
   
   window.onload = function init() {
       canvas = document.getElementById("gl-canvas");
   
       gl = canvas.getContext('webgl2');
       if (!gl) alert("WebGL 2.0 isn't available");
   
       gl.viewport(0, 0, canvas.width, canvas.height);
       gl.clearColor(1.0, 1.0, 1.0, 1.0);
   
       gl.enable(gl.DEPTH_TEST);
   
       //
       //  Load shaders and initialize attribute buffers
       //
       program = initShaders( gl,"vertex-shade", "fragment-shade");
       gl.useProgram(program);
   
   
       var ambientProduct = mult(lightAmbient, materialAmbient);
       var diffuseProduct = mult(lightDiffuse, materialDiffuse);
       var specularProduct = mult(lightSpecular, materialSpecular);
   
       //slider
       document.getElementById("slider").onchange = function(event) {
           numTimesToSubdivide = parseInt(event.target.value);
   
           divideSquare(vertices[6], vertices[5], vertices[1], vertices[2], numTimesToSubdivide);
            positionsArray = [];
            normalsArray = [];
            init();
       }; 
   
       //******************************************** */
       divideSquare(vertices[6], vertices[5], vertices[1], vertices[2], numTimesToSubdivide);
   
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
   
   
       projectionMatrix = ortho(-1, 1, -1, 1, -100, 100);
   
       var addRight = 0.0;
       var addDown = 0.9;
       window.onkeydown = function(event) {
           switch(event.key) {
             case "ArrowLeft":
   
               if(addRight < 0.2) {
                  lightPosition = vec4(addRight + 0.1, 10.0, addDown, 0.0);
                  gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                     lightPosition );
                     addRight = addRight + 0.1;
               }     
                  break;
               
   
               case "ArrowRight":
                  if(addRight > -0.2) {
                     lightPosition = vec4(addRight - 0.1, 10.0, addDown, 0.0);
                     gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                     lightPosition );
                     addRight = addRight - 0.1;
                  }
                     break;
   
               case "ArrowUp":
                  if(addDown < 1.1) {
                     lightPosition = vec4(addRight, 10.0, addDown + 0.1, 0.0);
                     gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                     lightPosition );
                     addDown = addDown + 0.1;
                  }
                     break;
   
               case "ArrowDown":
                  if(addDown > 0.7) {
                     lightPosition = vec4(addRight, 10.0, addDown - 0.1, 0.0);
                     gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
                     lightPosition );
                     addDown = addDown - 0.1;
                  }
                     break;
           }
       };
   
       var uSpotlightDirectionLocation = gl.getUniformLocation(program, "uSpotlightDirection");
       var uSpotlightCutoffLocation = gl.getUniformLocation(program, "uSpotlightCutoff");
       var uFallOffRateLocation = gl.getUniformLocation(program, "uFallOffRate");
   
       gl.uniform3fv(uSpotlightDirectionLocation, spotlightDirection);
       gl.uniform1f(uSpotlightCutoffLocation, spotlightCutOff);
       gl.uniform1f(uFallOffRateLocation, fallOffRate); 
   
       gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"),
          ambientProduct);
       gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"),
          diffuseProduct );
       gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"),
          specularProduct );
       gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"),
          lightPosition );
   
       gl.uniform1f(gl.getUniformLocation(program,
          "uShininess"),materialShininess);
   
       gl.uniformMatrix4fv( gl.getUniformLocation(program, "uProjectionMatrix"),
          false, flatten(projectionMatrix));
   
       modelViewMatrix = lookAt(eye, at, up);
   
       gl.uniformMatrix4fv( gl.getUniformLocation(program,
                  "uModelViewMatrix"), false, flatten(modelViewMatrix));

       render();
   }
   
   var render = function(){
   
       gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
   
       gl.drawArrays(gl.LINES, 0, positionsArray.length);
   
       requestAnimationFrame(render);
     }
   }

   
   shadedVertex();
   //shadedFragment();



   
