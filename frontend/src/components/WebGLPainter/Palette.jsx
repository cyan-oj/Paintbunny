import { colorString } from "./utils/colorConvert"
import { ReactComponent as PaletteIcon } from '../../icons/color-palette-sharp.svg'
import PaletteEditor from './PaletteEditor'

function Palette({ activeColor, palette, paintDispatch, showColorTools }) {

  const setShowTools = bool => paintDispatch({ type: 'showColorTools', payload: bool })
  const setColor = color => paintDispatch({ type: 'activeColor', payload: color })

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
    <>
      <div className="square-button" onClick={() => setShowTools( !showColorTools ) }>
        <PaletteIcon className="icon"/>
      </div>
      { swatches }
      { showColorTools && 
        <PaletteEditor activeColor={ activeColor } paintDispatch={ paintDispatch } />
      }
    </>
  )
}

export default Palette;