

function Palette({ palette = ["hsl(0, 0%, 0%)", "hsl(0, 0%, 100%)", "hsl(0, 50%, 50%)"]}) {

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