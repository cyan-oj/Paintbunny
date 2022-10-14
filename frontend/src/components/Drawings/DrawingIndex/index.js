import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrawings, fetchUserDrawings, getDrawings } from "../../../store/drawings";

function DrawingIndex({ userId }) {
  const dispatch = useDispatch();
  const drawings = useSelector(getDrawings)

  console.log("user id", userId)
  console.log("selected drawings", drawings)

  useEffect(() => {
    if ( userId ){
      console.log("fetching user drawings")
      dispatch(fetchUserDrawings(userId));
    } else {
      console.log("fetching all drawings")
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