var vertexShader = `
  attribute vec3 pos;

  void main() {
    gl_position = vec4(pos, 2.0);
  }
`;