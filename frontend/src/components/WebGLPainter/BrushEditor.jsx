import CompSlider from "./CompSlider"
import PreviewSpacer from "./PreviewSpacer"

function BrushEditor({ paintDispatch, activeBrush, wideRatio }){

  const addBrush = () => {
    paintDispatch({
      type: 'add_brush',
      payload: {
        ratio: activeBrush.ratio,
        scale: activeBrush.scale,
        angle: activeBrush.angle,
        spacing: activeBrush.spacing
      }
    })
  }

  return (
    <div className="tool-editor">
      <div className='sliders' id="brush-sliders">
        { !wideRatio &&
          <PreviewSpacer paintDispatch={ paintDispatch } />
        }
        <CompSlider  dispatch={ paintDispatch } type={ 'brush_scale' }
          value={ activeBrush.scale } valueLabel='scale'
          min={ 0.05 } max={ 10 } step={ 0.05 }
          />
        <CompSlider  dispatch={ paintDispatch } type={ 'brush_angle' }
          value={ activeBrush.angle } valueLabel='angle'
          min={ 0 } max={ 360 }
          />
        <CompSlider  dispatch={ paintDispatch } type={ 'brush_ratio' }
          value={ activeBrush.ratio } valueLabel='ratio'
          min={ 0.01 } max={ 1 } step={ 0.01 } cutoff={ 2 }
          />
        <CompSlider  dispatch={ paintDispatch } type={ 'brush_spacing' }
          value={ activeBrush.spacing } valueLabel='spacing'
          min={ 0.004 } max={ 1 } step={ 0.004 } cutoff={ 3 }
          />
      </div>
      <div>
        <button onClick={ addBrush } >add brush preset</button>
      </div>
    </div>
  )
}

export default BrushEditor