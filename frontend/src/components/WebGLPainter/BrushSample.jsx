import { useEffect, useRef } from "react"
import { rgbToGL } from "./utils/colorConvert"
import { drawPoint, getGLAttributes } from "./utils/gl-helpers"
import { Matrix4 } from "./WebGLUtils/cuon-matrix"

function BrushSample({ brushSample, activeBrush, activeColor, wideRatio }){
  const preview = useRef()

  useEffect(() => {
    const scaleMult = wideRatio ? 2 : 1
    const parent = preview.current
    parent.appendChild( brushSample.canvas )
    const gl = brushSample.gl
    const glAttributes = getGLAttributes( gl )
    const modelMatrix = new Matrix4()
    const drawColor = rgbToGL(activeColor)
    gl.clear( gl.COLOR_BUFFER_BIT )
    modelMatrix.setTranslate( 0, 0, 0.0 )
    modelMatrix.rotate( activeBrush.angle, 0, 0, 1 )
    modelMatrix.scale( activeBrush.scale/scaleMult * activeBrush.ratio, activeBrush.scale/scaleMult )
    drawPoint( gl, modelMatrix, glAttributes, drawColor )
  }, [ activeBrush, activeColor, brushSample ])

  return (
    <div ref={ preview } className="brush-sample" />
  )
}

export default BrushSample;