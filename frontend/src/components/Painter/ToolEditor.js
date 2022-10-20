import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/users";
import "./ToolEditor.css"

function ToolEditor({ user }) {
  console.log(user)
  const dispatch = useDispatch();

  const [palette, setPalette] = useState(user.palette);
  const [brushes, setBrushes] = useState(user.brushes);
  const [testVal, setVal] = useState(1);

  useEffect(() => {

  }, [brushes, palette])

  const updateTools = e => {
    e.preventDefault();
    console.log(brushes);
    console.log(palette);
    user.palette = palette;
    user.brushes = brushes;
    console.log(user);
    dispatch(updateUser(user))
  }

  const swatchList = palette.map((swatch, i) =>
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
      </div>
      <div className="brushbox">
        { brushList }
      </div>
      <button onClick={ e => updateTools(e)}>update tools</button>
    </div>
  )
}

export default ToolEditor;