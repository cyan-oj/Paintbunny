import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrawings, getDrawings } from "../../../store/drawings";

function DrawingIndex() {
  const dispatch = useDispatch();
  const drawings = useSelector(getDrawings)
  console.log("selected drawings", drawings)
  console.log(drawings.length)

  useEffect(() => {
    dispatch(fetchDrawings())
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