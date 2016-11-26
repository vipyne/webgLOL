var webglolCanvas,
    gl,
    webglolProgram;

var verticesFloatArray;
var mouseLocation;
this.mouse = [0, 0]; // init value
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
      var canvasWidth = webglolCanvas.width;
      var canvasHeight = webglolCanvas.height;
      var mouseX = thisMouse[0];
      var mouseY = thisMouse[1];
      var angleTemp = mouseX/canvasWidth + mouseY/canvasHeight;
      if (mouseX < mouseY) {
        console.log('X less than Y');
        angleTemp += (mouseX/canvasWidth - mouseY/canvasHeight);
      }
      // return [Math.cos(angleTemp), -Math.sin(angleTemp), 0, 0,
      //         Math.sin(angleTemp),  Math.cos(angleTemp), 0, 0,
      return [angleTemp, 0, 0, angleTemp*2,
              -.2,  1, 0, 0,
               .2,                 0, 1, 0,
               0,                 0, 0, 1]
             }
  }
}

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

  console.log('this.mouse', this.mouse)
  // console.log('mouse', this.mouse[0]/webglolCanvas.width)
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

  verticesFloatArray = new Float32Array(vertices);

  // MOUSE LOCATION
  window.addEventListener('mousemove', function(event) {
    this.mouse = [event.clientX, event.clientY];
    // return [event.clientX, event.clientY];
  });
}

function draw() {
  // if (this.mouse != [0,0] && thatMouse == this.mouse) {
  //   console.log('derpreutrrrnnnnn')
  //   return;
  // }
  // Specify the color values used when clearing color buffers.
  //// gl.clearColor(red, green, blue, alpha)
  gl.clearColor(0, 0, 0, 0.2);

  // clears buffers to preset values specified by clearColor(), clearDepth() and clearStencil().
  //// gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT || gl.STENCIL_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);


  // // update `O` position
  // var degreesPerTriangle = (4 * Math.PI) / numberOfTriangles;
  // // var centerX = 1.5;
  // // this.mouseX = 1.0;
  // for(var i = 6; i < numberOfTriangles + 6; i++) {
  //   var index = i * 3;
  //   var angle = degreesPerTriangle * i;
  //   var scale = 1;
  // // var centerX = (this.mouse[0]/webglolCanvas.width);
  // //   if (centerX > 0.5) {
  // //     centerX = centerX
  // //   }
  //   // this.mouse[0]/webglolCanvas.width) = x/2;
  //   // this.mouse[0] * 2 = webglolCanvas.width) * x;
  //   var centerX = (this.mouse[0] * 2 / webglolCanvas.width) - 1.0;
  //   var centerY = (this.mouse[1] * 2 / webglolCanvas.height) - 1.0;
  //   console.log(' mouse [x,y]', [this.mouse[0], this.mouse[1]])
  //   console.log('[x,y]', [centerX, centerY])
  //   vertices[index] = Math.cos(angle) / scale + centerX;               // x
  //   // vertices[index + 1] = Math.sin(angle) / scale;           // y
  //   vertices[index + 1] = Math.sin(angle) / scale; // y
  //   vertices[index + 2] = 0;
  //   console.log('x', vertices[index + 0]);// z
  //   console.log('y', vertices[index + 1]);// z
  //   console.log('z', vertices[index + 2]);// z
  // }


  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(shadersPointerToWorldMatrix, false, new Float32Array(util.matrix.world(this.mouse)));
  gl.enableVertexAttribArray(shadersPointerToWorldMatrix);

  // if (thatMouse == this.mouse) {
  //   console.log('derpreutrrrnnnnn')
  //   // draw();
  //   return;
  // }
  // thatMouse = this.mouse;

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 0, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_FAN, 6, numberOfTriangles); // draw the `O`

  // window.requestAnimationFrame(callback);
  // requestAnimationFrame(draw);
}

window.onload = init;
// setInterval(webglol, 500);