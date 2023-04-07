import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { paintReducer } from "./paintReducer";
import { createDrawing, fetchDrawing, getDrawing, updateDrawing } from "../../store/drawings";
import { createComment } from "../../store/comments";
import { createGLContext, drawPoint, getGLAttributes, getStroke, initVertexBuffers, BRUSH_VERTICES } from "./utils/gl-helpers";
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
import { fetchIcon, getIcon, updateIcon } from "../../store/icons";

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
    glAttributes: null,
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

  const initCanvas = initialState.canvasType === 'icon' ? createGLContext( 256, 256 ) : createGLContext( 512, 512 )

  initialState.canvas = initCanvas.canvas
  initialState.gl = initCanvas.gl
  initialState.glAttributes = getGLAttributes( initialState.gl )
  const points = initVertexBuffers(initialState.gl, BRUSH_VERTICES, initialState.glAttributes.a_Position);
  if (!points) console.error('failed to set vertex positions')

  initialState.brushSample = createGLContext( 512, 512 )

  for ( let i = 0; i < initialState.brushes.length; i++ ) {
    const thumbnail = createGLContext( 64, 64 )
    initialState.brushThumbnails.push( thumbnail )
  }
  return initialState;
}

function Painter( props ) {//
  const [ paintState, paintDispatch ] = useReducer( paintReducer, props, init )
  const { width, height, 
          title, description, canvasType,
          palette, brushes, 
          activeColor, activeBrush,
          canvas, gl, glAttributes,
          showBrushTools, showColorTools,
          brushSample, brushThumbnails } = paintState

  const [ wideRatio, setWideRatio ] = useState( true )
  const history = useHistory();
  const dispatch = useDispatch();
  const drawing = useSelector(getDrawing( props.drawingId ))
  const icon = useSelector(getIcon( props.iconId ))
  const user = useSelector( state => state.session.user )
  const bgCanvas = useRef( null )
  const bgContext = useRef( null )
  const workspace = useRef( null )

  const [ windowWidth, windowHeight ] = useWindowSize()

  const image = new Image( 512, 512 )
  image.crossOrigin = "anonymous"
  if ( drawing ) image.src = drawing.imageUrl
  if ( icon ) image.src = icon.iconUrl

  const buttonText = props.imgSrc ? "update" : "post"
  const penEvt = useRef({ x: 0, y: 0, pressure: 0 })
  const currentStroke = { 
    color: [ ...activeColor ],
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

    if ( canvasType === 'painting' && drawing ) {
      const getImageData = async () => {
        await dispatch(fetchDrawing( props.drawingUserId, props.drawingId));
        bgContext.current.drawImage(image, 0, 0)
      }
      getImageData()
    }

    if ( canvasType === 'icon' && icon ) { //
      console.log("icon is:", icon)
      const getIconData = async () => {
        await dispatch(fetchIcon( props.userId, props.iconId ))
        bgContext.current.drawImage(image, 0, 0)
      }
      getIconData()
    }
  }, [])

  useLayoutEffect(() => {
    if ( windowWidth >= windowHeight ) {
      setWideRatio( true )
    } else {
      setWideRatio( false )
    }
  }, [ windowWidth, windowHeight ])

  const setPenEvt = ( evt ) => {
    let rect = evt.target.getBoundingClientRect()
    let x = evt.clientX - rect.left
    let y = evt.clientY - rect.top
    const pressure = evt.pointerType === "touch" ? 1 : evt.pressure

    const width = Number(workspace.current.clientWidth)
    const scale = width/512

    if ( canvasType === 'comment' || canvasType === 'icon' ) y /= 2
    x = ( x - width/2 )/( width/2 )
    y = ( height * scale /2 - y )/( height * scale /2 )
    penEvt.current = { x, y, pressure }
    return { x, y, pressure }
  }

  const draw = ( evt, gl, glAttributes, brush, color ) => {
    const prev = { ...penEvt.current }
    const curr = setPenEvt( evt )
    if ( evt.buttons !== 1 ) return
    
    const [ dist, angle, deltaP ] = getStroke( prev, curr )
    const drawColor = rgbToGL( color )
    currentStroke.color = color
    
    for ( let i = 0; i < dist; i+= brush.spacing ) {
      const x = prev.x + Math.sin( angle ) * i
      const y = prev.y + Math.cos( angle ) * i
      const pressure = prev.pressure + deltaP / ( dist/i )
      const transforms = { 
        translate: { x, y },
        rotate: brush.angle,
        scale: brush.scale,
        ratio: brush.ratio, 
        pressure: pressure
      }
      drawPoint( gl, transforms, glAttributes, drawColor )
      currentStroke.points.push( transforms )
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
      formData.append( 'comment[author_id]', user.id )
      formData.append( 'comment[drawing_id]', props.drawingId )
      formData.append('comment[image]', blobData )
      dispatch(createComment( props.drawingId, formData ))
    } else if ( canvasType === 'icon' ) {
      formData.append( 'icon[user_id]', user.id )
      formData.append( 'icon[image]', blobData )

      console.log("blobFormData", formData)

      dispatch(updateIcon( user.id, formData, props.iconId ))
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
        <div className="square-button" onClick={ undo }>
          <UndoIcon className="icon"/>
        </div>
        <div className="square-button" onClick={ redo }>
          <RedoIcon className="icon"/>
        </div>
      </div>
    } 
    <div id="workspace" >
      <div ref={ workspace } id={ canvasType === 'comment' ? "comment-wrapper" : "canvas-wrapper" }
        onPointerMove={ e => draw( e, gl, glAttributes, activeBrush, activeColor )}
        onPointerDown={ setPenEvt } onPointerEnter={ setPenEvt } 
        onPointerUp={() => saveStroke( currentStroke )}
        onPointerLeave={() => saveStroke( currentStroke )}>
        <canvas ref={ bgCanvas } width={ width } height={ height }/>
      </div>
      { !wideRatio &&
        <div className="tools">
          <div className="toolbox">
            { ( showBrushTools || showColorTools )
              ? <BrushSample brushSample={ brushSample }
                  activeBrush={ activeBrush } activeColor={ activeColor }
                  paintDispatch={ paintDispatch } wideRatio={ wideRatio }/>
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

      { ( canvasType === 'icon' ) && 
      <>
        <canvas id='icon-preview' />
      </>
      }

      <ToolEditorModal palette={ palette } brushes={ brushes } activeBrush={ activeBrush } activeColor={ activeColor } brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch }/>
      <form onSubmit={ blobCanvas } className="comment-form">
        { (canvasType === 'painting') &&
        <>
          <input placeholder="title"
            type="text" 
            value={ title }
            onChange={ e => paintDispatch({ type: 'title', payload: e.target.value })}/>
          <textarea placeholder="description"
            type="text"
            value={ description }
            onChange={ e => paintDispatch({ type: 'description', payload: e.target.value })}/>
        </>
        }
        <button type="submit">{ buttonText }</button>
      </form>
    </div>
    { wideRatio &&
      <div className="toolbox">
        <BrushSample brushSample={ brushSample }
            activeBrush={ activeBrush } activeColor={ activeColor } wideRatio={ wideRatio } />
        <BrushEditor paintDispatch={ paintDispatch } activeBrush={ activeBrush } wideRatio={ wideRatio } />
        <Brushes brushes={ brushes } activeBrush={ activeBrush } brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch } showBrushTools={ showBrushTools } brushSample={ brushSample } wideRatio={ wideRatio } />
      </div>
    } 
  </div>
  )
}

export default Painter;