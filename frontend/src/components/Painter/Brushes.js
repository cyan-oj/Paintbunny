
function Brushes({ brushes = [ 2, 5, 30 ]}) {

  const buttonList = brushes.map((brush, i) => 
    <button 
      key={i} 
      className="brush" 
      value={brush} 
    >{brush}</button>
  );

  return (
    <>
      { buttonList }
    </>
  )
}

export default Brushes;