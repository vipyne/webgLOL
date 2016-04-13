function webglol() {
  var gl = document.getElementById('webglol').getContext('experimental-webgl');

  // paint all the pixels on the canvas black at 20% alpha
  gl.clearColor(0, 0, 0, .2); 
  gl.clear(gl.COLOR_BUFFER_BIT);

  var webglolProgram = gl.createProgram();

  var vertexShader   = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  var vertexShaderC = "attribute vec3 pos;                      " +
                      "void main() {                            " +
                      " gl_Position = vec4(pos, 2.0);           " +
                      "}                                        ";
  var fragmentShaderC = "void main() {                            " +
                        " gl_FragColor = vec4(0.9, 0.2, 0.9, 1.0);" +
                        "}                                        ";

  gl.shaderSource(vertexShader, vertexShaderC);
  gl.shaderSource(fragmentShader, fragmentShaderC);

  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);

  gl.attachShader(webglolProgram, vertexShader);
  gl.attachShader(webglolProgram, fragmentShader);

  gl.linkProgram(webglolProgram);

  var attr = gl.getAttribLocation(webglolProgram, 'pos');
  var vertices = [ 0, 0, 0, // center
                   0, 1, 0,
                   1, 0, 0 ];
  var rsize = 3;
  var verticesFloatArray = new Float32Array(vertices);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloatArray, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, rsize, gl.FLOAT, false, 0, 0);

  gl.useProgram(webglolProgram);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

setInterval(webglol, 100);