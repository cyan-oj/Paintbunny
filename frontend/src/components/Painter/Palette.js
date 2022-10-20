import { useSelector } from "react-redux";

function Palette() {  
  const palette = useSelector(state => state.session.user.palette)

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