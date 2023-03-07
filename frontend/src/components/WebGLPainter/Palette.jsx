import { colorString } from "./utils/colorConvert"

function Palette({ palette, paintDispatch }) {

  const setColor = (i) => {
    console.log( 'set color', i )
    paintDispatch({ type: 'activeColor', payload: i })
  }

  const swatches = palette.map((color , i) =>
      <div
        key={i}
        className="swatch"
        value={i} 
        style={{
          backgroundColor: colorString(color), 
          color: colorString(color)
        }}
        onClick={() => setColor( i )}
      >■</div>
    )

  return (
    <div className="palette">
      { swatches }
    </div>
  )
}

export default Palette;