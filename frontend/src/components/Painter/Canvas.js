import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Brushes from "./Brushes";
import Palette from "./Palette";
import { createDrawing, destroyDrawing, updateDrawing } from "../../store/drawings";
import "./Painter.css"
import { createComment } from "../../store/comments";
import { useHistory } from "react-router-dom";
import ToolEditor from "./ToolEditor";

function Canvas({ width, height, imgSrc, drawingId, drawingUserId, drawingTitle }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user)
  console.log("canvas user", user)
  
  const canvasRef = useRef(null)
  const contextRef = useRef(null)
  
  const [canvasWidth, setWidth] = useState(width || 512)
  const [canvasHeight, setHeight] = useState(height || 512)
  const [title, setTitle] = useState(drawingTitle || '');
  const [color, setColor] = useState("black")
  const [size, setSize] = useState(2)
  
  // const image = new Image(512, 512)
  // image.crossOrigin = "anonymous"
  // if(imgSrc) image.src = imgSrc

  const buttonText = imgSrc ? "edit it" : "post it"
  
  const position = { 
    x: 0, 
    y: 0 
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  
    // if (imgSrc)
    //   context.drawImage(image, 0, 0)
    
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
    context.globalAlpha = 1;

    context.beginPath();
    context.lineWidth = size;
    context.lineCap = "round"
    context.strokeStyle = color;

    context.moveTo(position.x, position.y)
    setPosition(e);
    context.lineTo(position.x, position.y);
    context.stroke();
  }

  function dataURItoBlob(dataURI) {
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

    if (canvas.height === 256) {
      formData.append('comment[author_id]', user.id);
      formData.append('comment[drawing_id]', drawingId)
      formData.append('comment[image]', blobData)
      dispatch(createComment( drawingId, formData ))
    } else if ( imgSrc && (drawingUserId === user.id) ) {
      formData.append('drawing[title]', title);
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(updateDrawing( user.id, drawingId, formData ))
    } else {
      formData.append('drawing[title]', title);
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(createDrawing( user.id, formData ))
      history.push(`/users/${user.id}`)
    }
  }

  const deleteImage = e => {
    e.preventDefault();

    console.log(drawingUserId, drawingId)

    if ( imgSrc && drawingUserId === user.id )
      dispatch(destroyDrawing(drawingUserId, drawingId))
  }

  return (
    <>
    <div className="painter">
      <div className="toolboxes">
        <div onClick={ e => setColor(e.target.value) } id="palette">
          <Palette palette={user.palette}/>
        </div>
        <div onClick={ e => setSize(e.target.value) } id="brushes" brushes={user.brushes}>
          <Brushes brushes={user.brushes} />
        </div>
      </div>
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
          height={ canvasHeight }
          width={ canvasWidth }
          id="canvas"
        />
    </div>
    <ToolEditor brushes={user.brushes} palette={user.palette} />
    <form onSubmit={ blobCanvas } className="comment-form">
      <input
        type="text"
        placeholder="title"
        value={ title }
        onChange={ e => setTitle(e.target.value) }
      />
      <button type="submit">{ buttonText }</button>
    </form>
    <a id="link"></a>
    </>
  )
} 

export default Canvas;