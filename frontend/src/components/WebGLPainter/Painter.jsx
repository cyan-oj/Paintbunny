import { useEffect, useReducer, useRef } from "react";
import { Matrix4 } from "./WebGLUtils/cuon-matrix" 
import { createGLContext, drawPoint, drawStroke, getGLAttributes, getStroke, playback, redraw } from "./utils/gl-helpers";
import { rgbToGL } from "./utils/colorConvert";
import Palette from "./Palette.jsx";
import BrushSample from "./BrushSample.jsx"
import Brushes from "./Brushes";
import { ReactComponent as UndoIcon } from '../../icons/arrow-undo-sharp.svg'
import { ReactComponent as RedoIcon } from '../../icons/arrow-redo-sharp.svg'
import './Painter.css';

const DEFAULT_PALETTE = [
  [ 255, 0, 0 ],
  [ 0, 0, 0 ]
]

const DEFAULT_BRUSHES = [
  { ratio: 0.5, scale: 1, angle: 30, spacing: 0.004 },
  { ratio: 1, scale: 5, angle: 0, spacing: 0.004 }
]

const init = ( props ) => {
  const initialState = {
    width: props.width ? props.width : 512,
    height: props.height ? props.height : 512,
    canvas: null,
    gl: null,
    palette: props.palette ? props.palette : DEFAULT_PALETTE,
    brushes: props.brushes ? props.brushes : DEFAULT_BRUSHES,
    activeColor: [ 0, 255, 0 ],
    activeBrush: { ratio: 0.5, scale: 1, angle: 30, spacing: 0.004 },
    showBrushTools: false,
    showColorTools: false,
    brushSample: {},
    brushThumbnails: [],
    historySize: 20,
    strokeHistory: [],
    redoCache: []
  }

  const initCanvas = createGLContext( 
    initialState.width, 
    initialState.height, 
    [ 1.0, 1.0, 1.0, 1.0 ]
  )

  initialState.canvas = initCanvas.canvas
  initialState.gl = initCanvas.gl

  initialState.brushSample = createGLContext( 256, 256 )

  for ( let i = 0; i < initialState.brushes.length; i++ ) {
    const thumbnail = createGLContext( 40, 40 )
    initialState.brushThumbnails.push( thumbnail )
  }
  return initialState;
}

const paintReducer = ( state, action ) => {
  const { type, payload } = action
  switch ( type ) {
    case 'add_stroke': { 
      const newStrokeHistory = [ ...state.strokeHistory ]
      newStrokeHistory.push( payload )
      return { ...state, strokeHistory: newStrokeHistory }
    } 
    case 'brush_ratio': {
      const newBrush = { ...state.activeBrush }
      newBrush.ratio = payload
      return { ...state, activeBrush: newBrush }
    }
    case 'brush_angle': {
      const newBrush = { ...state.activeBrush }
      newBrush.angle = payload
      return { ...state, activeBrush: newBrush }
    }
    case 'brush_scale': {
      const newBrush = { ...state.activeBrush }
      newBrush.scale = payload
      return { ...state, activeBrush: newBrush }
    }
    case 'undo': {
      const newStrokeHistory = [ ...state.strokeHistory ]
      if ( newStrokeHistory.length < 1 ) return { ...state }
      const newRedoCache = [ ...state.redoCache ]
      const stroke = newStrokeHistory.pop()
      newRedoCache.push( stroke )
      redraw( state.gl, newStrokeHistory )
      return { 
        ...state,
        strokeHistory: newStrokeHistory,
        redoCache: newRedoCache
      }
    }
    case 'redo': {
      const newRedoCache = [ ...state.redoCache ]
      if ( newRedoCache.length < 1 ) return { ...state }
      const newStrokeHistory = [ ...state.strokeHistory ]
      const stroke = newRedoCache.pop()
      newStrokeHistory.push( stroke )
      const glAttributes = getGLAttributes( state.gl )
      drawStroke( state.gl, glAttributes, rgbToGL(stroke.color), stroke.points )
      return { 
        ...state,
        redoCache: newRedoCache,
        strokeHistory: newStrokeHistory
      }
    }
    case 'add_color': {
      const newPalette = [ ...state.palette ]
      newPalette.push( payload )
      return { ...state, palette: newPalette }
    }
    default: {
      return { ...state, [type]: payload }
    }
  }
}

function Painter( props ) {
  const [ paintState, paintDispatch ] = useReducer( paintReducer, props, init )
  const { width, height, palette, brushes, 
          activeColor, activeBrush,
          canvas, gl,
          showBrushTools, showColorTools,
          brushSample, brushThumbnails } = paintState
  
  const workspace = useRef()
  const penEvt = useRef({ x: 0, y: 0, pressure: 0 })
  const currentStroke = { 
    color: activeColor,
    points: [] 
  }

  useEffect(() => {
    const parent = workspace.current
    parent.appendChild(canvas)
  }, [ canvas ])

  const setPenEvt = ( evt ) => {
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
    const curr = setPenEvt( evt )
    if (evt.buttons !== 1 ) return
    
    const [ dist, angle, deltaP ] = getStroke( prev, curr )
    const drawColor = rgbToGL( color )
    currentStroke.color = color
    const glAttributes = getGLAttributes( gl )
    
    for ( let i = 0; i < dist; i+= brush.spacing ) {
      const x = prev.x + Math.sin( angle ) * i
      const y = prev.y + Math.cos( angle ) * i
      const pressure = prev.pressure + deltaP / ( dist/i )
      const modelMatrix = new Matrix4()
      modelMatrix.setTranslate( x, y, 0.0 )
      modelMatrix.rotate( brush.angle, 0, 0, 1 )
      modelMatrix.scale(  pressure * brush.ratio * brush.scale, pressure * brush.scale )
      drawPoint( gl, modelMatrix, glAttributes, drawColor )
      currentStroke.points.push( modelMatrix )
    } 
  }

  const saveStroke = ( stroke ) => {
    paintDispatch({
      type: 'add_stroke',
      payload: stroke
    })
  }

  const undo = () => paintDispatch({ type: 'undo' })
  const redo = () => paintDispatch({ type: 'redo' })

  return (
  <>
    {/* <button onClick={() => console.log( paintState )}>log state</button> */}
    <div ref={ workspace } width={ paintState.width } height={ paintState.height }
      onPointerMove={ e => draw( e, gl, activeBrush, activeColor )}
      onPointerDown={ setPenEvt }
      onPointerEnter={ setPenEvt }
      onPointerUp={() => saveStroke( currentStroke )}
    />
    <div className="tools">
      <div className="toolbox">
        <div className="square-button" onClick={ undo }>
          <UndoIcon className="icon"/>
        </div>
        <div className="square-button" onClick={ redo }>
          <RedoIcon className="icon"/>
        </div>
        <Palette activeColor={ activeColor } palette={ palette } paintDispatch={ paintDispatch } showColorTools={ showColorTools } />
        <Brushes brushes={ brushes } activeBrush={ activeBrush } brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch } showBrushTools={ showBrushTools } />
      </div>
      { ( showBrushTools || showColorTools )
        ? <BrushSample brushSample={ brushSample } activeBrush={ activeBrush } activeColor={ activeColor }  />
        : null
      }
    </div>
  </>
  )
}

export default Painter;