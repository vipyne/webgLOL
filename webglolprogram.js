var gl,
    webglolProgram;

var shadersPointerToVertices;
var shadersPointerToResolutionValues;
var shadersPointerToWorldMatrix;
var shadersPointerToCameraMatrix;
var verticesFloatArray;
var buffersPointerToAspaceOnTheCard;
var matrix =  {
  world : [1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1],
  camera :[1, 0, 0, 0,
           0, 1, 0, 0,
           0, 0, 1, 0,
           0, 0, 0, 1]
         }

var angleCounter = 0;

function init() {
  webglolInit();
  createShaders();
  locateShaderAttributes();
  createVertices();
  draw();
}

function webglolInit() {
  webglolCanvas = document.getElementById('webglol');
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
  shadersPointerToResolutionValues = gl.getUniformLocation(webglolProgram, 'u_resolution');
  shadersPointerToWorldMatrix = gl.getUniformLocation(webglolProgram, 'world');
  shadersPointerToCameraMatrix = gl.getUniformLocation(webglolProgram, 'camera');

  // set static values (resolution)
  gl.uniform2f(shadersPointerToResolutionValues, webglolCanvas.width, webglolCanvas.height);
}

function createVertices() {
  // T H E   B O X
  var vertices = [];

  vertices.push( -0.01,  0.01, 0.0,
                 -0.01, -0.01, 0.0,
                  0.01,  0.01, 0.0,
                  0.01, -0.01, 0.0); // center DOT - actually a little square

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
  buffersPointerToAspaceOnTheCard = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffersPointerToAspaceOnTheCard); // called multiple times
  buffersPointerToAspaceOnTheCard.itemSize = 3; // 3 values per vertex (x, y, z)
  buffersPointerToAspaceOnTheCard.numSize = 12; // 12 vertices

  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW); // called multiple times

  // C O L O R   B U F F E R // not doing anything at the moment
  var colorAttribLocation = gl.getAttribLocation(webglolProgram, 'attributeVertexColor');
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  var verticesLength = vertices.length;
  var colorArray = new Float32Array(verticesLength);
  colorArray.set([1.0, -1.0, -1.0,     // set red dot color
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0,
                  1.0, -1.0, -1.0], 0);
  gl.bufferData(gl.ARRAY_BUFFER, colorArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, false, 0, 0);
}

function draw() {
  angleCounter++;
  util.rotate();

  gl.clearColor(0, 0, 0, .2);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.enableVertexAttribArray(shadersPointerToVertices);
  gl.vertexAttribPointer(shadersPointerToVertices, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffersPointerToAspaceOnTheCard);

  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW); // gl.bufferData = pushes the values from app to card

  gl.uniformMatrix4fv(shadersPointerToWorldMatrix, false, new Float32Array(matrix.world));
  gl.enableVertexAttribArray(shadersPointerToWorldMatrix);
  gl.vertexAttribPointer(shadersPointerToWorldMatrix, 3, gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(shadersPointerToCameraMatrix, false, new Float32Array(matrix.camera));
  gl.enableVertexAttribArray(shadersPointerToCameraMatrix);
  gl.vertexAttribPointer(shadersPointerToCameraMatrix, 3, gl.FLOAT, false, 0, 0);

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, 4, 36);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw the center DOT

  requestAnimationFrame(draw);
}

window.onload = init;