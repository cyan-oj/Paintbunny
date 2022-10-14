
function DrawingIndexItem({ drawing }) {

  return (
    <div className="thumbnail">
      <img src={drawing.imageUrl} alt="" className="showimage" /> 
      <p>{drawing.title}</p>
      <p>{drawing.artist}</p>
      <p>{drawing.createdAt}</p>
    </div>
  )
}

export default DrawingIndexItem;