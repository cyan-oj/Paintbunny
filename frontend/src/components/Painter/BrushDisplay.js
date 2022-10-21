import { useEffect, useRef } from "react";
import "./BrushDisplay.css"

function BrushDisplay({ brushSettings, color, size, hue, saturation, lightness, width, height }) {
  const brushSampleRef = useRef( null )
  // set onInput on component to target size and color

  useEffect(() => {
    const canvas = brushSampleRef.current;
    const context = canvas.getContext('2d');

    const radius = size/2

    context.clearRect( 0, 0, width, height )
    context.beginPath();
    context.fillStyle = color;
    context.arc( width/2, height/3, radius, 0, 2*Math.PI );
    context.fill();

  }, [size, hue, saturation, lightness, color])

  return (
    <div className="brush-settings">
      <canvas ref={ brushSampleRef } className="brush-sample" width={ width } height={ height }></canvas>
      <div className="color-sliders">
        <input 
          id="hue" 
          className="colorSlider" 
          type="range" 
          min="0" 
          max="360" 
          value={hue}
          onChange={ e => brushSettings(e) }
        /> 
        <input 
          id="saturation" 
          className="colorSlider" 
          type="range" 
          min="0" 
          max="100" 
          value={saturation}
          onChange={ e => brushSettings(e) } 
          style={{ backgroundImage:  `linear-gradient(to right, hsl(${hue}, ${0}%, ${lightness}%), hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue}, ${100}%, ${lightness}%))` }}
        /> 
        <input 
          id="lightness" 
          className="colorSlider" 
          type="range" 
          min="0" 
          max="100" 
          value={lightness}
          onChange={ e => brushSettings(e) }
          style={{ backgroundImage:  `linear-gradient(to right, hsl(${hue}, ${saturation}%, ${0}%), hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${hue}, ${saturation}%, ${100}%))` }}
          />
        <input 
          id="size" 
          type="range" 
          min="0" 
          max="400" 
          value={size}
          onChange={ e => brushSettings(e) }
          />
        <div className="save-buttons">
          <button id="add-color" className="settingsbutton">save color</button>
          <button id="add-brush" className="settingsbutton">save brush</button>
        </div>
      </div>
    </div>
  )
}

export default BrushDisplay;