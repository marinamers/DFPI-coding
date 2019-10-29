// module.exports is the preserved word for exporting
// copy & paste the vertex shader from javascript file

module.exports = `
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aUV;

// setup the uniforms for projection / view matrix
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

// setup the uniform for time
uniform float uTime;

// setup the uniform for translate
uniform vec3 uTranslate;

uniform vec3 uScale;
uniform vec3 uRotate;

uniform vec4 uColors;

// setup varying to pass the uv to the fragment
varying vec2 vUV;

//rotate
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

void main() {
  vec3 pos = aPosition;
  float angle = cos(uTranslate.x + uTranslate.y + uTime);
  //pos.xy = rotate(pos.xy, uRotate.x);// for tate experimet1
  pos.xy = rotate(pos.xy,angle);
  //uRotate.xyz *= 0.3;


  // add the translate to the position
  pos.yxz*=0.3 * uScale.x;
  pos += uTranslate;

  gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);
  vUV = aUV;
 
}`
