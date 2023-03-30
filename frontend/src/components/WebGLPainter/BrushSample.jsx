import { useEffect, useRef } from "react"
import { drawPoint, getGLAttributes } from "./utils/gl-helpers"
import { Matrix4 } from "./WebGLUtils/cuon-matrix"

function BrushSample({ brushSample, activeBrush, activeColor }){
  const preview = useRef()

  useEffect(() => {
    const parent = preview.current
    parent.appendChild( brushSample.canvas )
    const gl = brushSample.gl
    const glAttributes = getGLAttributes( gl )
    const modelMatrix = new Matrix4()
    const drawColor = [0.0, 0.0, 0.0, 1.0]
    gl.clear( gl.COLOR_BUFFER_BIT )
    modelMatrix.setTranslate( 0, 0, 0.0 )
    modelMatrix.rotate( activeBrush.angle, 0, 0, 1 )
    modelMatrix.scale( activeBrush.scale * activeBrush.ratio, activeBrush.scale )
    drawPoint( gl, modelMatrix, glAttributes, drawColor )
  }, [ activeBrush, brushSample ])

  return (
    <div ref={ preview } className="brush-sample" />
  )
}

export default BrushSample;