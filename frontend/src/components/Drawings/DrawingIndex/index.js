import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrawings, fetchUserDrawings, getDrawings } from "../../../store/drawings";
import DrawingIndexItem from "../DrawingIndexItem";

function DrawingIndex({ userId }) {
  const dispatch = useDispatch();
  const drawings = useSelector(getDrawings)

  useEffect(() => {
    if ( userId ){
      dispatch(fetchUserDrawings(userId));
    } else {
      dispatch(fetchDrawings());
    }
  }, [dispatch])

  const drawingsList = drawings.map(drawing => 
    <DrawingIndexItem drawing={drawing} />
  );

  return (
    <div id="gallery" >
      {drawingsList}
    </div>
  );
}

export default DrawingIndex;