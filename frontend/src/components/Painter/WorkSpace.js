import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import csrfFetch from "../../store/csrf";
import Canvas from "./Canvas"

function WorkSpace() {
  const dispatch = useDispatch();
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

  const uploadFile = async e => {
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
    }
  }

  const handleFile = e => {
    const file = e.currentTarget.files[0];
    setDrawingFile(file);
  }

  function dataURItoBlob(dataURI) { // todo: ask spencer if this is okay 
      var binary = atob(dataURI.split(',')[1]);
      var array = [];
      for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }

  const blobCanvas = async e => {
    e.preventDefault();
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL("img/png");
    const blobData = dataURItoBlob(dataURL);

    const formData = new FormData();
    formData.append('drawing[title]', title);
    formData.append('drawing[artist_id]', user.id)
    formData.append('drawing[image]', blobData)

    const response = await csrfFetch(`/api/users/${user.id}/drawings`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      const message = await response.json();
      console.log("message", message.message);
      setTitle('');
    }
  }

  return (
    <>
      <Canvas id="canvas" width="300" height="300" style={{ backgroundColor: "white" }}/>
      <button onClick={ saveCanvas }>save canvas</button>

      <form onSubmit={ blobCanvas }>
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
            value="post drawing" 
          />
      </form>

      <a id="link"></a>
    </>
  )
}

export default WorkSpace;