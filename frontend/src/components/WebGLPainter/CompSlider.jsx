function CompSlider({ color, setColor, index, value, valueLabel, backgroundImage, leftArrowColor, rightArrowColor, min=0, max=255 }) {

  return (
    <div className="color-slider-box">
      <div className="slider-arrow"
        style={ leftArrowColor }
        onClick={() => setColor( (value - 1), index)}
      >ᐊ</div>
      <input type='range' min={ min } max={ max } value={ value } 
        onChange={ e => setColor( e.target.value, index )}
        style={ backgroundImage } />
      <div className="slider-num">{ `${ valueLabel }: ${ value }` }</div>
      <div className="slider-arrow"
        style={ rightArrowColor }
        onClick={() => setColor( (value + 1), index)}
      >ᐅ</div>
    </div>
  )
}

export default CompSlider