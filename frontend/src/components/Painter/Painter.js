import React, { useState } from "react"
import { useSelector } from "react-redux";
import csrfFetch from "../../store/csrf";
import Canvas from "./Canvas"
import "./Painter.css"


function Painter() {

  return (
    <div className="painter">
      <Canvas id="canvas" width="300" height="300" style={{ backgroundColor: "white" }}/>

    </div>
  )
}

export default Painter;