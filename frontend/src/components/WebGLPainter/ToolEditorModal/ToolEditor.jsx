import { useDispatch, useSelector } from "react-redux";
import { updateUserTools } from "../../../store/users";
import { ReactComponent as TrashIcon } from '../../../icons/trash-bin-sharp.svg'
import { colorString } from "../utils/colorConvert";
import { DEFAULT_PALETTE } from "../Painter";

function ToolEditor({ palette, brushes, activeBrush, activeColor, paintDispatch }) {
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

  const resetPalette = e => {
    user.palette = DEFAULT_PALETTE
    dispatch(updateUserTools(user))
    resetToUserPalette()
  }

  const resetToUserPalette = () => paintDispatch({ type: 'palette', payload: user.palette })

  const setColor = color => paintDispatch({ type: 'activeColor', payload: color })
  const addColor = color => paintDispatch({ type: 'add_color', payload: color })
  const removeColor = index => paintDispatch({ type: 'remove_color', payload: index }) 

  const swatches = palette.map((color , i) =>
    <div className="editor-swatch">
      <div className="square-button swatch"
        key={i}
        value={i} 
        style={{
          backgroundColor: colorString(color), 
          color: colorString(color)
        }}
        onClick={() => setColor( color )}
        >■</div>
      <div className="square-button swatch" onClick={() => removeColor(i) } >
        <TrashIcon className="icon"/>
      </div>
    </div>
  )

  // const brushList = brushes.map((brush, i) =>
  //   <div>
  //     <input
  //       key={i}
  //       type="text" 
  //       value={ brush } 
  //       className="editor-brush" 
  //       onChange={ e => {
  //         if(e.target.value && !isNaN(e.target.value)) {
  //           brushes[i] = parseInt(e.target.value, 10)
  //           setBrushes([...brushes])
  //         } else {
  //           brushes[i] = ''
  //           setVal(testVal+1)
  //         }
  //       }}
  //     />
  //       <button
  //       id="remove-brush"
  //       className="editor-brush"
  //       onClick={ e => removeBrush(i) }
  //     >-</button>
  //   </div>
  // )

  return (
    <div className="toolbox-editor">
      <div className="toolbox">
        { swatches }
      </div>
      {/* <button
        id="add-color"
        className="editor-button"
        value="+"
        onClick={() => addColor( activeColor ) }
      >add color</button> */}
      {/* <div className="brushbox">
        { brushList }
      </div>
      <button
        id="add-brush"
        className="editor-button"
        value="+"
        onClick={ addBrush }
        >add brush</button> */}
      <div className="preset-button">
        <button onClick={ e => updatePalette(e)}>save palette as default</button>
        <button onClick={ e => updateBrushes(e)}>save brushes as default</button>
        <button onClick={ resetPalette } >reset palette to defaults</button>
        <button onClick={ resetToUserPalette } >reset palette user defaults</button>
      </div>
    </div>
  )
}

export default ToolEditor;