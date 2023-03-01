import { useEffect, useReducer, useRef } from "react";
import { FRAG_SHADER, VERT_SHADER } from "./shaders";
import { initShaders } from "./WebGLUtils/cuon-utils"

const DEFAULT_PALETTE = [
  [ 0, 0, 0, ],
  [ 255, 255, 255 ]
]

const DEFAULT_BRUSHES = [
  { ratio: 1.0, scale: 1, angle: 0 }
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
  const canvasRef = useRef()
  const glRef = useRef()
  const position = useRef({ x: 0, y: 0 })

  const [ paintState, paintDispatch ] = useReducer( paintReducer, props, init )

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    if ( !gl ) alert( 'Your browser does not support WebGL. Try updating or using another browser, such as the most recent version of Mozilla Firefox' )
    // console.log(gl)
    gl.clearColor( 1.0, 1.0, 1.0, 0.5 )
    gl.clear( gl.COLOR_BUFFER_BIT )
    glRef.current = gl
    if (!initShaders(gl, VERT_SHADER, FRAG_SHADER)) console.error('failed to initialize shaders')
  }, [])


  return (
    <>
      <canvas ref={ canvasRef } width={ paintState.width } height={ paintState.height }/>
    </>
  )
}

export default Painter;