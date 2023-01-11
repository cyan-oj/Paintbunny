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

  const removeSwatch = i => {
    if (palette[i]) palette.splice( i, 1 );
    setPalette([...palette])
  }

  const addSwatch = () => {
    palette.push("hsl(0, 0%, 100%)");
    setPalette([...palette]);
  }

  const addBrush = () => {
    brushes.push(50);
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
  )

  return (
    <div className="toolbox-editor">
      <div className="swatchbox">
        { swatchList }
        <button
          id="add-color"
          className="editor-swatch"
          value="+"
          onClick={ addSwatch }
        >+</button>
      </div>
      <div className="brushbox">
        { brushList }
        <button
          id="add-brush"
          className="editor-brush"
          value="+"
          onClick={ addBrush }
        >+</button>
      </div>
      <button onClick={ e => updateTools(e)}>save presets</button>
    </div>
  )
}

export default ToolEditor;