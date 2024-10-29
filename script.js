// Initialisierung von WebGL
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL wird von Ihrem Browser nicht unterstützt.");
}

// Vertex-Shader-Programm
const vertexShaderSource = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// Fragment-Shader-Programm
const fragmentShaderSource = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.0, 0.8, 0.8, 1.0); // Cyanfarbene Linien
  }
`;

// Shader kompilieren und verlinken
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

// Funktion zur Erstellung der Kreispunkte
function createCircleVertices(xCenter, yCenter, radius, numPoints) {
  const vertices = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints;
    const x = xCenter + radius * Math.cos(angle);
    const y = yCenter + radius * Math.sin(angle);
    vertices.push(x, y);
  }
  return vertices;
}

// Berechnung der Blume des Lebens
const numCirclePoints = 40;     //Anzahl der Punkte pro Kreis
const sqrt3 = Math.sqrt(3);

// Skalierung basierend auf Canvas-Größe
const scaleFactor = 0.3;    //Skalierung der gesamten Abbildung
const radius = scaleFactor; // Setzt den Radius relativ zur Canvas-Größe
const circleCenters = [
  [0, 0], // Zentraler Kreis
  [radius, 0], // Rechts
  [-radius, 0], // Links
  [0.5 * radius, 0.5 * sqrt3 * radius], // Oben rechts
  [-0.5 * radius, 0.5 * sqrt3 * radius], // Oben links
  [0.5 * radius, -0.5 * sqrt3 * radius], // Unten rechts
  [-0.5 * radius, -0.5 * sqrt3 * radius], // Unten links

  // Zweite Schicht
  [1.5 * radius, 0.5 * sqrt3 * radius], // Rechts oben
  [-1.5 * radius, 0.5 * sqrt3 * radius], // Links oben
  [1.5 * radius, -0.5 * sqrt3 * radius], // Rechts unten
  [-1.5 * radius, -0.5 * sqrt3 * radius], // Links unten
  [0, sqrt3 * radius], // Oben
  [0, -sqrt3 * radius], // Unten

  // Dritte Schicht
  [2 * radius, 0], // Weiter rechts
  [-2 * radius, 0], // Weiter links
  [radius, sqrt3 * radius], // Oben rechts
  [-radius, sqrt3 * radius], // Oben links
  [radius, -sqrt3 * radius], // Unten rechts
  [-radius, -sqrt3 * radius] // Unten links
];

// Render-Funktion für jeden Kreis
function drawCircle(vertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
}

// Zeichenfunktion
gl.useProgram(program);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Alle Kreise im Muster zeichnen
for (const [x, y] of circleCenters) {
  const circleVertices = createCircleVertices(x, y, radius, numCirclePoints);
  drawCircle(circleVertices);
}