import { useEffect, useReducer, useRef } from "react";
import { FRAG_SHADER, VERT_SHADER } from "./shaders";
import { initShaders } from "./WebGLUtils/cuon-utils"
import { Matrix4 } from "./WebGLUtils/cuon-matrix" 
import { drawPoint, getGLAttributes, getStroke, initVertexBuffers } from "./utils/gl-helpers";
import { rgbToGL } from "./utils/colorConvert";

const DEFAULT_PALETTE = [
  [ 255, 0, 0 ],
  [ 0, 0, 0 ]
]

const DEFAULT_BRUSHES = [
  { ratio: 0.5, scale: 1, angle: 30, spacing: 0.004 }
]

const init = ( props ) => {
  const initialState = {
    width: props.width ? props.width : 512,
    height: props.height ? props.height : 512,
    palette: props.palette ? props.palette : DEFAULT_PALETTE,
    brushes: props.brushes ? props.brushes : DEFAULT_BRUSHES,
    activeColor: 0,
    activeBrush: 0,
  }
  return initialState;
}

const paintReducer = ( state, action ) => {
  const { type, payload } = action
  switch ( type ) {
    default: return { ...state, [type]: payload }
  }
}

function Painter( props ) {
  const { width, height, palette, brushes, activeColor, activeBrush } = paintState
  const [ paintState, paintDispatch ] = useReducer( paintReducer, props, init )
  
  const canvasRef = useRef()
  const glRef = useRef()
  const penEvt = useRef({ x: 0, y: 0, pressure: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if ( !gl ) alert( 'Your browser does not support WebGL. Try updating or using another browser, such as the most recent version of Mozilla Firefox' )
    gl.clearColor( 1.0, 1.0, 1.0, 0.5 )
    gl.clear( gl.COLOR_BUFFER_BIT )
    glRef.current = gl
    if (!initShaders(gl, VERT_SHADER, FRAG_SHADER)) console.error('failed to initialize shaders')
  }, [])

  const setPosition = ( evt ) => {
    const rect = evt.target.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    x = (x - width/2)/(width/2);
    y = (height/2 - y)/(height/2);
    const pressure = evt.pressure
    penEvt.current = { x, y, pressure }
    return { x, y, pressure }
  }

  const draw = ( evt, gl, brush, color ) => {
    const prev = { ...penEvt.current }
    const curr = setPosition( evt )
    if (evt.buttons !== 1 ) return

    const [ dist, angle, deltaP ] = getStroke( prev, curr )
    console.log( dist, angle, deltaP )
    const drawColor = rgbToGL( color )
    // const pressure = evt.pressure * 1
    const glAttributes = getGLAttributes( gl )
    const modelMatrix = new Matrix4();
    
    for ( let i = 0; i < dist; i+= brush.spacing ) {
      const x = prev.x + Math.sin( angle ) * i
      const y = prev.y + Math.cos( angle ) * i
      const pressure = prev.pressure + deltaP / ( dist/i )
      modelMatrix.setTranslate( x, y, 0.0 )
      modelMatrix.rotate( brush.angle, 0, 0, 1 )
      modelMatrix.scale(  pressure * brush.ratio, pressure )
      drawPoint(gl, modelMatrix, glAttributes, drawColor)
    } 
  }


  return (
    <>
      <canvas ref={ canvasRef } width={ paintState.width } height={ paintState.height }
        onPointerMove={ e => draw( e, glRef.current, brushes[activeBrush], palette[activeColor] )}
        onPointerDown={ setPosition }
        onPointerEnter={ setPosition }
      />
    </>
  )
}

export default Painter;