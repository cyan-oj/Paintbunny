import { useState, useEffect } from "react"
import convert from 'color-convert'
import { colorString } from "./utils/colorConvert"
import CompSlider from "./CompSlider"

function PaletteEditor({ activeColor, paintDispatch }) {

  const [ rgbColor, setColorRGB ] = useState( activeColor )
  const [ hslColor, setColorHSL ] = useState( convert.rgb.hsl( activeColor ))
  const [ rgbSliders, setSliders ] = useState( false )

  useEffect(() => { 
    setColorRGB( activeColor )
    document.documentElement.style.setProperty('--active-color', colorString(activeColor));
  }, [ activeColor ])
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
      <div>
        { rgbSliders 
          ?
          <div className='sliders' id='color-sliders'>
            <CompSlider value={ rgbColor[0] } valueLabel="red" 
              color={ rgbColor } setColor={ setRGB } index={ 0 }
              leftArrowColor={{ backgroundColor: `rgb(0, ${rgbColor[1]}, ${rgbColor[2]})` }}
              rightArrowColor={{ backgroundColor: `rgb(255, ${rgbColor[1]}, ${rgbColor[2]})` }}
              backgroundImage={{                   
                backgroundImage: `linear-gradient(to right, 
                  rgb(0, ${rgbColor[1]}, ${rgbColor[2]}), 
                  rgb(255, ${rgbColor[1]}, ${rgbColor[2]}))` 
              }}/>
            <CompSlider value={ rgbColor[1] } valueLabel="green" 
              color={ rgbColor } setColor={ setRGB } index={ 1 }
              leftArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, 0, ${rgbColor[2]})` }}
              rightArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, 255, ${rgbColor[2]})` }}
              backgroundImage={{                   
                backgroundImage: `linear-gradient(to right, 
                  rgb(${rgbColor[0]}, 0, ${rgbColor[2]}), 
                  rgb(${rgbColor[0]}, 255, ${rgbColor[2]}))` 
              }}/>
            <CompSlider value={ rgbColor[2] } valueLabel="blue" 
              color={ rgbColor } setColor={ setRGB } index={ 2 }
              leftArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, ${rgbColor[1]}, 0)` }}
              rightArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, ${rgbColor[1]}, 255)` }}
              backgroundImage={{                   
                backgroundImage: `linear-gradient(to right, 
                  rgb(${rgbColor[0]}, ${rgbColor[1]}, 0), 
                  rgb(${rgbColor[0]}, ${rgbColor[1]}, 255))`
              }}/>
          </div>
          :
          <div className='sliders' id='color-sliders'>
            <div className="color-slider-box">
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
              <div className="slider-num">{ hslColor[0] }</div>
            </div>
            <div className="color-slider-box">
              <input type='range' min='0' max='100' value={ hslColor[1] } 
                onChange={ e => setHSL( e.target.value, 1 )}
                style={{ 
                  backgroundImage:  `linear-gradient(to right, 
                    hsl(${hslColor[0]}, 0%, ${hslColor[2]}%), 
                    hsl(${hslColor[0]}, 100%, ${hslColor[2]}%))` 
                  }} />
              <div className="slider-num">{ hslColor[1] }</div>
            </div>
            <div className="color-slider-box">
              <input type='range' id="lightness" min='0' max='100' value={ hslColor[2] } 
                onChange={ e => setHSL( e.target.value, 2 )}
                style={{ 
                  backgroundImage:  `linear-gradient(to right, 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 0%), 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 50%), 
                    hsl(${hslColor[0]}, ${hslColor[1]}%, 100%))` 
                  }} />
              <div className="slider-num">{ hslColor[2] }</div>
            </div>
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