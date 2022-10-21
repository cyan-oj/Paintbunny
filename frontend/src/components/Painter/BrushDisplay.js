import "./BrushDisplay.css"

function BrushDisplay({ brushSettings, size }) {
  // set onInput on component to target size and color

  //const color = (`hsl(${hue}, ${saturation}%, ${lightness}%)`)

  return (
    <div className="brush-settings">
      {/* <canvas className="brush-sample" width="256" height="256"></canvas>
      <div className="color-sliders">
        <input 
          id="hue" 
          class="colorSlider" 
          type="range" 
          min="0" 
          max="360" 
          value={hue}
          onChange={ e => brushSettings(e) }
        /> 
        <input 
          id="saturation" 
          class="colorSlider" 
          type="range" 
          min="0" 
          max="100" 
          value={saturation}
          onChange={ e => brushSettings(e) } 
        /> 
        <input 
          id="lightness" 
          class="colorSlider" 
          type="range" 
          min="0" 
          max="100" 
          value={lightness}
          onChange={ e => brushSettings(e) }
          /> */}
        <input 
          id="size" 
          type="range" 
          min="0" 
          max="200" 
          value={size}
          onChange={ e => brushSettings(e) }
          />
        <div className="save-buttons">
          <button id="add-color" class="settingsbutton">save color</button>
          <button id="add-brush" class="settingsbutton">save brush</button>
        {/* </div> */}
      </div>
    </div>
  )
}

export default BrushDisplay;