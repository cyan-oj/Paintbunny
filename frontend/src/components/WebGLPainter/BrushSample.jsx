import { useEffect, useRef } from "react"
import PreviewSpacer from "./PreviewSpacer"
import { rgbToGL } from "./utils/colorConvert"
import { drawPoint, getGLAttributes, initVertexBuffers, BRUSH_VERTICES } from "./utils/gl-helpers"

function BrushSample({ brushSample, activeBrush, activeColor, wideRatio, paintDispatch }){
  const preview = useRef()
  const gl = brushSample.gl
  const glAttributes = getGLAttributes( gl )

  useEffect(() => {
    const parent = preview.current
    parent.appendChild( brushSample.canvas )
    const points = initVertexBuffers(gl, BRUSH_VERTICES, glAttributes.a_Position);
    if (!points) console.error('failed to set vertex positions')
  })

  useEffect(() => {
    const scaleMult = wideRatio ? 2 : 1
    const drawColor = rgbToGL(activeColor)
    gl.clear( gl.COLOR_BUFFER_BIT )
    const transforms = { 
      translate: { x: 0, y: 0 },
      rotate: activeBrush.angle,
      scale: activeBrush.scale/scaleMult, 
      ratio: activeBrush.ratio, 
      pressure: 1
    }
    // modelMatrix.setTranslate( 0, 0, 0.0 )
    // modelMatrix.rotate( activeBrush.angle, 0, 0, 1 )
    // modelMatrix.scale( activeBrush.scale/scaleMult * activeBrush.ratio, activeBrush.scale/scaleMult )
    drawPoint( gl, transforms, glAttributes, drawColor )
  }, [ activeBrush, activeColor, brushSample ])

  return (
    <>
      <div ref={ preview } className="brush-sample" /> 
      { !wideRatio &&
        <PreviewSpacer paintDispatch={ paintDispatch } />
      }
    </>
  )
}

export default BrushSample;