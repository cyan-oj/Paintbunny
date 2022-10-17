import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDrawing, getDrawing } from "../../store/drawings";
import Canvas from "../Painter/Canvas";
import "./DrawingPage.css"

function DrawingPage() {
  const dispatch = useDispatch();
  const { drawingId, userId } = useParams();
  const drawing = useSelector(getDrawing(drawingId));

  const [drawingHeight, setDrawingHeight] = useState(0);
  const [drawingWidth, setDrawingWidth] = useState(0);
  const [showCanvas, setShowCanvas] = useState(false);

  console.log("drawing", drawing)
  
  useEffect(() => {
    dispatch(fetchDrawing(userId, drawingId));

    const image = document.getElementById("image")
    setDrawingHeight(image.naturalHeight)
    setDrawingWidth(image.naturalWidth)
  }, [dispatch, drawingId]);

  if (!drawing) return null;

  const editDrawing = () => {
    setShowCanvas(!showCanvas);
  }

  return (
    <>
      { !showCanvas &&
        <>
          <img src={drawing.imageUrl} alt="" id="image" className="showimage" />
          <button onClick={ editDrawing }>edit</button>
        </>
      }
      { showCanvas &&
        <>
          <Canvas id="canvas" width={drawingWidth} height={drawingHeight} imgSrc={drawing.imageUrl} drawingId={drawingId} drawingTitle={drawing.title} />
          <button onClick={ editDrawing }>cancel edit</button>
        </>
      }

    </>
  )
}

export default DrawingPage;