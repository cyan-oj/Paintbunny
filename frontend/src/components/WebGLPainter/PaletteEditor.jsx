import { useState, useEffect } from "react"
import convert from 'color-convert'
import { colorString } from "./utils/colorConvert"
import ColorSlider from "./ColorSlider"
import PreviewSpacer from "./PreviewSpacer"

function PaletteEditor({ activeColor, paintDispatch, wideRatio }) {

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

  const addColor = color => paintDispatch({ type: 'add_color', payload: color })

  return (
    <div className="tool-editor">
      <>
        { rgbSliders 
          ?
          <div className='sliders' id='color-sliders'>
            { !wideRatio && <PreviewSpacer paintDispatch={ paintDispatch } /> }
            <ColorSlider value={ rgbColor[0] } valueLabel="red" 
              color={ rgbColor } setValue={ setRGB } index={ 0 }
              leftArrowColor={{ backgroundColor: `rgb(0, ${rgbColor[1]}, ${rgbColor[2]})` }}
              rightArrowColor={{ backgroundColor: `rgb(255, ${rgbColor[1]}, ${rgbColor[2]})` }}
              backgroundImage={{                   
                backgroundImage: `linear-gradient(to right, 
                  rgb(0, ${rgbColor[1]}, ${rgbColor[2]}), 
                  rgb(255, ${rgbColor[1]}, ${rgbColor[2]}))` 
              }}/>
            <ColorSlider value={ rgbColor[1] } valueLabel="green" 
              color={ rgbColor } setValue={ setRGB } index={ 1 }
              leftArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, 0, ${rgbColor[2]})` }}
              rightArrowColor={{ backgroundColor: `rgb(${rgbColor[0]}, 255, ${rgbColor[2]})` }}
              backgroundImage={{                   
                backgroundImage: `linear-gradient(to right, 
                  rgb(${rgbColor[0]}, 0, ${rgbColor[2]}), 
                  rgb(${rgbColor[0]}, 255, ${rgbColor[2]}))` 
              }}/>
            <ColorSlider value={ rgbColor[2] } valueLabel="blue" 
              color={ rgbColor } setValue={ setRGB } index={ 2 }
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
            { !wideRatio && <PreviewSpacer paintDispatch={ paintDispatch } /> }
            <ColorSlider value={ hslColor[0] } valueLabel="hue" 
              color={ hslColor } setValue={ setHSL } index={ 0 } max={ 360 }
              leftArrowColor={{ backgroundColor: `hsl(0, ${hslColor[1]}%, ${hslColor[2]}%)` }}
              rightArrowColor={{ backgroundColor: `hsl(360, ${hslColor[1]}%, ${hslColor[2]}%)` }}
              backgroundImage={{                   
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
              }}/>
            <ColorSlider value={ hslColor[1] } valueLabel="saturation" 
              color={ hslColor } setValue={ setHSL } index={ 1 } max={ 100 }
              leftArrowColor={{ backgroundColor: `hsl(${hslColor[0]}, 0%, ${hslColor[2]}%)` }}
              rightArrowColor={{ backgroundColor: `hsl(${hslColor[0]}, 100%, ${hslColor[2]}%)` }}
              backgroundImage={{                   
                backgroundImage:  `linear-gradient(to right, 
                  hsl(${hslColor[0]}, 0%, ${hslColor[2]}%), 
                  hsl(${hslColor[0]}, 100%, ${hslColor[2]}%))`
              }}/>
            <ColorSlider value={ hslColor[2] } valueLabel="lightness" 
              color={ hslColor } setValue={ setHSL } index={ 2 } max={ 100 }
              leftArrowColor={{ backgroundColor: `hsl(${hslColor[0]}, ${hslColor[1]}%, 0%)` }}
              rightArrowColor={{ backgroundColor: `hsl(${hslColor[0]}, ${hslColor[1]}%, 100%)` }}
              backgroundImage={{                   
                backgroundImage:  `linear-gradient(to right, 
                  hsl(${hslColor[0]}, ${hslColor[1]}%, 0%), 
                  hsl(${hslColor[0]}, ${hslColor[1]}%, 50%), 
                  hsl(${hslColor[0]}, ${hslColor[1]}%, 100%))` 
              }}/>
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
      </>
    </div>
  )
}

export default PaletteEditor;