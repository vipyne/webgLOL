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
var devAngle = 0;
var devNum = 4;

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
  shadersPointerToResolutionValues = gl.getUniformLocation(webglolProgram, 'u_resolution');
  shadersPointerToWorldMatrix = gl.getUniformLocation(webglolProgram, 'world');
  shadersPointerToCameraMatrix = gl.getUniformLocation(webglolProgram, 'camera');
  shadersPointerToThirdMatrix = gl.getUniformLocation(webglolProgram, 'third');
  shadersPointerToColorValues = gl.getAttribLocation(webglolProgram, 'attributeVertexColor');

  // set static values (resolution)
  gl.uniform2f(shadersPointerToResolutionValues, webglolCanvas.width, webglolCanvas.height);
}

function generateBoxVertices(vertices) {
  devNum = 12
  devAngle = 15
  // T H E   B O X
vertices = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
];

console.log('vertices.length', vertices.length)

}

function generateColorVertValues() {
  var derp = [];

  for (var i = 0; i < (24/3); i ++) {
    derp.push(1.0);
    derp.push(0.50);
    derp.push(-0.5);
  }
  console.log('colorArray', colorArray.length)
  colorArray.set(derp, 0)
}

function createVertices() {
  var vertices = [];

  // vertices.push( -0.01,  0.01, 0.0,
  //                -0.01, -0.01, 0.0,
  //                 0.01,  0.01, 0.0,
  //                 0.01, -0.01, 0.0); // center DOT - actually a little square

  generateBoxVertices(vertices);

  verticesFloatArray = new Float32Array(vertices);

  // app ------> card
  vBuffersPointerToAspaceOnTheCard = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffersPointerToAspaceOnTheCard); // called multiple times
  vBuffersPointerToAspaceOnTheCard.itemSize = 3; // 3 values per vertex (x, y, z)
  vBuffersPointerToAspaceOnTheCard.numSize = 12; // 12 vertices

  // app ------> card
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW); // called multiple times
  // E N D   V E R T I C E S   B U F F E R


  // C O L O R   B U F F E R
  shadersPointerToColorValues = gl.getAttribLocation(webglolProgram, 'attributeVertexColor');
  gl.enableVertexAttribArray(shadersPointerToColorValues);

  var verticesLength = vertices.length;
  colorArray = new Float32Array(verticesLength);
var derp = [];

  for (var i = 0; i < (24/3); i ++) {
    derp.push(1.0);
    derp.push(0.50);
    derp.push(-0.5);
  }
  console.log('colorArray', colorArray.length)
  colorArray.set(derp, 0)
  // colorArray.set([1.0, -1.0, -1.0,     // set red dot color
  //                 1.0, -1.0, -1.0,
  //                 1.0, -1.0, -1.0,
  //                 1.0, -1.0, -1.0], 0);
  generateColorVertValues(colorArray);


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
  gl.viewport(0, 0, webglolCanvas.width, webglolCanvas.height);

  angleCounter++;
  // angleCounter = devAngle
  // angleCounter = 25
  util.rotate();

  gl.clearColor(0.0, 0, 0, .2);
  gl.clear(gl.COLOR_BUFFER_BIT);

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


  ///// DRAWRINGZ /////
  // drawArrays(primatitve shape, start index, number of values to be rendered)
  // gl.drawArrays(gl.LINES, 0, 12);
  // gl.drawElements(gl.TRIANGLES, 0, 36, gl.USIGNED_SHORT, 0);
  // gl.drawArrays(gl.TRIANGLES, 0, 24);
  // gl.drawArrays(gl.TRIANGLES, 4, 36);
  // gl.drawArrays(gl.POINTS, 0, );
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, devNum);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw the center DOT


  // var index_buffer = gl.createBuffer ();
  //        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  // var indices = [0,1,2, 0,2,3,
  //                 4,5,6, 4,6,7,
  //           8,9,10, 8,10,11,
  //           12,13,14, 12,14,15,
  //           16,17,18, 16,18,19,
  //           20,21,22, 20,22,23]
  //        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  // gl.enableVertexAttribArray(shadersPointerToColorValues);
  // gl.vertexAttribPointer(shadersPointerToColorValues, 3, gl.FLOAT, false, 0, 0);



// debugger
  requestAnimationFrame(draw);
}

window.onload = init;