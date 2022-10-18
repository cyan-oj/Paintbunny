import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchDrawing, getDrawing } from "../../store/drawings";
import CommentIndex from "../Comments/CommentIndex";
import Canvas from "../Painter/Canvas";
import "./DrawingPage.css"

function DrawingPage() {
  const dispatch = useDispatch();
  const { drawingId, userId } = useParams();
  const drawing = useSelector(getDrawing(drawingId));

  const user = useSelector(state => state.session.user)
  console.log(user)

  console.log(drawing)

  const [showCanvas, setShowCanvas] = useState(false);
  const [isArtist, setIsArtist] = useState(false);

  
  useEffect(() => {
    dispatch(fetchDrawing(userId, drawingId));
    if (user && user.id === drawing.artistId) 
    setIsArtist(true) 
  }, [dispatch]);

  if (!drawing) return null;

  const editDrawing = () => {
    if (isArtist)
      setShowCanvas(!showCanvas);
  }

  const dateFormat = dateString => {
    const date = new Date(dateString)
    return date.toDateString()
  }

  return (
    <div className="drawing-show">
      { !showCanvas &&
        <>
          <div className="drawing-box">
            <div className="drawing-info">
              <h1>{drawing.title}</h1>
              <Link 
                to={`/users/${drawing.artistId}`}>{drawing.artist}
              </Link>
              <p className="thumb-date">{dateFormat(drawing.createdAt)}</p>
              <p>description text text text</p>
              { isArtist &&
                <button onClick={ editDrawing }>edit</button>
              }
            </div>
            <img src={drawing.imageUrl} alt="" id="image" className="showimage" />
          </div>
          <CommentIndex drawingId={drawingId} />
          { user &&           
            <div className="comment-canvas" >
              <Canvas height="256" drawingId={drawingId} />
            </div>
          }
        </>
      }
      { showCanvas && user &&
        <>
          <Canvas imgSrc={drawing.imageUrl} drawingId={drawingId} drawingTitle={drawing.title} drawingUserId={drawing.artistId} />
          <button onClick={ editDrawing }>cancel edit</button>
        </>
      }
    </div>
  )
}

export default DrawingPage;