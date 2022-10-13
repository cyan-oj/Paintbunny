import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDrawings, fetchUserDrawings, getDrawings } from "../../../store/drawings";

function DrawingIndex({ userId }) {
  const dispatch = useDispatch();
  const drawings = useSelector(getDrawings)

  console.log("user id", userId)
  console.log("selected drawings", drawings)

  useEffect(() => {
    if ( userId ){
      dispatch(fetchUserDrawings(userId));
    } else {
      dispatch(fetchDrawings());
    }
  }, [dispatch])

  const drawingsList = drawings.map(drawing => 
    <img src={drawing.imageUrl} alt="" className="showimage" /> 
    );

  console.log("drawingsList", drawingsList)
  return (
    <ul id="gallery" >
      {drawingsList}
    </ul>
  )
}

export default DrawingIndex;