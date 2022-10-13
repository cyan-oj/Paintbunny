import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDrawing, getDrawing } from "../../../store/drawings";
import "./DrawingPage.css"

function DrawingPage() {
  const dispatch = useDispatch();
  const { drawingId, userId } = useParams();
  const drawing = useSelector(getDrawing(drawingId));

  console.log("drawing", drawing)

  useEffect(() => {
    dispatch(fetchDrawing(userId, drawingId));
  }, [dispatch, drawingId]);

  if (!drawing) return null;

  return (
    <img src={drawing.imageUrl} alt="" className="showimage" />
  )
}

export default DrawingPage;