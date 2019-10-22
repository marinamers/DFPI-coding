// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;

varying vec2 vUV;
//varying vec3 vColors;

uniform vec4 uColor;

void main() {
  //gl_FragColor = vec4(vUV, 0.0, 1.0);
  gl_FragColor = vec4(uColor);
}`
