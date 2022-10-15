import React, { useEffect, useRef, useState } from "react";
import Brushes from "./Brushes";
import Palette from "./Palette";

const Canvas = props => {
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
      <div onClick={ e => setColor(e.target.value) } id="palette">
        <Palette  />
      </div>
      <div onClick={ e => setSize(e.target.value) } id="brushes">
        <Brushes />
      </div>
    </>
  )
} 

export default Canvas;