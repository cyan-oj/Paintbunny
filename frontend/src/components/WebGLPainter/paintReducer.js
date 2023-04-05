import { drawStroke, redraw, createGLContext } from "./utils/gl-helpers"
import { rgbToGL } from "./utils/colorConvert"

export const paintReducer = ( state, action ) => {
  const { type, payload } = action
  switch ( type ) {
    case 'add_stroke': { 
      const newStrokeHistory = [ ...state.strokeHistory ]
      if (payload.points.length > 1) newStrokeHistory.push( payload )
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
      redraw( state.gl, state.glAttributes, newStrokeHistory )
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
      // const glAttributes = getGLAttributes( state.gl )
      drawStroke( state.gl, state.glAttributes, rgbToGL(stroke.color), stroke.points )
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
      newPalette.splice( payload, 1 )
      return { ...state, palette: newPalette }
    }
    case 'remove_brush': {
      const newBrushes = [ ...state.brushes ]
      newBrushes.splice( payload, 1 )
      return { ...state, brushes: newBrushes }
    }
    default: {
      return { ...state, [type]: payload }
    }
  }
}