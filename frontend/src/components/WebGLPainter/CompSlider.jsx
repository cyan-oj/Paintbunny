function CompSlider({ setValue, value, valueLabel, min=0, max=100 }) {

  return (
    <div className="slider-box">
      <div className="slider-arrow"
        onClick={() => setValue( value - 1 )}
      >ᐊ</div>
      <input type='range' min={ min } max={ max } value={ value } 
        onChange={ e => setValue( e.target.value )}
      />
      <div className="slider-num">{ `${ valueLabel }: ${ value }` }</div>
      <div className="slider-arrow"
        onClick={() => setValue( value + 1 )}
      >ᐅ</div>
    </div>
  )
}

export default CompSlider