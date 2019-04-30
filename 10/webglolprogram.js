var webglolCanvas,
    gl,
    webglolProgram;

this.verticesFloatArray;
var mouseLocation;
this.mouse = [10, 550]; // init value
var thatMouse = this.mouse;
var triangleAttributePosition;
var resolutionLocation;
var shadersPointerToWorldMatrix;
var time;
this.startTime = this.startTime ? this.startTime : new Date().getTime() / 10000;
var timeLocation;
this.numberOfTriangles = 0;
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

  // add x y cartesian guides
  vertices.push( -0.01, 1.0, 0.0,
                  0.01, 1.0, 0.0,
                  0.01, -1.0, 0.0,
                 -0.01, -1.0, 0.0); // X line

  vertices.push( 1.0, 0.01, 0.0,
                 1.0, -0.01, 0.0,
                 -1.0, -0.01, 0.0,
                 -1.0, 0.01, 0.0); // Y line


  // `O`
  degreesPerTriangle = (4 * Math.PI) / 100;
  // degreesPerTriangle = (4 * Math.PI) / this.numberOfTriangles;
  centerX = 0.5;

  var i = 14

  for(i; i < this.numberOfTriangles + 6; i++) {
    var index = i * 3;
    var angle = degreesPerTriangle * i;
    console.log('degreesPerTriangle', degreesPerTriangle)
    var scale = 2;
    console.log('angle', angle)

    vertices[index] = Math.cos(angle) / scale;               // x
    vertices[index + 1] = Math.sin(angle) / scale + centerX; // y
    vertices[index + 2] = 0;                                 // z
  }

  this.verticesFloatArray = new Float32Array(vertices);

  // // MOUSE LOCATION
  // window.addEventListener('mousemove', function(event) {
  //   this.mouse = [event.clientX, event.clientY];
  // });

  window.addEventListener('click', function(event) {
    console.log('this.numberOfTriangles', this.numberOfTriangles)
    // console.log('i', i)
    this.numberOfTriangles += 1;

    // // `O`
    // degreesPerTriangle = (4 * Math.PI) / this.numberOfTriangles;
    // centerX = 0.5;
    console.log('degreesPerTriangle', degreesPerTriangle)

    // for(var i = 6; i < this.numberOfTriangles + 6; i++) {
      var index = i * 3;
      var angle = degreesPerTriangle * i;
      var scale = 2;
      console.log('angle', angle)

      vertices[index] = Math.cos(angle) / scale;               // x
      vertices[index + 1] = Math.sin(angle) / scale + centerX; // y
      vertices[index + 2] = 0;                                 // z
      i++;
    // }

    this.verticesFloatArray = new Float32Array(vertices);
  })
}

function draw() {
  // Specify the color values used when clearing color buffers.
  //// gl.clearColor(red, green, blue, alpha)
  gl.clearColor(0, 0, 0, 0.2);

  // clears buffers to preset values specified by clearColor(), clearDepth() and clearStencil().
  //// gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT || gl.STENCIL_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, this.verticesFloatArray, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_FAN, 6, 4); // draw the X line
  gl.drawArrays(gl.TRIANGLE_FAN, 10, 4); // draw the Y line
  gl.drawArrays(gl.TRIANGLE_FAN, 14, this.numberOfTriangles); // draw the `O`
  gl.drawArrays(gl.POINTS, 14, this.numberOfTriangles); // draw the `O`


  // window.requestAnimationFrame(callback);
  if (animationBool == true) {
    requestAnimationFrame(draw);
  }
}


window.onload = init;
// setInterval(webglol, 500);