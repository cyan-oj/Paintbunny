import { useState, useEffect } from "react"
import { colorString } from "./utils/colorConvert"
import convert from 'color-convert'

function PaletteEditor({ activeColor, paintDispatch }) {

  const [ rgbColor, setColorRGB ] = useState( activeColor )
  const [ hslColor, setColorHSL ] = useState( convert.rgb.hsl( activeColor ))
  const [ rgbSliders, setSliders ] = useState( false )

  useEffect(() => setColorRGB( activeColor ), [ activeColor ])
  useEffect(() => setColorHSL( convert.rgb.hsl( rgbColor )), [ rgbColor ])

  const setRGB = ( value, index ) => {
    const newRGB = [ ...rgbColor ]
    newRGB[index] = Number( value )
    paintDispatch({
      type: 'activeColor',
      payload: newRGB
    })
  }

  const setHSL = ( value, index ) => {
    const newHSL = [ ...hslColor ]
    newHSL[index] = Number( value )
    const newRGB = convert.hsl.rgb( newHSL )
    paintDispatch({
      type: 'activeColor',
      payload: newRGB
    })
  }

  const addColor = ( color )=> {
    paintDispatch({
      type: 'add_color',
      payload: color
    })
  }

  return (
    <div className="tool-editor">
      {/* <div className="color-edit-swatch" style={{ backgroundColor: colorString( activeColor ) }}/> */}
      <div>
        { rgbSliders 
          ?
          <div className='sliders' id='rgb-sliders'>
              <input type='range' min='0' max='255' value={ rgbColor[0] } 
                onChange={ e => setRGB( e.target.value, 0 )}
                style={{ 
                  backgroundImage: `linear-gradient(to right, 
                    rgb(0, ${rgbColor[1]}, ${rgbColor[2]}), 
                    rgb(255, ${rgbColor[1]}, ${rgbColor[2]}))` 
                  }} />
              <label htmlFor="red">red
                <input type="number" min='0' max='255' value={ rgbColor[0] } 
                  onChange={ e => setRGB( e.target.value, 0 )} />
              </label>
              <input type='range' min='0' max='255' value={ rgbColor[1] } 
                onChange={ e => setRGB( e.target.value, 1 )}
                style={{ 
                  backgroundImage: `linear-gradient(to right, 
                    rgb(${rgbColor[0]}, 0, ${rgbColor[2]}), 
                    rgb(${rgbColor[0]}, 255, ${rgbColor[2]}))` 
                  }} />
              <label htmlFor="green">green
                  <input type="number"min='0' max='255' value={ rgbColor[1] } 
                    onChange={ e => setRGB( e.target.value, 1 )} />
                </label>
              <input type='range' min='0' max='255' value={ rgbColor[2] } 
                onChange={ e => setRGB( e.target.value, 2 )}
                style={{ 
                  backgroundImage: `linear-gradient(to right, 
                    rgb(${rgbColor[0]}, ${rgbColor[1]}, 0), 
                    rgb(${rgbColor[0]}, ${rgbColor[1]}, 255))` 
                  }} />
              <label htmlFor="blue">blue
                <input type="number" min='0' max='255' value={ rgbColor[2] } 
                  onChange={ e => setRGB( e.target.value, 2 )} />
              </label>
            </div>
          :
          <div className='sliders' id='hsl-sliders'>
              <input type='range' id='hue' min='0' max='360' value={ hslColor[0] } 
                onChange={ e => setHSL( e.target.value, 0 )} 
                style={{ 
                  backgroundImage: `linear-gradient(to right, 
                    hsl(0, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(45, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(90, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(135, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(180, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(225, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(270, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(315, ${hslColor[1]}%, ${hslColor[2]}%),
                    hsl(360, ${hslColor[1]}%, ${hslColor[2]}%))` 
                  }} />
              <label htmlFor="hue">hue
                <input type="number" min='0' max='100' value={ hslColor[0] }
                  onChange={ e => setHSL( e.target.value, 0 )} />
              </label>
              <input type='range' min='0' max='100' value={ hslColor[1] } 
                onChange={ e => setHSL( e.target.value, 1 )}
                style={{ 
                  backgroundImage:  `linear-gradient(to right, 
                    hsl(${hslColor[0]}, 0%, ${hslColor[2]}%), 
                    hsl(${hslColor[0]}, 100%, ${hslColor[2]}%))` 
                  }} />
              <label htmlFor="saturation">saturation
                <input type="number" min='0' max='100' value={ hslColor[1] }
                  onChange={ e => setHSL( e.target.value, 1 )} />
              </label>
              <input type='range' min='0' max='100' value={ hslColor[2] } 
                onChange={ e => setHSL( e.target.value, 2 )}
                style={{ 
                  backgroundImage:  `linear-gradient(to right, 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 0%), 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 50%), 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 100%))` 
                  }} />
              <label htmlFor="lightness">lightness
                <input type="number" min='0' max='100' value={ hslColor[2] }
                  onChange={ e => setHSL( e.target.value, 2 )} />
              </label>
            </div>
        }
        <div>
          <button className={ rgbSliders ? 'named-icon-active' : 'named-icon' }
            onClick={() => setSliders(true)}
            >rgb</button>
          <button className={ rgbSliders ? 'named-icon' : 'named-icon-active' }
            onClick={() => setSliders( false )}
            >hsl</button>
          <button
            onClick={() => addColor( activeColor ) }
            >add color</button>
        </div>
      </div>
    </div>
  )
}

export default PaletteEditor;