import BrushThumbnail from "./BrushThumbnail"
import { ReactComponent as BrushIcon } from '../../icons/brush-sharp.svg'

function Brushes({ brushes, activeBrush, brushThumbnails, paintDispatch, showBrushTools }){

  const setBrush = brush => paintDispatch({ type: 'activeBrush', payload: brush })
  const setShowTools = bool => paintDispatch({ type: 'showBrushTools', payload: bool })

  const brushList = brushes.map((brush, i) => 
    <div key={ i }
      onClick={() => setBrush( brush ) }
    >
      <BrushThumbnail brush={ brush } thumbnail={ brushThumbnails[i] } />
    </div>
  )

  return (
    <>
      <div className="square-button" onClick={() => setShowTools( !showBrushTools ) }> 
        <BrushIcon className="icon" />
      </div>
      { brushList }
      { showBrushTools &&
        <div className='sliders' id="brush-sliders">
          <div className="slider-box">
            <input type='range' min='0.05' step="0.05" max='10' value={ activeBrush.scale }
              onChange={ e => paintDispatch({ type: 'brush_scale', payload: e.target.value })}
              />
            <label htmlFor="number">size
              <input type="number" min='0.05' step="0.05" max='10' value={ activeBrush.scale }
                onChange={ e => paintDispatch({ type: 'brush_scale', payload: e.target.value })} />
            </label>
          </div>
          <div className="slider-box">
            <input type='range' min='0' max='360' value={ activeBrush.angle }
              onChange={ e => paintDispatch({ type: 'brush_angle', payload: e.target.value })}
              />
            <label htmlFor="number">angle
              <input type="number" min='0' max='360' value={ activeBrush.angle }
              onChange={ e => paintDispatch({ type: 'brush_angle', payload: e.target.value })} />
            </label>
          </div>
          <div className="slider-box">
            <input type='range' min='0.01' step=".01" max="1" value={ activeBrush.ratio }
              onChange={ e => paintDispatch({ type: 'brush_ratio', payload: e.target.value })}
              />
            <label htmlFor="number">ratio
              <input type="number" min='0.01' step=".01" max="1" value={ activeBrush.ratio }
              onChange={ e => paintDispatch({ type: 'brush_ratio', payload: e.target.value })} />
            </label>
          </div>
        </div>
      }
    </>
  )
}

export default Brushes;