import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
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
import PaletteEditor from "./PaletteEditor";
import BrushEditor from "./BrushEditor";
import { useWindowSize } from "../../hooks";
import ToolEditorModal from "./ToolEditorModal";

export const DEFAULT_PALETTE = [
  [ 255, 255, 255 ], 
  [ 245, 200, 110 ], 
  [ 230, 125, 85 ], 
  [ 190, 50, 40 ], 
  [ 100, 115, 75 ], 
  [ 75, 70, 120 ], 
  [ 60, 40, 55 ], 
  [ 0, 0, 0 ], 
]

export const DEFAULT_BRUSHES = [
  { ratio: 1, scale: 0.1, angle: 30, spacing: 0.004 },
  { ratio: 1, scale: 5, angle: 0, spacing: 0.004 },
  { ratio: 0.01, scale: 2, angle: 180, spacing: 0.002 },
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
    activeColor: [ 0, 0, 0 ],
    activeBrush: { ratio: 1, scale: 0.1, angle: 30, spacing: 0.004 },
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

  initialState.brushSample = createGLContext( 512, 512 )

  for ( let i = 0; i < initialState.brushes.length; i++ ) {
    const thumbnail = createGLContext( 64, 64 )
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
    case 'brush_spacing': {
      const newBrush = { ...state.activeBrush }
      newBrush.spacing = payload
      console.log(newBrush.spacing, state.activeBrush.spacing)
      return { ...state, activeBrush: newBrush }
    }
    case 'undo': {
      const newStrokeHistory = [ ...state.strokeHistory ]
      if ( newStrokeHistory.length < 1 ) return { ...state }
      const newRedoCache = [ ...state.redoCache ]
      const stroke = newStrokeHistory.pop()
      newRedoCache.push( stroke )
      redraw( state.gl, newStrokeHistory )
      return { ...state,
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
      return { ...state,
        redoCache: newRedoCache,
        strokeHistory: newStrokeHistory
      }
    }
    case 'close_tools': {
      return { ...state, 
        showBrushTools: false,
        showColorTools: false
      }
    }
    case 'show_brush_tools': {
      return { ...state,
        showBrushTools: payload,
        showColorTools: false
      }
    }
    case 'show_color_tools': {
      return { ...state,
        showBrushTools: false,
        showColorTools: payload
      }
    }
    case 'add_color': {
      const newPalette = [ ...state.palette ]
      newPalette.push( payload )
      return { ...state, palette: newPalette }
    }
    case 'add_brush': {
      const newBrushes = [ ...state.brushes]
      newBrushes.push(payload)
      const newPreviews = [ ...state.brushThumbnails ]
      const newThumb = createGLContext( 64, 64 )
      newPreviews.push( newThumb )
      return { ...state, brushes: newBrushes, brushThumbnails: newPreviews }
    }
    case 'remove_color': {
      const newPalette = [ ...state.palette ]
      newPalette.splice(payload, 1)
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

  const [ wideRatio, setWideRatio ] = useState( true )
  const history = useHistory();
  const dispatch = useDispatch();
  const drawing = useSelector(getDrawing( props.drawingId ))
  const user = useSelector( state => state.session.user )
  const bgCanvas = useRef( null )
  const bgContext = useRef( null )
  const workspace = useRef( null )

  const [ windowWidth, windowHeight ] = useWindowSize()

  const image = new Image( 512, 512 )
  image.crossOrigin = "anonymous"
  if ( drawing ) image.src = drawing.imageUrl

  const buttonText = props.imgSrc ? "edit" : "post"
  const penEvt = useRef({ x: 0, y: 0, pressure: 0 })
  const currentStroke = { 
    color: activeColor,
    points: [] 
  }

  useEffect(() => {
    const parent = workspace.current
    parent.appendChild( canvas )

    const background = bgCanvas.current
    bgContext.current = background.getContext('2d')
    const context = bgContext.current
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height)

    if ( canvasType === 'painting') {
      const getImageData = async () => {
        await dispatch(fetchDrawing( props.drawingUserId, props.drawingId));
      }
      if ( drawing ) {
        getImageData()
        bgContext.current.drawImage(image, 0, 0)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if ( windowWidth >= windowHeight ) {
      setWideRatio( true )
    } else {
      setWideRatio( false )
    }
    console.log({wideRatio})
  }, [ windowWidth, windowHeight ])

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
    const context = bgContext.current
    context.drawImage( canvas, 0, 0 )
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
      props.toggleEdit()
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
  <div id="paint-container">
    {/* <button onClick={() => console.log( paintState )}>log state</button> */}
    { wideRatio &&
      <div className="toolbox">
        <Palette activeColor={ activeColor } palette={ palette } paintDispatch={ paintDispatch } showColorTools={ showColorTools } wideRatio={ wideRatio } />
        <PaletteEditor activeColor={ activeColor } paintDispatch={ paintDispatch } wideRatio={ wideRatio } />
      </div>
    } 
    <div id="workspace" >
      <div ref={ workspace } id="canvas-wrapper"
        style={{
          width: width,
          height: height
        }}
        onPointerMove={ e => draw( e, gl, activeBrush, activeColor )}
        onPointerDown={ setPenEvt }
        onPointerEnter={ setPenEvt }
        onPointerUp={() => saveStroke( currentStroke )}
      >
        <canvas ref={ bgCanvas } width={ width } height={ height }/>
      </div>
      { !wideRatio &&
        <div className="tools">
          <div className="toolbox">
            { ( showBrushTools || showColorTools )
              ? <BrushSample brushSample={ brushSample }
                  activeBrush={ activeBrush } activeColor={ activeColor } />
              : null
            }
            { showColorTools &&
              <PaletteEditor activeColor={ activeColor } paintDispatch={ paintDispatch } />
            }
            { showBrushTools &&
              <BrushEditor paintDispatch={ paintDispatch } activeBrush={ activeBrush } wideRatio={ wideRatio }/>
            }
            <div className="square-button" onClick={ undo }>
              <UndoIcon className="icon"/>
            </div>
            <div className="square-button" onClick={ redo }>
              <RedoIcon className="icon"/>
            </div>
            <Palette palette={ palette } activeColor={ activeColor } 
              paintDispatch={ paintDispatch } showColorTools={ showColorTools } wideRatio={ wideRatio }/>
            <Brushes brushes={ brushes } activeBrush={ activeBrush } 
              brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch } 
              showBrushTools={ showBrushTools } wideRatio={ wideRatio }/>
          </div>
        </div>
      }
      <ToolEditorModal palette={ palette } brushes={ brushes } activeBrush={ activeBrush } activeColor={ activeColor } paintDispatch={ paintDispatch }/>
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
    </div>
    { wideRatio &&
      <div className="toolbox">
        <BrushSample brushSample={ brushSample }
            activeBrush={ activeBrush } activeColor={ activeColor } />
        <Brushes brushes={ brushes } activeBrush={ activeBrush } brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch } showBrushTools={ showBrushTools } brushSample={ brushSample } wideRatio={ wideRatio } />
        <BrushEditor paintDispatch={ paintDispatch } activeBrush={ activeBrush } wideRatio={ wideRatio } />
      </div>
    } 
  </div>
  )
}

export default Painter;