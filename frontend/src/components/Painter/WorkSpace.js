import React, { useRef, useState } from "react"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import csrfFetch from "../../store/csrf";
import Canvas from "./Canvas"
import { getUser } from "../../store/users";

function WorkSpace() {
  const user = useSelector(state => state.session.user)

  const [title, setTitle] = useState('');
  const [drawingFile, setDrawingFile] = useState(null);

  const saveCanvas = () => {
    const link = document.getElementById("link")
    const canvas = document.getElementById("canvas")
    link.setAttribute("download", "paintbunny.png");
    link.setAttribute("href", canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
  }

  const sendCanvas = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('drawing[title]', title);
    formData.append('drawing[artist_id]', user.id)
    formData.append('drawing[image]', drawingFile)

    const response = await csrfFetch(`/api/users/${user.id}/drawings`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const message = await response.json();
      console.log("message", message.message);
      setTitle('');
      setDrawingFile(null);
      //setImgUrl(null); // ???
    }
  }

  const handleFile = e => {
    const file = e.currentTarget.files[0];
    setDrawingFile(file);
  }

  console.log(drawingFile)

  return (
    <>
      <Canvas id="canvas" width="300" height="300" style={{ backgroundColor: "white" }}/>
      <button onClick={ saveCanvas }>save canvas</button>

      <form onSubmit={ sendCanvas }>
        <input 
          type="text"
          placeholder="title"
          value={ title }
          onChange={ e => setTitle(e.target.value) }
        />
        <input 
          type="file"
          onChange={ handleFile }
        />
        <input 
          type="submit" 
          value="send canvas" 
        />
      </form>

      <a id="link"></a>
    </>
  )
}

export default WorkSpace;