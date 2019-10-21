const regl = require('regl')()

//const vertStr = require('./shaders/shaderVertObj')
//const fragStr = require('./shaders/shaderFragObj')

const loadObj = require ('./utils/loadObj.js') //we call the function that is on the foldrer utils and loadObject
console.log(loadObj);

const glm = require('gl-matrix')
var mat4 = glm.mat4

var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
mat4.perspective(projectionMatrix, fov, aspect, 0.01, 1000.0)

var viewMatrix = mat4.create()
mat4.lookAt(viewMatrix, [0, 0, 2], [0, 0, 0], [0, 1, 0])

//setting mouseX mouseY
var mouseX = 0
var mouseY= 0

//creating function  Event Listener to make mouseX mouseY, and add it to the camera settings on the render function.
window.addEventListener('mousemove', function (e) {

  var percentX = e.clientX / window.innerWidth // 0 ~ 1
  var percentY = e.clientY / window.innerHeight // 0 ~ 1

  percentX = percentX * 2 - 1 // -1 ~ 1
  percentY = percentY * 2 - 1 // -1 ~ 1

  var moveRange = 50
  mouseX = -percentX * moveRange
  mouseY = percentY * moveRange

  })

var drawCube;

var colX
var colY
var colZ

//load my 3dobject
loadObj('./assets/frame.obj', function(obj){
  console.log('Model Loaded',obj)

  // create attributes
  var attributes = {
      aPosition: regl.buffer(obj.positions),
      aUV: regl.buffer(obj.uvs)
  }

  //create our draw call
  drawCube = regl({
      uniforms: {
          uTime: regl.prop('time'),
          uProjectionMatrix: regl.prop('projection'),
          uViewMatrix: regl.prop('view'),
          uTranslate: regl.prop('translate'),
        },

      vert:vertStr,
      frag: fragStr,
      attributes:attributes,
      count:obj.count
  })
  
})
 

var currTime = 0

const clear = () => {
  regl.clear({
    color: [colX, colY, colZ ,1]
  })
}
var fragStr = `
precision mediump float;
varying vec2 vUV;

uniform vec3 uTranslate;
uniform float uTime;

void main() {
  //gl_FragColor = vec4(vUV,0.0, 1.0);
  //gl_FragColor = vec4(uTranslate, 1.0);

 gl_FragColor = vec4(uTranslate , 1.0);
}`

var vertStr = `
precision mediump float;

attribute vec3 aPosition;
attribute vec2 aUV;

uniform float uTime;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

uniform vec3 uTranslate;
uniform vec3 uColor;

varying vec2 vUV;

void main() {
 vec3 pos = aPosition;

  pos.x *=0.1;
  pos.z *=0.1;
  pos.y *=0.1;

   pos += uTranslate*4.0;

 gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0); //be sure that I asign that position in the parenthesis
 vUV = aUV;
}`
//const r = 0.5

function render () {
  currTime += 0.01
  var cameraRadius =250

 //creating variables to change camera position
  var cameraX = mouseX  //var cameraX = Math.sin(currTime) * cameraRadius
  var cameraZ = Math.sin(currTime) * cameraRadius

//depnding my camera to the position of mouse x and animate it with cos(currTime)
  mat4.lookAt(viewMatrix, [cameraX, 0,cameraZ], [0, 0, 0], [0, 0, 1])

 //changing background color depending on the position of mouse
 if ((cameraX>0) && (mouseY>0)) {
   colX=1
   colY=1
   colZ=0
 }else if ((cameraX>0) && (mouseY<0)){
  colX=0
  colY=0
  colZ=1
 }else if ((cameraX<0) && (mouseY>0)){
  colX=0
  colY=0
  colZ=0
 }else {
  colX=1
  colY=0
  colZ=0
 }

  clear()
  //because i draw the cube couple of seconds after 
  if (drawCube != undefined){
    var num =15

    for (var i=0; i<num; i++) {
      for (var j=0; j<num; j++){
        for (var k=0; k<num; k++){ 
          var obj = {
          time : currTime,
          projection: projectionMatrix,
          view: viewMatrix,
          translate: [i*2 -5*2,j*3-5*3,k*4-5*4],
          color: [i/num, j/num, 0]} 
           
          drawCube(obj)
        }
           
      } 
    }
                    
  }
  window.requestAnimationFrame(render)
}
render()
