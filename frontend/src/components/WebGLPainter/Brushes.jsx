import BrushThumbnail from "./BrushThumbnail"
import { ReactComponent as BrushIcon } from '../../icons/brush-sharp.svg'

function Brushes({ brushes, activeBrush, brushThumbnails, paintDispatch, showBrushTools }){

  const setBrush = brush => paintDispatch({ type: 'activeBrush', payload: brush })
  const setShowTools = bool => paintDispatch({ type: 'show_brush_tools', payload: bool })

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
    </>
  )
}

export default Brushes;