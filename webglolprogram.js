function webglol() {
  // get canvas element
  var webglolCanvas = document.getElementById('webglol');
  // define WebGLRenderingContext
  //// getContext(context, options)
  var gl = webglolCanvas.getContext('experimental-webgl');

  // Specify the color values used when clearing color buffers.
  //// gl.clearColor(red, green, blue, alpha)
  gl.clearColor(0, 0, 0, 0.2);

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

  // MOUSE LOCATION
  this.mouse;
  window.addEventListener('mousemove', function(event) {
    this.mouse = [event.clientX, event.clientY];
    // return [event.clientX, event.clientY];
  });
  console.log('ttttmouse', this.mouse)
  console.log('mouse', this.mouse[0]/webglolCanvas.width)
  var mouseLocation = gl.getUniformLocation(webglolProgram, 'u_mouse');
  gl.uniform2f(mouseLocation, this.mouse[0]/webglolCanvas.width, this.mouse[1],webglolCanvas.height);

  var vertices = [];

  // `O`
  var numberOfTriangles = 100;
  var degreesPerTriangle = (4 * Math.PI) / numberOfTriangles;
  // var centerX = 1.5;
  // this.mouseX = 1.0;
  // window.addEventListener('mousemove', function(e) {
  //   console.log('mouseX', e.clientX / webglolCanvas.width)
  //   this.mouseX = e.clientX / webglolCanvas.width;
  // console.log('v---', this.mouseX)
  // })

  for(var i = 0; i < numberOfTriangles; i++) {
      var index = i * 3;
      var angle = degreesPerTriangle * i;
      var scale = 1;
  // var centerX = (this.mouse[0]/webglolCanvas.width);
  //   if (centerX > 0.5) {
  //     centerX = centerX
  //   }

    // this.mouse[0]/webglolCanvas.width) = x/2;
    // this.mouse[0] * 2 = webglolCanvas.width) * x;
    var centerX = (this.mouse[0] * 2 / webglolCanvas.width) - 1.0;


  var centerY = (this.mouse[1] * 2 / webglolCanvas.height) - 1.0;

  console.log(' mouse [x,y]', [this.mouse[0], this.mouse[1]])
  console.log('[x,y]', [centerX, centerY])

      vertices[index] = Math.cos(angle) / scale + centerX;               // x
      // vertices[index + 1] = Math.sin(angle) / scale;           // y
      vertices[index + 1] = Math.sin(angle) / scale; // y
      vertices[index + 2] = 0;

      console.log('x,y,z', vertices[index + 0])                               // z
      console.log('x,y,z', vertices[index + 1])                               // z
      console.log('x,y,z', vertices[index + 2])                               // z
  }

  // `L`s
  vertices.push( -0.5, 0.0, 0.0,
                 -1.5, 0.0, 0.0,
                 -1.5, 1.0, 0.0, // first `L`
                  0.5, 1.0, 0.0,
                  0.5, 0.0, 0.0,
                  1.5, 0.0, 0.0 ); // second `L`

  var verticesFloatArray = new Float32Array(vertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(triangleAttributePosition);
  gl.vertexAttribPointer(triangleAttributePosition, 3, gl.FLOAT, false, 0, 0);

  // drawArrays(primatitve shape, start index, number of values to be rendered)
  gl.drawArrays(gl.TRIANGLES, numberOfTriangles, 6); // draw the `L`s
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfTriangles - 5); // draw the `O`
}

window.onload = webglol;
// setInterval(webglol, 500);