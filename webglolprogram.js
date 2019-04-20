var webglolCanvas,
    gl,
    webglolProgram;

var verticesFloatArray;
var mouseLocation;
this.mouse = [400, 300]; // init value
var thatMouse = this.mouse;
var triangleAttributePosition;
var colorPosition;
var resolutionLocation;
var shadersPointerToWorldMatrix;
var time;
this.startTime = this.startTime ? this.startTime : new Date().getTime() / 10000;
var timeLocation;
var numberOfTriangles = 100;
var vertices = [];
var cosR;
var sinR;
var angleCounter = 360.0;
var u_model_mLocation;
var u_camera_m;

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
    world : function(angle) {
      var radian = Math.PI * angle / 180.0;
      cosR = Math.cos(radian);
      sinR = Math.sin(radian);

      // rotation way 2; (usual)
      var cos = Math.cos(radian);
      var sin = Math.sin(radian);
      return {

      matrixX : [1,   0,   0, 0, // X
                 0, cos,-sin, 0,
                 0, sin, cos, 0,
                 0,   0,   0, 1],
      matrixY : [cos, 0, sin, 0, // Y
                 0,   1,   0, 0,
                -sin, 0, cos, 0,
                 0,   0,   0, 1],
      matrixZ : [cos,-sin, 0, 0, // Z
                 sin, cos, 0, 0,
                 0,   0,   1, 0,
                 0,   0,   0, 1]
      }
    }
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

  colorLocation = gl.getAttribLocation(webglolProgram, 'aVertexColor');

  // set the resolution
  resolutionLocation = gl.getUniformLocation(webglolProgram, 'u_resolution');
  gl.uniform2f(resolutionLocation, webglolCanvas.width, webglolCanvas.height);

  // timing
  this.startTime = this.startTime ? this.startTime : new Date().getTime() / 10000;
  var time = new Date().getTime() / 10000 - this.startTime;
  var timeLocation = gl.getUniformLocation(webglolProgram, 'u_time');
  gl.uniform1f(timeLocation, time);

  var u_cosLocation = gl.getUniformLocation(webglolProgram, 'u_cos');
  var u_sinLocation = gl.getUniformLocation(webglolProgram, 'u_sin');
  gl.uniform1f(u_cosLocation, cosR);
  gl.uniform1f(u_sinLocation, sinR);

  u_model_mLocation = gl.getUniformLocation(webglolProgram, 'u_model_m');
  u_camera_mLocation = gl.getUniformLocation(webglolProgram, 'u_camera_m');

}

function createVertices() {
  // center dot
  vertices.push( -0.01,  0.01, 0.0,
                 -0.01, -0.01, 0.0,
                  0.01,  0.01, 0.0,
                  0.01, -0.01, 0.0); // actually a square

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

  for(var i = 10; i < numberOfTriangles + 11; i++) {
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

  gl.uniformMatrix4fv(shadersPointerToWorldMatrix, false, new Float32Array(util.matrix.world(this.mouse)));

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  ///// %%%%%
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var red    = [1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0,
                1.0, 0.0, 0.0, 1.0];

  var verticesLength = vertices.length;
  var colorArray = new Float32Array(verticesLength);
    colorArray.set([1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, -1.0], 0);

  gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
  ///// %%%%%

  if (angleCounter === 0.0) {
    angleCounter = 360.0;
  } else {
    angleCounter -= 1.0;
  }
  // second arg is always set to false-- this is to preserve arg order of same function in openGL
  gl.uniformMatrix4fv(u_model_mLocation, false, new Float32Array(util.matrix.world(angleCounter).matrixX));
  gl.uniformMatrix4fv(u_camera_mLocation, false, new Float32Array(util.matrix.world(angleCounter).matrixY));

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 4, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_FAN, 10, numberOfTriangles - 9); // draw the `O`
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw the center dot

  // window.requestAnimationFrame(callback);
  if (animationBool == true) {
    requestAnimationFrame(draw);
  }
}

window.onload = init;
// setInterval(webglol, 500);