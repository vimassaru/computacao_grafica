const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  throw new Error('WebGL not suported');
}

// 1. vertexData = [...]

// 2. create buffer
// 3. load vertexData into buffer

// 4. create vertexShader
// 5. create fragmentShader
// 6. create program
// 7. attach shaders to program

// 8. enable vertex attributes
// 9. draw the image

// step 1
const vertexData = [
  0,
  1,
  0, // coordinates (x, y, z)
  1,
  -1,
  0,
  -1,
  -1,
  0,
];

// step 2
const buffer = gl.createBuffer();

// step 3
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

// step 4
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(
  vertexShader,
  `
  attribute vec3 position;
  void main() {
    gl_Position = vec4(position, 1);
  }
  `
);
gl.compileShader(vertexShader);

// step 5
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
  `
);
gl.compileShader(fragmentShader);

// step 6
const program = gl.createProgram();

// step 7
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// step 8
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// step 9
gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);
