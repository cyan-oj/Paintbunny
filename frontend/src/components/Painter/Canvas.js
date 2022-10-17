import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Brushes from "./Brushes";
import Palette from "./Palette";
import { createDrawing, updateDrawing } from "../../store/drawings";
import "./Painter.css"

function Canvas({ id, width, height, imgSrc, drawingId, drawingUserId, drawingTitle }) {

  console.log("drawingTitle", drawingTitle)
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user)

  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [canvasWidth, setWidth] = useState(width || 300)
  const [canvasHeight, setHeight] = useState(height || 300)
  const [title, setTitle] = useState(drawingTitle || '');
  console.log("title", title)
  const [color, setColor] = useState("black")
  const [size, setSize] = useState(2)

  const image = new Image(width, height)
  //image.crossOrigin = "use-credentials"
  image.src = imgSrc

  const buttonText = imgSrc ? "edit drawing" : "post drawing"

  const position = { 
    x: 0, 
    y: 0 
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
  
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
    
    if (imgSrc)
      context.drawImage(image, 0, 0)

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

  const blobCanvas = e => {
    e.preventDefault();
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("img/png");
    const blobData = dataURItoBlob(dataURL);

    const formData = new FormData();
    formData.append('drawing[title]', title);
    formData.append('drawing[artist_id]', user.id)
    formData.append('drawing[image]', blobData)

    if ( imgSrc && drawingUserId === user.id ) {
      debugger;
      dispatch(updateDrawing( user.id, drawingId, formData ))
    } else {
      dispatch(createDrawing( user.id, formData ))
    }
    setTitle('');
  }

  return (
    <div className="painter">
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
        height={canvasHeight}
        width={canvasWidth}
        id={id}
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
          <button type="submit">{buttonText}</button>
        </form>
        <a id="link"></a>
      </div>
    </div>
  )
} 

export default Canvas;