var webglolCanvas,
    gl,
    webglolProgram;

var verticesFloatArray;
var mouseLocation;
this.mouse = [400, 300]; // init value
var thatMouse = this.mouse;
var triangleAttributePosition;
var resolutionLocation;
var shadersPointerToWorldMatrix;
var time;
this.startTime = this.startTime ? this.startTime : new Date().getTime() / 10000;
var timeLocation;
var numberOfTriangles = 100;
var vertices = [];

function init() {
  webglolInit();
  createShaders();
  locateShaderAttributes();
  createVertices();
  draw();
}

function webglolInit() {
  // get canvas element
  webglolCanvas = document.getElementById('webglol');
  // define WebGLRenderingContext
  //// getContext(context, options)
  gl = webglolCanvas.getContext('experimental-webgl');
  webglolProgram = gl.createProgram();
}
util = {
  matrix : {
    world : function(thisMouse) {
      var halfCanvasWidth = webglolCanvas.width/2;
      var halfCanvasHeight = webglolCanvas.height/2;
      var mouseX = thisMouse[0];
      var mouseY = thisMouse[1];
      var xCoord = mouseX - halfCanvasWidth;
      var yCoord = mouseY - halfCanvasHeight;

      var sqX = xCoord * xCoord;
      var sqY = yCoord * yCoord;

      var hypotenuseLength = Math.sqrt(sqX + sqY);
      var normalizedX = xCoord/hypotenuseLength;
      var normalizedY = yCoord/hypotenuseLength;

      // this produces the angle for the sin/cos calculations...!
      var atan2thingMouse = Math.atan2(normalizedY, normalizedX);

      // rotation matrix:
      return [Math.cos(atan2thingMouse), -Math.sin( atan2thingMouse ), 0, 0,
              Math.sin( atan2thingMouse ),  Math.cos(atan2thingMouse), 0, 0,
               0,                                                   0, 1, 0,
               0,                                                   0, 0, 1]
             }

      // all the math i tried that i apparently did not need to do.
      // var xAngle = normalizedX / normalizedY;
      // var xRad = Math.cos( xAngle );
      // var xDegrees = xRad * 180 / Math.PI;
      // var yDegrees = 180 - (xDegrees + 90);
      // var yRad = (yDegrees * Math.PI) / 180;
      // var XangleTemp = mouseY/mouseX;
      // var YangleTemp = 180 - (XangleTemp + 90);
  }
}
var animationBool = true; // useful for debugging

function createShaders() {
  // time to throw some shade
  var vertexShaderScript = document.getElementById('vertex-shader').text;
  var fragmentShaderScript = document.getElementById('fragment-shader').text;

  // gl.createShader(gl.VERTEX_SHADER || gl.FRAGMENT_SHADER)
  var vertexShader   = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // gl.shaderSource(shader, source)
  gl.shaderSource(vertexShader, vertexShaderScript);
  gl.shaderSource(fragmentShader, fragmentShaderScript);

  // gl.compileShader(shader)
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  // gl.attachShader(webgl program, shader)
  gl.attachShader(webglolProgram, vertexShader);
  gl.attachShader(webglolProgram, fragmentShader);

  gl.linkProgram(webglolProgram);
  gl.useProgram(webglolProgram);
}

function locateShaderAttributes() {
  // set up pointers from the shader on the card to the values in the app

  // app <------ card
  triangleAttributePosition = gl.getAttribLocation(webglolProgram, 'pos');

  // set the resolution
  resolutionLocation = gl.getUniformLocation(webglolProgram, 'u_resolution');
  gl.uniform2f(resolutionLocation, webglolCanvas.width, webglolCanvas.height);

  shadersPointerToWorldMatrix = gl.getUniformLocation(webglolProgram, 'world');

  // timing
  time = new Date().getTime() / 10000 - this.startTime;
  timeLocation = gl.getUniformLocation(webglolProgram, 'u_time');
  gl.uniform1f(timeLocation, time);

  mouseLocation = gl.getUniformLocation(webglolProgram, 'u_mouse');
  gl.uniform2f(mouseLocation, this.mouse[0]/webglolCanvas.width, this.mouse[1],webglolCanvas.height);
}

function createVertices() {
  // `L`s
  vertices.push( -0.5, 0.0, 0.0,
                 -1.5, 0.0, 0.0,
                 -1.5, 1.0, 0.0, // first `L`
                  0.5, 1.0, 0.0,
                  0.5, 0.0, 0.0,
                  1.5, 0.0, 0.0 ); // second `L`

  // `O`
  degreesPerTriangle = (4 * Math.PI) / numberOfTriangles;
  centerX = 0.5;

  for(var i = 6; i < numberOfTriangles + 6; i++) {
    var index = i * 3;
    var angle = degreesPerTriangle * i;
    var scale = 2;

    vertices[index] = Math.cos(angle) / scale;               // x
    vertices[index + 1] = Math.sin(angle) / scale + centerX; // y
    vertices[index + 2] = 0;                                 // z
  }

  // add x y cartesian guides
  vertices.push( -0.01, 1.0, 0.0,
                  0.01, 1.0, 0.0,
                  0.01, -1.0, 0.0,
                 -0.01, -1.0, 0.0); // X line

  vertices.push( 1.0, 0.01, 0.0,
                 1.0, -0.01, 0.0,
                 -1.0, -0.01, 0.0,
                 -1.0, 0.01, 0.0); // Y line

  verticesFloatArray = new Float32Array(vertices);

  // MOUSE LOCATION
  window.addEventListener('mousemove', function(event) {
    this.mouse = [event.clientX, event.clientY];
  });
}

function draw() {
  // Specify the color values used when clearing color buffers.
  //// gl.clearColor(red, green, blue, alpha)
  gl.clearColor(0, 0, 0, 0.2);

  // clears buffers to preset values specified by clearColor(), clearDepth() and clearStencil().
  //// gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT || gl.STENCIL_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(shadersPointerToWorldMatrix, false, new Float32Array(util.matrix.world(this.mouse)));
  gl.enableVertexAttribArray(shadersPointerToWorldMatrix);


  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_FAN, 6, numberOfTriangles); // draw the `O`
  // gl.drawArrays(gl.TRIANGLE_FAN, numberOfTriangles + 6, 4); // draw the X line
  // gl.drawArrays(gl.TRIANGLE_FAN, numberOfTriangles + 10, 4); // draw the Y line


  // window.requestAnimationFrame(callback);
  if (animationBool == true) {
    requestAnimationFrame(draw);
  }
}

window.onload = init;
// setInterval(webglol, 500);