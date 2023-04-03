import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import { fetchDrawing, getDrawing, destroyDrawing } from "../../store/drawings";
import Painter from "../WebGLPainter/Painter";
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
    <Painter imgSrc={drawing.imageUrl} canvasType={ 'template' }/>
  )
}

export default DrawingTemplatePage;