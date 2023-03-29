import { useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { createDrawing, fetchDrawing, getDrawing, updateDrawing } from "../../store/drawings";
import { createComment } from "../../store/comments";
import { Matrix4 } from "./WebGLUtils/cuon-matrix" 
import { createGLContext, drawPoint, drawStroke, getGLAttributes, getStroke, playback, redraw } from "./utils/gl-helpers";
import { rgbToGL } from "./utils/colorConvert";
import Palette from "./Palette.jsx";
import BrushSample from "./BrushSample.jsx"
import Brushes from "./Brushes";
import { ReactComponent as UndoIcon } from '../../icons/arrow-undo-sharp.svg'
import { ReactComponent as RedoIcon } from '../../icons/arrow-redo-sharp.svg'
import './Painter.css';
import { fetchUser } from "../../store/users";

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
    title: props.title ? props.title : '',
    description: props.description ? props.description : '',
    canvasType: props.canvasType ? props.canvasType : 'painting',
    canvas: null,
    gl: null,
    bgContext: null,
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
    initialState.height
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
  const { width, height, 
          title, description, canvasType,
          palette, brushes, 
          activeColor, activeBrush,
          canvas, gl,
          showBrushTools, showColorTools,
          brushSample, brushThumbnails } = paintState

  const history = useHistory();
  const dispatch = useDispatch();
  const drawing = useSelector(getDrawing( props.drawingId ))
  const user = useSelector( state => state.session.user )

  const bgCanvas = useRef( null )
  const bgContext = useRef( null )

  const image = new Image( 512, 512 )
  image.crossOrigin = "anonymous"
  if ( drawing ) image.src = drawing.imageUrl
  const buttonText = props.imgSrc ? "edit" : "post"
  
  const workspace = useRef()
  const penEvt = useRef({ x: 0, y: 0, pressure: 0 })
  const currentStroke = { 
    color: activeColor,
    points: [] 
  }

  useEffect(() => {
    const parent = workspace.current
    parent.appendChild( canvas )

    bgContext.current = bgCanvas.current.getContext('2d')
    bgContext.current.fillStyle = "white";
    bgContext.current.fillRect(0, 0, bgCanvas.width, bgCanvas.height)
    const getImageData = async () => {
      const response = await dispatch(fetchDrawing( props.drawingUserId, props.drawingId));
    }
    getImageData();
    if ( drawing ) {
      bgContext.current.drawImage(image, 0, 0)
    }
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

  const dataURItoBlob = ( dataURI ) => {
    const binary = atob( dataURI.split(',')[1] );
    const array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push( binary.charCodeAt( i ) );
    }
    return new Blob([new Uint8Array( array )], { type: 'image/png' });
  }

  const blobCanvas = e => {
    e.preventDefault();
    bgContext.current.drawImage( canvas, 0, 0 )
    const dataURL = bgCanvas.current.toDataURL("img/png");
    const blobData = dataURItoBlob( dataURL );
    const formData = new FormData();

    if (canvasType === 'comment') {
      formData.append('comment[author_id]', user.id);
      formData.append('comment[drawing_id]', props.drawingId)
      formData.append('comment[image]', blobData)
      dispatch(createComment( props.drawingId, formData ))
    } else if ( props.imgSrc && (props.drawingUserId === user.id) ) {
      formData.append('drawing[title]', title);
      formData.append('drawing[description]', description)
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(updateDrawing( user.id, props.drawingId, formData ))
      props.toggleEdit();
    } else {
      formData.append('drawing[title]', title);
      formData.append('drawing[description]', description)
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(createDrawing( user.id, formData ))
      history.push(`/users/${user.id}`)
    }
  }

  return (
  <>
    {/* <button onClick={() => console.log( paintState )}>log state</button> */}
    <div ref={ workspace } width={ paintState.width } height={ paintState.height }
      onPointerMove={ e => draw( e, gl, activeBrush, activeColor )}
      onPointerDown={ setPenEvt }
      onPointerEnter={ setPenEvt }
      onPointerUp={() => saveStroke( currentStroke )}
    />
    <canvas ref={ bgCanvas } width={ paintState.width } height={ paintState.height }/>
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
    <form onSubmit={ blobCanvas } className="comment-form">
      { (canvasType === 'painting') &&
      <>
        <input placeholder="title"
          type="text" 
          value={ title }
          onChange={ e => paintDispatch({ type: 'title', payload: e.target.value })}
          />
        <textarea placeholder="description"
          type="text"
          value={ description }
          onChange={ e => paintDispatch({ type: 'description', payload: e.target.value })}
          />
      </>
      }
      <button type="submit">{ buttonText }</button>
    </form>
  </>
  )
}

export default Painter;