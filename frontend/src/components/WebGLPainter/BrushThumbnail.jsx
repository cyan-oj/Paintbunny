import { useEffect, useRef } from "react"
import { drawPoint, getGLAttributes } from "./utils/gl-helpers"
import { Matrix4 } from "./WebGLUtils/cuon-matrix"

function BrushThumbnail({ brush, thumbnail }){
  const preview = useRef()

  useEffect(() => {
    const parent = preview.current
    parent.appendChild( thumbnail.canvas )
    const gl = thumbnail.gl
    const glAttributes = getGLAttributes( gl )
    const modelMatrix = new Matrix4()
    gl.clear( gl.COLOR_BUFFER_BIT )
    modelMatrix.setTranslate( 0, 0, 0.0 )
    modelMatrix.rotate( brush.angle, 0, 0, 1 )
    modelMatrix.scale( 0.8 * brush.ratio * 10, 0.8 * 10 )
    drawPoint( gl, modelMatrix, glAttributes, [0.0, 0.0, 0.0, 1.0] )
  }, [ brush, thumbnail ])


  return (
    <div className="brush-thumb" >
      <div ref={ preview } />
      <p>{ brush.scale }</p>
    </div>
  )
}

export default BrushThumbnail;