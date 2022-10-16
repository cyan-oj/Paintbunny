import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Brushes from "./Brushes";
import Palette from "./Palette";
import csrfFetch from "../../store/csrf";

const Canvas = props => {
  const user = useSelector(state => state.session.user)
  const [title, setTitle] = useState('');
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  const [color, setColor] = useState("black")
  const [size, setSize] = useState(2)

  const position = { 
    x: 0, 
    y: 0 
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
  
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    contextRef.current = context;

  }, []);

  const setPosition = e => {
    const box = e.target.getBoundingClientRect();
    position.x = e.clientX - box.left;
    position.y = e.clientY - box.top;
  }

  const draw = (e, context, color = "rgba(0,0,0)", size = 5) => {
    if (e.buttons !== 1) return;
    context.imageSmoothingEnabled = false;
    context.beginPath();
    
    context.lineWidth = size;
    context.lineCap = "round"
    context.strokeStyle = color;

    context.moveTo(position.x, position.y)
    setPosition(e);
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function dataURItoBlob(dataURI) { // todo: check gif libraries to optimize this process
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
  }

  const blobCanvas = async e => {
    e.preventDefault();
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("img/png");
    const blobData = dataURItoBlob(dataURL);

    const formData = new FormData();
    formData.append('drawing[title]', title);
    formData.append('drawing[artist_id]', user.id)
    formData.append('drawing[image]', blobData)

    const response = await csrfFetch(`/api/users/${user.id}/drawings`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const message = await response.json();
      console.log("message", message.message);
      setTitle('');
    }
  }

  return (
    <>
      <canvas 
        ref={ canvasRef } 
        onMouseDown={ setPosition }
        onMouseEnter={ setPosition }
        onMouseMove={ e => draw( 
          e,
          contextRef.current,
          color,
          size
          )}
        {...props} 
      />
      <div className="toolboxes">
        <div onClick={ e => setColor(e.target.value) } id="palette">
          <Palette  />
        </div>
        <div onClick={ e => setSize(e.target.value) } id="brushes">
          <Brushes />
        </div>
        <form onSubmit={ blobCanvas }>
          <input
            type="text"
            placeholder="title"
            value={ title }
            onChange={ e => setTitle(e.target.value) }
          />
          <button type="submit">post drawing</button>
        </form>
        <a id="link"></a>
      </div>
    </>
  )
} 

export default Canvas;