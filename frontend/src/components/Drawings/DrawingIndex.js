import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrawings, getDrawings } from "../../store/drawings";
import DrawingIndexItem from "./DrawingIndexItem";
import "./DrawingIndex.css"
import { useParams } from "react-router-dom";

function DrawingIndex( { user }) {
const dispatch = useDispatch();
const { userId } = useParams();
let drawings = useSelector(getDrawings( userId ));

drawings = drawings.reverse();

useEffect(() => {
  dispatch(fetchDrawings( userId ))
}, [ dispatch, userId ]);

  const drawingsList = drawings.map( drawing => 
      <DrawingIndexItem key={ drawing.id } drawing={ drawing } />
  );

  return (
    <>
      <div className="gallery" >
        { drawingsList }
      </div>
    </>
  );
}

export default DrawingIndex;