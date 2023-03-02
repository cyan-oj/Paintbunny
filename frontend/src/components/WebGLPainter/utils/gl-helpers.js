const BRUSH_VERTICES = new Float32Array([
  -0.1, 0.1,
  -0.1, -0.1, 
  0.1,  0.1, 
  0.1,  -0.1
]) 

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

export const getGLAttributes = ( gl ) => {
  const glAttributes = {
    u_ModelMatrix: gl.getUniformLocation(gl.program, 'u_ModelMatrix'),
    a_Position: gl.getAttribLocation(gl.program, 'a_Position'),
    u_FragColor: gl.getUniformLocation(gl.program, 'u_FragColor'),
  }
  return glAttributes
}

export const drawPoint = ( gl, modelMatrix, glAttributes, color ) => {
  const points = initVertexBuffers(gl, BRUSH_VERTICES, glAttributes.a_Position);
  if (!points) console.error('failed to set vertex positions')
  gl.uniformMatrix4fv( glAttributes.u_ModelMatrix, false, modelMatrix.elements)
  gl.uniform4f(glAttributes.u_FragColor, color[0], color[1], color[2], 1)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}