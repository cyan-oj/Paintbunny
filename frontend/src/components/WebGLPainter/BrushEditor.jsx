import PreviewSpacer from "./PreviewSpacer"

function BrushEditor({ paintDispatch, activeBrush }){

  return (
    <div className='sliders' id="brush-sliders">
      <PreviewSpacer paintDispatch={ paintDispatch } />
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
  )
}

export default BrushEditor

