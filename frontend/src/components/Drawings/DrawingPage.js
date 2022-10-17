import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchDrawing, getDrawing } from "../../store/drawings";
import Canvas from "../Painter/Canvas";
import "./DrawingPage.css"

function DrawingPage() {
  const dispatch = useDispatch();
  const { drawingId, userId } = useParams();
  const drawing = useSelector(getDrawing(drawingId));

  const [drawingHeight, setDrawingHeight] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(0);
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    dispatch(fetchDrawing(userId, drawingId));
    const image = document.getElementById("image")
  }, [dispatch, drawingId]);

  if (!drawing) return null;

  const editDrawing = () => {
    setShowCanvas(!showCanvas);
  }

  const dateFormat = dateString => {
    const date = new Date(dateString)
    return date.toDateString()
  }

  return (
    <div className="drawingShow">
      { !showCanvas &&
        <>
          <div className="user-info">
            <Link 
              className="artist-name"
              to={`/users/${drawing.artistId}`}>{drawing.artist}
            </Link>
            <p className="thumb-date">{dateFormat(drawing.createdAt)}</p>
            <p>description text text text</p>
            <button onClick={ editDrawing }>edit</button>
          </div>
          <img src={drawing.imageUrl} alt="" id="image" className="showimage" />
        </>
      }
      { showCanvas &&
        <>
          <Canvas id="canvas" imgSrc={drawing.imageUrl} drawingId={drawingId} drawingTitle={drawing.title} />
          <button onClick={ editDrawing }>cancel edit</button>
        </>
      }
    </div>
  )
}

export default DrawingPage;