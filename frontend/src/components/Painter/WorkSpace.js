import React from "react"
import Canvas from "./Canvas"

function WorkSpace() {

  const saveCanvas = () => {
    const link = document.getElementById("link")
    const canvas = document.getElementById("canvas")
    link.setAttribute('download', 'minxel.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }

  return (
    <>
      <Canvas id="canvas" width="500" height="800" style={{ backgroundColor: "white" }}/>
      <button onClick={saveCanvas}>Save Canvas</button>
      <a id="link"></a>
    </>
  )
}

export default WorkSpace;