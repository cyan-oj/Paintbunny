import { colorString } from "./utils/colorConvert"
import { ReactComponent as PaletteIcon } from '../../icons/color-palette-sharp.svg'
import PaletteEditor from './PaletteEditor'

function Palette({ palette, paintDispatch, showColorTools, wideRatio }) {

  const setColor = color => paintDispatch({ type: 'activeColor', payload: color })
  const setShowTools = bool => paintDispatch({ type: 'show_color_tools' , payload: bool })

  const swatches = palette.map((color , i) =>
    <div className="square-button swatch"
      key={i}
      value={i} 
      style={{
        backgroundColor: colorString(color), 
        color: colorString(color)
      }}
      onClick={() => setColor( color )}
    >■</div>
  )

  return (
    // <div className="toolbox">
    <>
      { !wideRatio &&
        <div className="square-button" onClick={() => setShowTools( !showColorTools ) }>
          <PaletteIcon className="icon"/>
        </div>
      }
      { swatches }
    </>
    // </div>
  )
}

export default Palette;