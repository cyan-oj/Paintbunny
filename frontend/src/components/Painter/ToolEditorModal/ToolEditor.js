import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../store/users";
import "./ToolEditor.css"

function ToolEditor() {
  const user = useSelector(state => state.session.user);

  const dispatch = useDispatch();

  const [palette, setPalette] = useState(user.palette);
  const [brushes, setBrushes] = useState(user.brushes);
  const [testVal, setVal] = useState(1);

  useEffect(() => {

  }, [brushes, palette])

  const updateTools = e => {
    e.preventDefault();
    user.palette = palette;
    user.brushes = brushes;
    dispatch(updateUser(user))
  }

  
  const addSwatch = () => {
    palette.push("hsl(0, 0%, 100%)");
    setPalette([...palette]);
  }

  const removeSwatch = i => {
    if (palette[i]) palette.splice( i, 1 );
    setPalette([...palette])
  }

  const addBrush = () => {
    brushes.push(50);
    setBrushes([...brushes])
  } 

  const removeBrush = i => {
    if (brushes[i]) brushes.splice( i, 1 );
    setBrushes([...brushes])
  }


  const swatchList = palette.map((swatch, i) =>
    <div className="editor-swatch-box">
      <input
        key={i}
        type="text" 
        value={ palette[i] } 
        className="editor-swatch" 
        style={{ backgroundColor: swatch }} 
        onChange={ e => {
          palette[i] = e.target.value;
          setPalette([...palette])
        }}
        />
      <button
      id="remove-color"
      className="editor-swatch"
      onClick={ e => removeSwatch(i) }
      >-</button>
    </div>
  )

  const brushList = brushes.map((brush, i) =>
    <div>
      <input
        key={i}
        type="text" 
        value={ brush } 
        className="editor-brush" 
        onChange={ e => {
          if(e.target.value && !isNaN(e.target.value)) {
            brushes[i] = parseInt(e.target.value, 10)
            setBrushes([...brushes])
          } else {
            brushes[i] = ''
            setVal(testVal+1)
          }
        }}
      />
        <button
        id="remove-brush"
        className="editor-brush"
        onClick={ e => removeBrush(i) }
      >-</button>
    </div>
  )

  return (
    <div className="toolbox-editor">
      <div className="swatchbox">
        { swatchList }
      </div>
      <button
        id="add-color"
        className="editor-button"
        value="+"
        onClick={ addSwatch }
      >add color</button>
      <div className="brushbox">
        { brushList }
      </div>

      <button
        id="add-brush"
        className="editor-button"
        value="+"
        onClick={ addBrush }
        >add brush</button>
      <div className="preset-button">
        <button onClick={ e => updateTools(e)}>save presets</button>
      </div>
    </div>
  )
}

export default ToolEditor;