import { useEffect, useReducer, useRef } from "react";
import { FRAG_SHADER, VERT_SHADER } from "./shaders";
import { initShaders } from "./WebGLUtils/cuon-utils"
import { Matrix4 } from "./WebGLUtils/cuon-matrix" 
import { initVertexBuffers } from "./utils/gl-helpers";

const BRUSH_VERTICES = new Float32Array([
  -0.1, 0.1,
  -0.1, -0.1, 
  0.1,  0.1, 
  0.1,  -0.1
]) 

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

  const { width, height, palette, brushes, activeColor, activeBrush } = paintState

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

  const setPosition = ( evt ) => {
    const rect = evt.target.getBoundingClientRect();
    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;
    x = (x - width/2)/(width/2);
    y = (height/2 - y)/(height/2);
    position.current = { x, y }
    return { x, y }
  }

  const draw = ( evt, gl, brush, color ) => {
    setPosition( evt )
    if (evt.buttons !== 1 ) return

    const pos = position.current
    console.log(pos)
    const u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
    const modelMatrix = new Matrix4();

    const points = initVertexBuffers(gl, BRUSH_VERTICES, a_Position);
    if (!points) console.error('failed to set vertex positions')
    console.log(points)

    modelMatrix.setTranslate( pos.x, pos.y, 0.0 )
    // modelMatrix.rotate( brush.angle, 0, 0, 1 )
    modelMatrix.scale( evt.pressure, evt.pressure )
    gl.uniformMatrix4fv( u_ModelMatrix, false, modelMatrix.elements)
    gl.uniform4f(u_FragColor, 0.3, 0.8, 0.8, 1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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