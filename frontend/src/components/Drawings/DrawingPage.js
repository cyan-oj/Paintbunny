import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { fetchDrawing, getDrawing, destroyDrawing } from "../../store/drawings";
import CommentIndex from "../Comments/CommentIndex";
import Welcome from "../Welcome/Welcome";
import "./DrawingPage.css"
import Painter from "../WebGLPainter/Painter";

function DrawingPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { drawingId, userId } = useParams();
  const drawing = useSelector(getDrawing(drawingId));

  const user = useSelector(state => state.session.user)
  const isArtist = (user && userId === '' + user.id) ? true : false

  const [ showCanvas, setShowCanvas ] = useState(false)
  const [ isFetched, setIsFetched ] = useState(false)
  
  useLayoutEffect(() => {
    if( !isFetched ) {
      dispatch(fetchDrawing(userId, drawingId))
      setIsFetched( true )
    }
  }, [ dispatch, isFetched, userId, drawingId, showCanvas ]);

  if (!drawing) return null;

  const toggleEdit = () => {
    if (isArtist) {
      setShowCanvas( !showCanvas );
      setIsFetched( false )
    }
  }

  const dateFormat = dateString => {
    const date = new Date(dateString)
    return date.toDateString()
  }

  const deleteImage = e => {
    e.preventDefault();
    if ( user && userId === '' + user.id )
      dispatch(destroyDrawing(userId, drawingId))
      history.push(`/users/${user.id}`)
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
              <p>{drawing.description}</p>
              { isArtist &&
                <>
                <button onClick={ deleteImage }>delete</button>
                <button onClick={ toggleEdit }>edit</button>
                </>
              }
            </div>
            <img src={ drawing.imageUrl } alt="" id="image" className="showimage" />
          </div>
          <CommentIndex drawingId={drawingId} />
          { user &&           
            <div className="comment-canvas" >
              <Painter canvasType={'comment'} height={ 256 } drawingId={ drawingId } />
            </div>
          }
          { !user && 
            <Welcome />
          }
        </>
      }
      { showCanvas && user &&
        <>
          <Painter imgSrc={drawing.imageUrl} drawingId={drawingId} title={drawing.title} drawingUserId={drawing.artistId} description={drawing.description} toggleEdit={ toggleEdit } canvasType={'painting'}/>
          <button onClick={ toggleEdit }>cancel edit</button>
        </>
      }
    </div>
  )
}

export default DrawingPage