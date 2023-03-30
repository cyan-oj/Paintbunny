function CompSlider({ dispatch, type, value, valueLabel, min=0, max=100, step=1, cutoff=0 }) {

  const addPayloadValue = () => {
    console.log({ step, value })
    const val = Number(value)
    return (val + step).toFixed(cutoff)
  }

  const subtractPayloadValue = () => {
    console.log({ step, value })
    const val = Number(value)
    return (val - step).toFixed(cutoff)
  }

  return (
    <div className="slider-box">
      <div className="slider-arrow"
        onClick={() => dispatch({ type: type, payload: subtractPayloadValue() })}
      >ᐊ</div>
      <input type='range' min={ min } max={ max } value={ value } step={ step }
        onChange={ e => dispatch({ type: type, payload: Number(e.target.value) })}
      />
      <div className="slider-num">{ `${ valueLabel }: ${ value }` }</div>
      <div className="slider-arrow"
        onClick={() => dispatch({ type: type, payload: addPayloadValue() })}
      >ᐅ</div>
    </div>
  )
}

export default CompSlider