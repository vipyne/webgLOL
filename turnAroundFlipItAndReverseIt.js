function webglol() {
  // get canvas element
  var webglolCanvas = document.getElementById('webglol');
  // define WebGLRenderingContext
  //// getContext(context, options)
  var gl = webglolCanvas.getContext('experimental-webgl');

  // Specify the color values used when clearing color buffers.
  //// gl.clearColor(red, green, blue, alpha)
  gl.clearColor(0, 0, 0, .2);

  // clears buffers to preset values specified by clearColor(), clearDepth() and clearStencil().
  //// gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT || gl.STENCIL_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);

  var webglolProgram = gl.createProgram();

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

  var triangleAttributePosition = gl.getAttribLocation(webglolProgram, 'pos');

  // set the resolution
  var resolutionLocation = gl.getUniformLocation(webglolProgram, 'u_resolution');
  gl.uniform2f(resolutionLocation, webglolCanvas.width, webglolCanvas.height);

  // timing
  this.startTime = this.startTime ? this.startTime : new Date().getTime() / 10000;
  var time = new Date().getTime() / 10000 - this.startTime;
  var timeLocation = gl.getUniformLocation(webglolProgram, 'u_time');
  gl.uniform1f(timeLocation, time);

  // spin counter
  this.angleCounter = this.angleCounter ? this.angleCounter : 360.0; // 360 degrees in a circle
  window.requestAnimationFrame(function increaseAngleCounter() {
    if (this.angleCounter === 0.0) {
      this.angleCounter = 360.0;
    } else {
      this.angleCounter -= 1.0;
    }
    return this.angleCounter;
  });

  // rotation
  var angle = this.angleCounter;
  var radian = Math.PI * angle / 180.0;
  var cosR = Math.cos(radian);
  var sinR = Math.sin(radian);

  var u_cosLocation = gl.getUniformLocation(webglolProgram, 'u_cos');
  var u_sinLocation = gl.getUniformLocation(webglolProgram, 'u_sin');

  gl.uniform1f(u_cosLocation, cosR);
  gl.uniform1f(u_sinLocation, sinR);

  // vertices
  var vertices = [];

  // `O`
  var numberOfTriangles = 100;
  var degreesPerTriangle = (4 * Math.PI) / numberOfTriangles;
  var centerX = 0.5;

  for(var i = 0; i < numberOfTriangles; i++) {
      var index = i * 3;
      var angle = degreesPerTriangle * i;
      var scale = 2;

      vertices[index] = Math.cos(angle) / scale;               // x
      vertices[index + 1] = Math.sin(angle) / scale + centerX; // y
      vertices[index + 2] = 0;                                 // z
  }

  // `L`s
  vertices.push( -0.5, 0.0, 0.0,
                 -1.5, 0.0, 0.0,
                 -1.5, 1.0, 0.0, // first `L`
                  0.5, 1.0, 0.0,
                  0.5, 0.0, 0.0,
                  1.5, 0.0, 0.0 ); // second `L`

  // center dot
  vertices.push( -0.01, 0.01, 0.0,
                 -0.01, -0.01, 0.0,
                  0.01, 0.01, 0.0,
                  0.01, -0.01, 0.0);

  var verticesFloatArray = new Float32Array(vertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, numberOfTriangles, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_STRIP, numberOfTriangles + 6, 4); // draw the center dot
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfTriangles - 9); // draw the `O`

  requestAnimationFrame(webglol);
}

window.onload = webglol;
// setInterval(webglol, 100);