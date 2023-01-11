import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { fetchDrawing, getDrawing, destroyDrawing } from "../../store/drawings";
import CommentIndex from "../Comments/CommentIndex";
import Canvas from "../Painter/Canvas";
import "./DrawingPage.css"

function DrawingTemplatePage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userId } = useParams();
  const drawing = { imageUrl: "/eyes.png" }

  const user = useSelector(state => state.session.user)
  
  useEffect(() => {
  }, [dispatch]);

  if (!drawing) return null;

  return (
    <Canvas imgSrc={drawing.imageUrl} isTemplate={true}/>
  )
}

export default DrawingTemplatePage;