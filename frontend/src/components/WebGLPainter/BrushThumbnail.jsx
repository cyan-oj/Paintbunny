import { useEffect, useRef } from "react"
import { drawPoint, getGLAttributes, initVertexBuffers, BRUSH_VERTICES } from "./utils/gl-helpers"

function BrushThumbnail({ brush, thumbnail }){
  const preview = useRef()
  const gl = thumbnail.gl
  const glAttributes = getGLAttributes( gl )

  useEffect(() => { 
    const parent = preview.current
    parent.appendChild( thumbnail.canvas )
    const points = initVertexBuffers(gl, BRUSH_VERTICES, glAttributes.a_Position);
    if (!points) console.error('failed to set vertex positions')
  }, [])

  useEffect(() => {
    gl.clear( gl.COLOR_BUFFER_BIT )
    const transforms = { 
      translate: { x: 0, y: 0 },
      rotate: brush.angle,
      scale: 8 * brush.scale, 
      ratio: brush.ratio, 
      pressure: 1
    }
    drawPoint( gl, transforms, glAttributes, [0.0, 0.0, 0.0, 1.0] )
  }, [ brush, thumbnail ])


  return (
    <div ref={ preview } className="square-button">
      <p className="brush-size">{ brush.scale }</p>
    </div>
  )
}

export default BrushThumbnail;