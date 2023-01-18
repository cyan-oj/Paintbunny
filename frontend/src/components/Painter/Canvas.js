import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Brushes from "./Brushes";
import Palette from "./Palette";
import { createDrawing, destroyDrawing, fetchDrawing, getDrawing, updateDrawing } from "../../store/drawings";
import "./Painter.css"
import { createComment } from "../../store/comments";
import { useHistory } from "react-router-dom";
import ToolEditorModal from "./ToolEditorModal";
import BrushDisplay from "./BrushDisplay";

function Canvas({ width, height, imgSrc, drawingId, drawingUserId, drawingTitle, drawingDesc, toggleEdit }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const drawing = useSelector(getDrawing(drawingId))
  const user = useSelector(state => state.session.user)
  
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  const [canvasWidth, setWidth] = useState(width || 512);
  const [canvasHeight, setHeight] = useState(height || 512);
  const [title, setTitle] = useState(drawingTitle || '');
  const [description, setDescription] = useState(drawingDesc || '')

  const [color, setColor] = useState("black")
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [size, setSize] = useState(16)

  const image = new Image(512, 512) 
  image.crossOrigin = "anonymous"
  if (drawing) image.src = drawing.imageUrl
    
  const buttonText = imgSrc ? "edit it" : "post it"
  
  const isComment = height === "256" ? true : false

  const position = { 
    x: 0, 
    y: 0 
  }
  
  useEffect(() => {
    if (drawing) dispatch(fetchDrawing(drawingUserId, drawingId));

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    contextRef.current = context;
    
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    if (imgSrc) context.drawImage(image, 0, 0)
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
      formData.append('drawing[description]', description)
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(updateDrawing( user.id, drawingId, formData ))
      toggleEdit();
    } else {
      formData.append('drawing[title]', title);
      formData.append('drawing[description]', description)
      formData.append('drawing[artist_id]', user.id)
      formData.append('drawing[image]', blobData)
      dispatch(createDrawing( user.id, formData ))
      history.push(`/users/${user.id}`)
    }
  }

  const brushSettings = e => {
    switch (e.target.id) {
      case "size":
        setSize(e.target.value);
        break;
      case "hue":
        setHue(e.target.value);
        setColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
        break;
      case "saturation":
        setSaturation(e.target.value);
        setColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
        break;
      case "lightness":
        setLightness(e.target.value);
        setColor(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
        break;
      default: 
      break
    }
  }

  return (
    <>
    <div className={ isComment ? "comment-painter" : "painter" }>
      <div className="toolboxes">
        <div onClick={ e => setColor(e.target.value) } id="palette">
          <Palette palette={user.palette}/>
        </div>
        <div onClick={ e => setSize(e.target.value) } id="brushes" brushes={user.brushes}>
          <Brushes brushes={user.brushes} />
        </div>
      <ToolEditorModal user={user} />
      </div>
      <canvas 
        ref={ canvasRef } 
        onMouseDown={ setPosition } onPointerDown={setPosition}
        onMouseEnter={ setPosition } onPointerUp={setPosition}
        onMouseMove={ e => draw( e, contextRef.current, color, size )} onPointerMove={ e => draw( e, contextRef.current, color, size )}
        height={ canvasHeight }
        width={ canvasWidth }
        id="canvas"
      />
      <BrushDisplay 
        brushSettings={brushSettings} 
        color={color} size={size} 
        hue={hue} saturation={saturation} lightness={lightness}
        width="128"
        height={canvasHeight}
      />
    </div>
    <form onSubmit={ blobCanvas } className="comment-form">
      { !isComment && 
        <>
          <input
          type="text"
          placeholder="title"
          value={ title }
          onChange={ e => setTitle(e.target.value) }
          />
          <textarea
          type="text"
          placeholder="description"
          value={ description }
          onChange={ e => setDescription(e.target.value) }
          />
        </>
      }
      <button type="submit">{ buttonText }</button>
    </form>
    <a id="link"></a>
    </>
  )
} 

export default Canvas;