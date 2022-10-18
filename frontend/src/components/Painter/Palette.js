

function Palette(props) {
  
  const defaultPalette = [
    "hsl(0, 0%, 100%)", 
    "hsl(0, 0%, 0%)", 
    "hsl(0, 50%, 50%)", 
    "hsl(47, 100%, 51%)"
  ]

  const { palette = defaultPalette } = props;

  const swatchList = palette.map((swatch, i) => 
    <button 
      key={i} 
      className="swatch" 
      value={swatch} 
      style={{ backgroundColor: swatch }}
    ></button>
  );

  return (
    <>
      { swatchList }
    </>
  )
}

export default Palette;