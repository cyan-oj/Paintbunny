import "./DrawingIndex.css"
import { Link } from "react-router-dom";

function DrawingIndexItem({ drawing }) {

  return (
    <div className="thumbnail">
      <Link to={`/drawings/${drawing.id}`}>
        <img src={drawing.imageUrl} alt="" className="thumb" /> 
      </Link>
      <p>{drawing.title}</p>
      <p>{drawing.artist}</p>
      <p>{drawing.createdAt}</p>
    </div>
  )
}

export default DrawingIndexItem;