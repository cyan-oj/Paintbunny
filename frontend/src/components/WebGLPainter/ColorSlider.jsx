function ColorSlider({ setValue, index, value, valueLabel, backgroundImage, leftArrowColor, rightArrowColor, min=0, max=255 }) {

  return (
    <div className="color-slider-box">
      <input type='range' style={ backgroundImage } 
        min={ min } max={ max } value={ value } 
        onChange={ e => setValue( e.target.value, index )}/>
      <span className="slider-name">{ valueLabel }</span>
      <input type='number' className="slider-num" 
        min={ min } max={ max } value={ value } 
        onChange={ e => setValue( e.target.value, index )}/>
    </div>
  )
}

export default ColorSlider