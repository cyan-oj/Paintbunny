import React, { useEffect, useState } from "react";
import "./ToolEditor.css"

function ToolEditor({ brushes = [], palette = [] }) {

  const [newPalette, setPalette] = useState(palette);
  const [newBrushes, setBrushes] = useState(brushes);
  const [testVal, setVal] = useState(1);

  useEffect(() => {

  }, [newBrushes])

  const updateBrushes = (size, i) => {
    const currentBrushes = newBrushes;
    const sizeInt = parseInt(size, 10)
    currentBrushes[i] = sizeInt;
    setBrushes(currentBrushes);
    console.log(newBrushes);
  }

  const updateTools = () => {

  }

  const swatchList = newPalette.map((swatch, i) =>
    <input
      key={i}
      type="text" 
      value={swatch} 
      className="editor-swatch" 
      style={{ backgroundColor: swatch }} 
    />
  )

  const brushList = newBrushes.map((brush, i) =>
    <input
      key={i}
      type="text" 
      value={ brush } 
      className="editor-brush" 
      onChange={ e => {
        if(e.target.value && !isNaN(e.target.value)) {
          newBrushes[i] = parseInt(e.target.value, 10)
          setBrushes([...newBrushes])
          console.log("newBrushes", newBrushes)
        } else {
          newBrushes[i] = ''
          setVal(testVal+1)
          console.log("newBrushes", newBrushes)
        }
      }}
    />
  )

  return (
    <form onSubmit={ updateTools }>
      <input value={testVal} onChange={ e => setVal(e.target.value)} />
      <div className="swatchbox">
        { swatchList }
      </div>
      <div className="brushbox">
        { brushList }
      </div>
    </form>
  )
}

export default ToolEditor;