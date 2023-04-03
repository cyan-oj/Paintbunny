import ToolEditor from "./ToolEditor";
import { Modal } from "../../../context/Modal";
import { useState } from "react";

function ToolEditorModal( { palette, brushes, activeBrush, activeColor, brushThumbnails, paintDispatch } ) {
  const [ showModal, setShowModal ] = useState();

  return (
    <>
      <button onClick={e => setShowModal(true)}>edit toolbox</button>
      { showModal && (
        <Modal onClose={e => setShowModal(false)}>
          <ToolEditor palette={ palette } brushes={ brushes } activeBrush={ activeBrush } activeColor={ activeColor } brushThumbnails={ brushThumbnails } paintDispatch={ paintDispatch } />
        </Modal>
      )}
    </>
  )
}

export default ToolEditorModal