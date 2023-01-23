import { useSelector } from "react-redux";

function Brushes() {
  const brushes = useSelector(state => state.session.user.brushes)

  const buttonList = brushes.map((brush, i) => 
    <button 
      key={i} 
      className="brush" 
      value={brush} 
    >{brush}</button>
  );

  return (
    <div title="brush size presets">
      { buttonList }
    </div>
  )
}

export default Brushes;