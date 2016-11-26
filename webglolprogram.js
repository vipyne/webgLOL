var gl,
    webglolProgram;

var shadersPointerToVertices;
var shadersPointerToResolutionValues;
var shadersPointerToWorldMatrix;
var shadersPointerToCameraMatrix;
var shadersPointerToColorValues;
var verticesFloatArray;
var vBuffersPointerToAspaceOnTheCard;
var colorBuffersPointerToAspaceOnTheCard;
var matrix;
var angleCounter = 0;

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
  rotate : function(angle) {
    var angle = angleCounter;
    var radian = Math.PI * angle / 180.0;
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);
    matrix = {
      world : [cos,-sin, 0, 0,
               sin, cos, 0, 0,
               0,   0,   1, 0,
               0,   0,   0, 1],
      camera :[cos, 0, sin, 0,
               0,   1,   0, 0,
              -sin, 0, cos, 0,
               0,   0,   0, 1],
      third : [1,   0,   0, 0,
               0, cos,-sin, 0,
               0, sin, cos, 0,
               0,   0,   0, 1]
    }
  }
}

function createShaders() {
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
  shadersPointerToVertices = gl.getAttribLocation(webglolProgram, 'pos');
  shadersPointerToResolutionValues = gl.getUniformLocation(webglolProgram, 'u_resolution'); // set the resolution
  shadersPointerToWorldMatrix = gl.getUniformLocation(webglolProgram, 'world');
  shadersPointerToCameraMatrix = gl.getUniformLocation(webglolProgram, 'camera');
  shadersPointerToThirdMatrix = gl.getUniformLocation(webglolProgram, 'third');
  shadersPointerToColorValues = gl.getAttribLocation(webglolProgram, 'attributeVertexColor');

  // set static values (resolution)
  gl.uniform2f(shadersPointerToResolutionValues, webglolCanvas.width, webglolCanvas.height);
}

function createVertices() {
  var vertices = [];

  vertices.push( -0.01,  0.01, 0.0,
                 -0.01, -0.01, 0.0,
                  0.01,  0.01, 0.0,
                  0.01, -0.01, 0.0); // center DOT - actually a little square

  // T H E   B O X
  vertices.push( -0.5, 0.5, 0.5,
                 -0.5, -0.5, 0.5,
                 0.5, -0.5, 0.5, // triangle 1
                 -0.5, 0.5, 0.5,
                 0.5, -0.5, 0.5,
                 0.5, 0.5, 0.5); // triangle 2

  vertices.push( -0.5, 0.5, -0.5,
                 -0.5, -0.5, -0.5,
                 0.5, -0.5, -0.5, // triangle 1
                 -0.5, 0.5, -0.5,
                 0.5, -0.5, -0.5,
                 0.5, 0.5, -0.5); // triangle 2

  vertices.push( -0.5, 0.5, 0.5,
                 -0.5, 0.5, -0.5,
                 0.5, 0.5, -0.5, // triangle 1
                 -0.5, 0.5, 0.5,
                 0.5, 0.5, -0.5,
                 0.5, 0.5, 0.5); // triangle 2

  vertices.push( -0.5, -0.5, 0.5,
                 -0.5, -0.5, -0.5,
                 0.5, -0.5, -0.5, // triangle 1
                 -0.5, -0.5, 0.5,
                 0.5, -0.5, -0.5,
                 0.5, -0.5, 0.5); // triangle 2

  vertices.push( 0.5, 0.5, -0.5,
                 0.5, -0.5, -0.5,
                 0.5, -0.5, 0.5, // triangle 1
                 0.5, 0.5, -0.5,
                 0.5, -0.5, 0.5,
                 0.5, 0.5, 0.5); // triangle 2

  vertices.push( -0.5, 0.5, -0.5,
                 -0.5, -0.5, -0.5,
                 -0.5, -0.5, 0.5, // triangle 1
                 -0.5, 0.5, -0.5,
                 -0.5, -0.5, 0.5,
                 -0.5, 0.5, 0.5); // triangle 2

  verticesFloatArray = new Float32Array(vertices);

  // app ------> card
  vBuffersPointerToAspaceOnTheCard = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffersPointerToAspaceOnTheCard); // called multiple times
  vBuffersPointerToAspaceOnTheCard.itemSize = 4; // 3 values per vertex (x, y, z)
  vBuffersPointerToAspaceOnTheCard.numSize = 12; // 12 vertices

  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW); // called multiple times
  // E N D   V E R T I C E S   B U F F E R


  // C O L O R   B U F F E R
  gl.enableVertexAttribArray(shadersPointerToColorValues);

  var verticesLength = vertices.length;
  colorArray = new Float32Array(verticesLength);
  colorArray.set([1.0, -1.0, -1.0,     // set red dot color
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0], 0);

  colorArray.set([0.030, -0.13, -0.053,     // front
                  0.030, -0.13, -0.053,
                  0.030, -0.13, -0.053,
                  0.030, -0.13, -0.053,
                  0.030, -0.13, -0.053,
                  0.030, -0.13, -0.053], 12);

  colorArray.set([-1.0, 0.03, 0.3,     // back
                  -1.0, 0.03, 0.3,
                  -1.0, 0.03, 0.3,
                  -1.0, 0.03, 0.3,
                  -1.0, 0.03, 0.3,
                  -1.0, 0.03, 0.3], 30);

  colorArray.set([-1.0, 0.5, 0.5,     // front
                  -1.0, 0.5, 0.5,
                  -1.0, 0.5, 0.5,
                  -1.0, 0.5, 0.5,
                  -1.0, 0.5, 0.5,
                  -1.0, 0.5, 0.5], 48);

  colorArray.set([-1.0, -0.1, -0.1,     // front
                  -1.0, -0.1, -0.1,
                  -1.0, -0.1, -0.1,
                  -1.0, -0.1, -0.1,
                  -1.0, -0.1, -0.1,
                  -1.0, -0.1, -0.1], 66);

  colorArray.set([-1.0, -0.24, -0.24,     // front
                  -1.0, -0.24, -0.24,
                  -1.0, -0.24, -0.24,
                  -1.0, -0.24, -0.24,
                  -1.0, -0.24, -0.24,
                  -1.0, -0.24, -0.24], 84);

  colorArray.set([-1.0, -0.366, -0.166,     // front
                  -1.0, -0.366, -0.166,
                  -1.0, -0.366, -0.166,
                  -1.0, -0.366, -0.166,
                  -1.0, -0.366, -0.166,
                  -1.0, -0.366, -0.166], 102);

  // app ------> card
  colorBuffersPointerToAspaceOnTheCard = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffersPointerToAspaceOnTheCard); // called multiple times
  colorBuffersPointerToAspaceOnTheCard.itemSize = 3;
  colorBuffersPointerToAspaceOnTheCard.numSize = 12;

  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.DYNAMIC_DRAW); // called multiple times
}

// / / / / - - - -   D R A W   - - - - \ \ \ \ \\
function draw() {
  angleCounter++;
  // angleCounter = 45
  util.rotate();

  gl.clearColor(0.0, 0, 0, .2);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); // THIS IS THE MAGIC LINE ***VERY IMPORTANT***
  gl.depthFunc(gl.LEQUAL); // unsure if this is needed

  // V E R T I C E S   B U F F E R
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffersPointerToAspaceOnTheCard);
  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW);
    // gl.bufferData = pushes the values from app to card
  gl.enableVertexAttribArray(shadersPointerToVertices);
  gl.vertexAttribPointer(shadersPointerToVertices, 3, gl.FLOAT, false, 0, 0);

  // C O L O R   B U F F E R
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffersPointerToAspaceOnTheCard);
  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.STATIC_DRAW);
    // gl.bufferData = pushes the values from app to card
  gl.enableVertexAttribArray(shadersPointerToColorValues);
  gl.vertexAttribPointer(shadersPointerToColorValues, 3, gl.FLOAT, false, 0, 0);

  // -------------
  gl.uniformMatrix4fv(shadersPointerToWorldMatrix, false, new Float32Array(matrix.world));
  gl.enableVertexAttribArray(shadersPointerToWorldMatrix);
  gl.vertexAttribPointer(shadersPointerToWorldMatrix, 3, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(shadersPointerToCameraMatrix, false, new Float32Array(matrix.camera));
  gl.enableVertexAttribArray(shadersPointerToCameraMatrix);
  gl.vertexAttribPointer(shadersPointerToCameraMatrix, 3, gl.FLOAT, false, 0, 0);
  gl.uniformMatrix4fv(shadersPointerToThirdMatrix, false, new Float32Array(matrix.third));
  gl.enableVertexAttribArray(shadersPointerToThirdMatrix);
  gl.vertexAttribPointer(shadersPointerToThirdMatrix, 3, gl.FLOAT, false, 0, 0);
  // -------------

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 4, 36);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw the red center square (inside cube)

  // window.requestAnimationFrame(callback);
  requestAnimationFrame(draw);
}

window.onload = init;