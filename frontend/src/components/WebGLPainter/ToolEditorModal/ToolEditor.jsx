import { useDispatch, useSelector } from "react-redux";
import { updateUserTools } from "../../../store/users";
import { ReactComponent as TrashIcon } from '../../../icons/trash-sharp.svg'
import { colorString } from "../utils/colorConvert";
import { DEFAULT_BRUSHES, DEFAULT_PALETTE } from "../Painter";
import BrushThumbnail from "../BrushThumbnail";
import PaletteEditor from "../PaletteEditor";
import BrushEditor from "../BrushEditor";

function ToolEditor({ palette, brushes, activeBrush, activeColor, brushThumbnails, paintDispatch }) {
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const updatePalette = e => {
    user.palette = palette;
    dispatch(updateUserTools(user))
  }
  const updateBrushes = e => {
    user.brushes = brushes;
    dispatch(updateUserTools(user))
  }

  const resetPalette = () => {
    user.palette = DEFAULT_PALETTE
    dispatch(updateUserTools(user))
    resetToUserPalette()
  }
  const resetBrushes = () => {
    user.brushes = DEFAULT_BRUSHES
    dispatch(updateUserTools(user))
    resetToUserBrushes()
  }

  const resetToUserPalette = () => paintDispatch({ type: 'palette', payload: user.palette })
  const resetToUserBrushes= () => paintDispatch({ type: 'brushes', payload: user.brushes })

  const setColor = color => paintDispatch({ type: 'activeColor', payload: color })
  const setBrush = brush => paintDispatch({ type: 'activeBrush', payload: brush })
  const removeColor = index => paintDispatch({ type: 'remove_color', payload: index }) 
  const removeBrush = index => paintDispatch({ type: 'remove_brush', payload: index }) 
  const addColor = color => paintDispatch({ type: 'add_color', payload: color })
  const addBrush = () => {
    paintDispatch({
      type: 'add_brush',
      payload: {
        ratio: activeBrush.ratio,
        scale: activeBrush.scale,
        angle: activeBrush.angle,
        spacing: activeBrush.spacing
      }
    })
  }

  const swatches = palette.map((color , i) =>
      <div className="square-button"
        key={i}
        style={{
          backgroundColor: colorString(color), 
          color: colorString(color)
        }}
        onClick={() => setColor( color )}>
        <TrashIcon className="small-icon" onClick={() => removeColor(i) }/>
      </div>
  )

  const brushList = brushes.map((brush, i) => 
    <div key={ i } className="square-button"
      onClick={() => setBrush( brush )}>
      <BrushThumbnail brush={ brush } thumbnail={ brushThumbnails[i] } />
      <TrashIcon className="small-icon" onClick={() => removeBrush(i) } />
    </div>
  )

  return (
    <div className="toolbox-editor">
      <div> 
        <div className="toolbox">
          { swatches }
          <PaletteEditor activeColor={ activeColor } paintDispatch={ paintDispatch } wideRatio={ true }/>
          <button onClick={ e => updatePalette(e)}>save palette as default</button>
          <button onClick={ resetPalette } >reset palette to defaults</button>
          <button onClick={ resetToUserPalette } >reset palette user defaults</button>
        </div>
      </div>
      <div className="toolbox">
        { brushList }
        <BrushEditor paintDispatch={ paintDispatch } activeBrush={ activeBrush } wideRatio={ true }/>
        <button onClick={ e => updateBrushes(e)}>save brushes as default</button>
        <button onClick={ resetBrushes } >reset palette to defaults</button>
        <button onClick={ resetToUserBrushes } >reset palette user defaults</button>
      </div>
    </div>
  )
}

export default ToolEditor;