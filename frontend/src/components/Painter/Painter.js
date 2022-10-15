import React, { useState } from "react"
import { useSelector } from "react-redux";
import csrfFetch from "../../store/csrf";
import Canvas from "./Canvas"
import "./Painter.css"


function Painter() {
  const user = useSelector(state => state.session.user)
  const [title, setTitle] = useState('');


  function dataURItoBlob(dataURI) { // todo: check gif libraries to optimize this process
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/png'});
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
    <div className="painter">
      <Canvas id="canvas" width="300" height="300" style={{ backgroundColor: "white" }}/>
      <form onSubmit={ blobCanvas }>
        <input
          type="text"
          placeholder="title"
          value={ title }
          onChange={ e => setTitle(e.target.value) }
        />
          <button type="submit">post drawing</button>
      </form>
      <a id="link"></a>
    </div>
  )
}

export default Painter;