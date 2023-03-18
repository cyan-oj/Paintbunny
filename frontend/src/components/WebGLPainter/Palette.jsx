import { useState } from 'react'
import { colorString } from "./utils/colorConvert"
import { ReactComponent as PaletteIcon } from '../../icons/color-palette-sharp.svg'
import PaletteEditor from './PaletteEditor'

function Palette({ activeColor, palette, paintDispatch }) {
  const [ showTools, setShowTools ] = useState(false)

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
    <div className="toolbox">
      <div className="square-button" onClick={() => setShowTools( !showTools ) }>
        <PaletteIcon className="icon"/>
      </div>
      { swatches }
    { showTools && 
      <PaletteEditor activeColor={ activeColor } paintDispatch={ paintDispatch } />
    }
    </div>
    </>
  )
}

export default Palette;