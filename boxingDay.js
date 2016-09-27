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

  // var triangleAttributePosition = gl.getAttribLocation(webglolProgram, 'pos');

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
  var cos = Math.cos(radian);
  var sin = Math.sin(radian);
  var matrixX = [1,   0,   0, 0, // X
                 0, cos,-sin, 0,
                 0, sin, cos, 0,
                 0,   0,   0, 1];
  var matrixY = [cos, 0, sin, 0, // Y
                 0,   1,   0, 0,
                -sin, 0, cos, 0,
                 0,   0,   0, 1];
  var matrixZ = [cos,-sin, 0, 0, // Z
                 sin, cos, 0, 0,
                 0,   0,   1, 0,
                 0,   0,   0, 1];

  var u_model_mLocation = gl.getUniformLocation(webglolProgram, 'u_model_m');
  var u_camera_mLocation = gl.getUniformLocation(webglolProgram, 'u_camera_m');
  // gl.uniformMatrix4fv(uniformLocation, weather or not to transpose matrix to column first from row first, matrix array)
  // second arg is always set to false-- this is to preserve arg order of same function in openGL
  gl.uniformMatrix4fv(u_model_mLocation, false, new Float32Array(matrixX));

  gl.uniformMatrix4fv(u_camera_mLocation, false, new Float32Array(matrixY));

  ///// %%%%% red dot
  var colorLocation = gl.getAttribLocation(webglolProgram, 'aVertexColor');
  gl.enableVertexAttribArray(colorLocation);
  ///// %%%%%

  // vertices
  var vertices = [];

  // center dot
  vertices.push( -0.01,  0.01, 0.0,
                 -0.01, -0.01, 0.0,
                  0.01,  0.01, 0.0,
                  0.01, -0.01, 0.0); // actually a square

  // // box
  // vertices.push( -0.51,  0.51, 0.0,
  //                -0.51, -0.51, 0.0,
  //                 0.51,  0.51, 0.0,
  //                 0.51, -0.51, 0.0); // actually a square

  var verticesFloatArray = new Float32Array(vertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW);
  // gl.enableVertexAttribArray(triangleAttributePosition);
  // gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  ///// %%%%%
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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


  // drawArrays(primatitve shape, start index, number of values to be rendered)
  // gl.drawArrays(gl.TRIANGLES, 4, 8); // draw the box
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // draw the center dot

  // ------------------------------
  requestAnimationFrame(webglol);
}

window.onload = webglol;