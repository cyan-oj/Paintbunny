import { FRAG_SHADER, VERT_SHADER } from '../shaders.js'
import { initShaders } from '../WebGLUtils/cuon-utils.js'
import { rgbToGL } from './colorConvert.js';

const BRUSH_VERTICES = new Float32Array([
  -0.1, 0.1,
  -0.1, -0.1, 
  0.1,  0.1, 
  0.1,  -0.1
]) 

export const drawPoint = ( gl, modelMatrix, glAttributes, color ) => {
  const points = initVertexBuffers(gl, BRUSH_VERTICES, glAttributes.a_Position);
  if (!points) console.error('failed to set vertex positions')
  gl.uniformMatrix4fv( glAttributes.u_ModelMatrix, false, modelMatrix.elements)
  gl.uniform4f(glAttributes.u_FragColor, color[0], color[1], color[2], 1)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export const drawStroke = ( gl, glAttributes, color, points ) => {
  if (!points || points.length < 1) return
  for ( let i = 0; i < points.length; i++ ){
    drawPoint( gl, points[i], glAttributes, color )
  }
}

export const redraw = ( gl, history, clearColor=[ 1.0, 1.0, 1.0, 1.0 ] ) => {
  gl.clearColor( ...clearColor )
  gl.clear( gl.COLOR_BUFFER_BIT )
  if ( history.length < 1 ) return
  const glAttributes = getGLAttributes( gl )
  for ( let i = 0; i < history.length; i++ ) {
    const color = rgbToGL( history[i].color )
    drawStroke( gl, glAttributes, color, history[i].points )
  }
}

export const getStroke = ( point1, point2 ) => { 
  const distance = Math.sqrt( Math.pow( point2.x - point1.x, 2 ) + Math.pow( point2.y - point1.y, 2 ))
  const angle = Math.atan2( point2.x - point1.x, point2.y - point1.y )
  const deltaP = point2.pressure - point1.pressure
  return [ distance, angle, deltaP ]
}

export const initVertexBuffers = ( gl, vertices, a_Position ) => {
  const vertexBuffer = gl.createBuffer();
  if ( !vertexBuffer ){
    console.error( 'failed to create buffer object' )
    return false;
  } 
  gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer )
  gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW )
  gl.vertexAttribPointer( a_Position, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( a_Position );
  return vertices.length/2
}

export const createGLContext = ( width, height, backgroundColor=[ 0.0, 0.0, 0.0, 0.0 ] ) => {
  const canvas = document.createElement( 'canvas' )
  canvas.width = width
  canvas.height = height
  const gl = canvas.getContext( 'webgl', { preserveDrawingBuffer: true })
  gl.clearColor(...backgroundColor);
  gl.clear(gl.COLOR_BUFFER_BIT)
  if ( !gl ) alert( 'Your browser does not support WebGL. Try updating or using another browser, such as the most recent version of Mozilla Firefox' )
  if ( !initShaders( gl, VERT_SHADER, FRAG_SHADER )) console.error( 'failed to initialize shaders' )
  return { canvas, gl }
}

export const getGLAttributes = ( gl ) => {
  const glAttributes = {
    u_ModelMatrix: gl.getUniformLocation(gl.program, 'u_ModelMatrix'),
    a_Position: gl.getAttribLocation(gl.program, 'a_Position'),
    u_FragColor: gl.getUniformLocation(gl.program, 'u_FragColor'),
  }
  return glAttributes
}