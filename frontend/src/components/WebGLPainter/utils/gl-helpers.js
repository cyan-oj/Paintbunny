export function initVertexBuffers(gl, vertices, a_Position) {
  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer){
    console.error('failed to create buffer object')
    return false;
  } 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  return vertices.length/2
}