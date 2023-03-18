import { useState } from "react"
import BrushPreview from "./BrushPreview"
import { ReactComponent as BrushIcon } from '../../icons/brush-sharp.svg'

function Brushes({ brushes, activeBrush, brushThumbnails, brushSample, paintDispatch }){
  const [ showTools, setShowTools ] = useState( false )
  console.log(brushThumbnails)
  const setBrush = brush => paintDispatch({ type: 'activeBrush', payload: brush })

  const brushList = brushes.map((brush, i) => 
    <div key={ i }
      onClick={() => setBrush( brush ) }
    >
      <BrushPreview brush={ brush } thumbnail={ brushThumbnails[i] } />
    </div>
  )

  return (
    <>
      <div className="square-button" onClick={() => setShowTools( !showTools ) }> 
        <BrushIcon className="icon" />
      </div>
      { brushList }
      <div className='sliders'>
        <input type='range' min='0.01' step="0.01" max='5' value={ activeBrush.scale }
          onChange={ e => paintDispatch({ type: 'brush_scale', payload: e.target.value })}
        />
        <input type='range' min='0' max='360' value={ activeBrush.angle }
          onChange={ e => paintDispatch({ type: 'brush_angle', payload: e.target.value })}
        />
        <input type='range' min='0.01' step=".01" max="1" value={ activeBrush.ratio }
          onChange={ e => paintDispatch({ type: 'brush_ratio', payload: e.target.value })}
        />
      </div>
    </>
  )
}

export default Brushes;