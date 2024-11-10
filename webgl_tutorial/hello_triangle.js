/* Display an error in our error box*/
function showError(errorText) {
  const errorBoxDiv = document.querySelector('#error-box');
  const errorTextElement = document.createElement('p');
  errorTextElement.innerText = errorText;
  errorBoxDiv.appendChild(errorTextElement);
  console.log(errorText);
}

// showError('Thats our error message!');

function helloTriangle() {
  /**  @type {HTMLCanvasElement|null} */
  const canvas = document.querySelector('#canvas');

  if (!canvas) {
    showError(
      'Cannot get canvas reference. Check for typos or loading script too early in HTML'
    );
    return;
  }

  const gl = canvas.getContext('webgl2');

  if (!gl) {
    showError(
      `This browser does not support WebGL 2 - this demo will not work.`
    );
    return;
  }

  // Create triangles vertices
  const triangleVertices = [
    // Top Middle
    0.0, 0.5,
    // Bottom Left
    -0.5, -0.5,
    // Bottom Right
    0.5, -0.5,
  ];

  // Create a float32 array for our GPU process the data
  const triangleVerticesCpuBuffer = new Float32Array(triangleVertices);

  // Create a buffer on GPU side to read those javascript data
  const triangleGeoBuffer = gl.createBuffer();

  // Attach data using the arrayBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW);

  // Vertex Code for GPU
  const vertexShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec2 vertexPosition;

    void main(){
      gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }
  `;

  // Create a vertexShader to compile to GPU
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);

  // Checking compiling sintax for vertexShader
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    showError(`Failed to COMPILE vertex shader: ${compileError}`);
    return;
  }

  // Fragment Shader for GPU Code
  const fragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    out vec4 outputColor;

    void main() {
      outputColor = vec4(0.294, 0.0, 0.51, 1.0);
    }
  `;

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);

  // Checking compiling errors for fragmentShader
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(fragmentShader);
    showError(`Failed to COMPILE fragment shader: ${compileError}`);
    return;
  }

  // Combine fragment and vertex shaders into a program
  const triangleShaderProgram = gl.createProgram();
  gl.attachShader(triangleShaderProgram, vertexShader);
  gl.attachShader(triangleShaderProgram, fragmentShader);
  gl.linkProgram(triangleShaderProgram);

  // Cheking for link errors if there's any.
  if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(triangleShaderProgram);
    showError(`Failed to LINK shaders: ${linkError}`);
  }

  const vertexPositionAttribLocation = gl.getAttribLocation(
    triangleShaderProgram,
    'vertexPosition'
  );

  if (vertexPositionAttribLocation < 0) {
    showError(`Failed to get attrib location for vertexPosition`);
  }

  // Output merger - how to merge the shaded pixel fragment with the existing output image

  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  // Clear color with gl.clearColor
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterizer - which pixel are part of our triangle

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set GPU Program (vertex + fragment shader pair)
  gl.useProgram(triangleShaderProgram);
  gl.enableVertexAttribArray(vertexPositionAttribLocation);

  // Input assembler - how to read vertices from our GPU triangle buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    /** index: which attribute to use */
    vertexPositionAttribLocation,
    /** size: how many components in that attribute */
    2,
    /** type: what is the data type stored in the GPU buffer for this attribute? */
    gl.FLOAT,
    /** normalized: determines how to convert integers into floats */
    false,
    /** stride: how many bytes to move forward in the buffer to find the same attribute for the next vertex */
    /** SETTING to 0, WebGL will figure it out how many it should move. */
    // 2 * Float32Array.BYTES_PER_ELEMENT,
    0,
    /** offset: how many bytes should the input assembler skip into the buffer when reading attributes */
    0
  );

  // Draw Call - call draw function which also configures primitive assembly
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

try {
  helloTriangle();
} catch (e) {
  showError(`Uncaught JavasScript exception: ${e}`);
}
