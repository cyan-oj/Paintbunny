import "./DrawingIndex.css"
import { Link } from "react-router-dom";

function DrawingIndexItem({ drawing }) {

  const dateFormat = dateString => {
    const date = new Date(dateString)
    return date.toDateString()
  }

  return (
    <div className="thumbnail">
      <Link 
        className="thumb"
        to={`/drawings/${drawing.id}`}>
        <img src={drawing.imageUrl} alt=""/> 
      </Link>
      <div className="thumb-info">
        <Link 
          className="title"
          to={`/drawings/${drawing.id}`}>{drawing.title}
        </Link>
        <Link 
          className="artist-name"
          to={`/users/${drawing.artistId}`}>{drawing.artist}
        </Link>
        <p className="thumb-date">{dateFormat(drawing.createdAt)}</p>
      </div>
    </div>
  )
}

export default DrawingIndexItem;