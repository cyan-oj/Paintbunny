import React, { useEffect, useRef } from "react";

const Canvas = props => {
  const canvasRef = useRef(null)

  const stroke = (context, e, color = "rgba(0,0,0)", size = 5 ) => {
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
  
  const position = { 
    x: 0, 
    y: 0 
  }

  const setPosition = e => {
    const box = e.target.getBoundingClientRect();
    position.x = e.clientX - box.left;
    position.y = e.clientY - box.top;
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    
    context.fillStyle = "white";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)

    const draw = e => {
      if (e.buttons !== 1) return;
      stroke(context, e)
    }

    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mousenter", setPosition)
    canvas.addEventListener("mousedown", setPosition)

    return () => {
      canvas.removeEventListener("mousemove", draw)
      canvas.removeEventListener("mousedown", setPosition)
      canvas.removeEventListener("mousenter", setPosition)
    }
  }, []);

  return <canvas ref={canvasRef} {...props} />
} 

export default Canvas;