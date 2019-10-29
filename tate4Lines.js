var regl = require('regl')()
var glm = require('gl-matrix')
var mat4 = glm.mat4

// import the shader from external files
// we are going to use different shader here because the 3D model doesn't have 'color' attributes
// we are going to use the 'uv' attribute instead
var vertStr = require('./shaders/vertex02.js')
var fragStr = require('./shaders/fragment02.js')

// import the loadObj tool
var loadObj = require('./utils/loadObj.js')

// create the projection matrix for field of view
var projectionMatrix = mat4.create()
var fov = 75 * Math.PI / 180
var aspect = window.innerWidth / window.innerHeight
var near = 0.01
var far = 1000
mat4.perspective(projectionMatrix, fov, aspect, near, far)

// create the view matrix for defining where the camera is looking at
var viewMatrix = mat4.create()
var eye = [0, 0, 5]
var center = [0, 0, 0]
var up = [0, 1, 0]
mat4.lookAt(viewMatrix, eye, center, up)

var clear = () => {
  regl.clear({
    color: [0, 0, 0, 1] // black
  })
}

var currTime = 0
var r = 0.5
var mouseX = 0
var mouseY = 0

// create mapping function to map the mouse position to camera position
function map (value, start, end, newStart, newEnd) {
  var percent = (value - start) / (end - start)
  if (percent < 0) {
    percent = 0
  }
  if (percent > 1) {
    percent = 1
  }
  var newValue = newStart + (newEnd - newStart) * percent
  return newValue
}

// create event listener for mouse move event in order to get mouse position

window.addEventListener('mousemove', function (event) {
  var x = event.clientX // get the mosue position from the event
  var y = event.clientY

  mouseX = map(x, 0, window.innerWidth, -5, 5)
  mouseY = -map(y, 0, window.innerHeight, -5, 5)
})

// create a variable for draw call
var drawCube
var drawCube2
var drawLines
var drawSquare

// instead of creating the attributes ourselves, now loading the 3d model instead
loadObj('./assets/lines_1.obj', function (obj) {
  console.log('Model Loaded', obj)

  // create attributes
  const attributes = {
    aPosition: regl.buffer(obj.positions),
    aUV: regl.buffer(obj.uvs)
  }
  
  // create the draw call and assign to the drawCube variable that we created
  // so we can call the drawCube in the render function
  drawCube = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uScale: regl.prop('scale'),
      uColor: regl.prop ('color')
    },
    vert: vertStr,
    frag: fragStr,
    attributes: attributes,
    count: obj.count // don't forget to use obj.count as count
  })
  drawCube2 = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uScale: regl.prop('scale'),
      uColor: regl.prop ('color')
    },
    vert: vertStr,
    frag: fragStr,
    attributes: attributes,
    count: obj.count // don't forget to use obj.count as count
  })
})
loadObj('./assets/lines_1.obj', function (obj) {
  console.log('Model Loaded', obj)

  // create attributes
  const attributes = {
    aPosition: regl.buffer(obj.positions),
    aUV: regl.buffer(obj.uvs),
    //aColor: regl.buffer(obj.colors),
  }
  drawLines = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uScale: regl.prop('scale'),
      uColor: regl.prop ('color')
    },
    vert: vertStr,
    frag: fragStr,
    attributes: attributes,
    count: obj.count // don't forget to use obj.count as count
  })
})

loadObj('./assets/full_1.obj', function (obj) {
  console.log('Model Loaded', obj)

  // create attributes
  const attributes = {
    aPosition: regl.buffer(obj.positions),
    aUV: regl.buffer(obj.uvs),
    //aColor: regl.buffer(obj.colors),
  }
  drawSquare = regl({
    uniforms: {
      uTime: regl.prop('time'),
      uProjectionMatrix: regl.prop('projection'),
      uViewMatrix: regl.prop('view'),
      uTranslate: regl.prop('translate'),
      uScale: regl.prop('scale'),
      uColor: regl.prop ('color'),
      uTranparency: regl.prop ('transparency')
    },
    vert: vertStr,
    frag: fragStr,
    attributes: attributes,
    count: obj.count // don't forget to use obj.count as count
  })
})


function render () {
  currTime += 0.02
  //create variable to control math.sin and math.cos time
  var sc = 0.9 
  
  // clear the background
  clear()

  // recalculate the view matrix because we are constantly moving the camera position now
  // use mouseX, mouseY for the position of camera
  var eye = [0, 0, 5]
  var center = [0, 0, 0]
  var up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)

  //3d model takes time to load, therefore check if drawCube is exist first before calling it
  // if (drawCube !== undefined) {
  //   // create an object for uniform
  //   var obj = {
  //     time: currTime,
  //     projection: projectionMatrix,
  //     view: viewMatrix,
  //     translate: [0, 0, 0],
  //     scale: [2,5,1],
  //     color: [0,0,0,Math.sin(currTime)]
  //   }

  //   // draw the cube, don't forget the pass the obj in for uniform
  //   //drawCube(obj)
  // }
  var kR= 1
  var kG= 0
  var kB= 0
  var check
    
  if (drawCube2 !== undefined) {
    // create an object for uniform
    var numCube2= 12
    var startCube2 = -numCube2/2
    

    for (k=0; k<numCube2; k++){
      for (m=0; m<numCube2; m++){
        var obj = {
        time: currTime,
        projection: projectionMatrix,
        view: viewMatrix,
        translate: [k*Math.sin(currTime*0.8) + startCube2 , m + startCube2,0],
        scale:[0.09*k,0.09,0.09],
        //scale: [Math.random(), Math.random(), Math.random()],
        color: [kR*k*0.08,kG*k*0.08,kB*k*0.03,0.2]
       }
       // draw the cube, don't forget the pass the obj in for uniform
       drawCube2(obj)
       //check time to change color and count how many times it is changing
       check = currTime % 15    
       if (check > 5){
        kR= 1
        kG= 1
        kB= 0
       }
       if (check>10) {
        kR= 0
        kG= 0
        kB= 1
       }
       }
      
   }
  }

  if (drawLines !== undefined) {
    // create an object for uniform
    var num2 =7
    
    for(j=0;j<num2; j++){
      var obj = {
      time: currTime,
      projection: projectionMatrix,
      view: viewMatrix,
      translate: [Math.sin(currTime*sc)*2*j+5,Math.cos(currTime*sc)*3,-1],
      scale: [Math.cos(currTime),Math.cos(currTime),0.3],
      color: [0,0,0,0]
    } 

    // draw the cube, don't forget the pass the obj in for uniform
    drawLines(obj)}
    
  }
  //var to automate y to time
  var newY =  Math.cos(currTime*sc)*3 + 0.2
  
  //drawing the object in loop// create an object for uniform
  if (drawSquare !== undefined) {
    //number of objects in my grid
    var num =14

    var start = -num/2
    for (i=0; i<num; i++){
      for (j=0;j<num; j++){
        var obj = {
        time: currTime,
        projection: projectionMatrix,
        view: viewMatrix,
        translate: [start + i,start + j,1.1],
        scale: [0.9,0.9,0.9],
        color: [0,0,0,1]
       } 
       // draw the cube, don't forget the pass the obj in for uniform
       drawSquare(obj)
      }
      
    }
  }
  // make it loop
  window.requestAnimationFrame(render)
}

render()