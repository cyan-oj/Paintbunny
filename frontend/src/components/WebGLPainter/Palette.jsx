import { useState } from 'react'
import { colorString } from "./utils/colorConvert"
import { ReactComponent as PaletteIcon } from '../../icons/color-palette-sharp.svg'

function Palette({ activeColor, palette, paintDispatch }) {
  const [ showTools, setShowTools ] = useState(false)

  const setColor = idx => { paintDispatch({ type: 'activeColor', payload: idx }) }

  const swatches = palette.map((color , i) =>
    <div className="square-button swatch"
      key={i}
      value={i} 
      style={{
        backgroundColor: colorString(color), 
        color: colorString(color)
      }}
      onClick={() => setColor( palette[i] )}
    >■</div>
  )

  return (
    <div className="toolbox">
      <div className="square-button" onClick={ setShowTools }>
        <PaletteIcon className="icon"/>
      </div>
      { swatches }
    </div>
  )
}

export default Palette;