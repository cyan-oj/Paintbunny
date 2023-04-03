import { useEffect, useRef } from "react"
import { drawPoint, getGLAttributes } from "./utils/gl-helpers"

function BrushThumbnail({ brush, thumbnail }){
  const preview = useRef()

  useEffect(() => {
    const parent = preview.current
    parent.appendChild( thumbnail.canvas )
    const gl = thumbnail.gl
    const glAttributes = getGLAttributes( gl )
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