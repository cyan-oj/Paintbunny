import ToolEditor from "./ToolEditor";
import { Modal } from "../../../context/Modal";
import { useState } from "react";

function ToolEditorModal({ user }) {
  const [ showModal, setShowModal ] = useState();

  return (
    <>
      <button onClick={e => setShowModal(true)}>edit toolbox</button>
      { showModal && (
        <Modal onClose={e => setShowModal(false)}>
          <ToolEditor user={user} />
        </Modal>
      )}
    </>
  )
}

export default ToolEditorModal