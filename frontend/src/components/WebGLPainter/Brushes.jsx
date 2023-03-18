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
    <div className="toolbox">
      <div className="square-button" onClick={() => setShowTools( !showTools ) }> 
        <BrushIcon className="icon" />
      </div>
      { brushList }
    </div>
  )
}

export default Brushes;