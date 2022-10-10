import LoginForm from "./LoginForm";
import { Modal } from "../../context/Modal";
import { useState } from "react";

function LoginFormModal() {
  const [showModal, setShowModal] = useState();

  return (
    <>
      <button onClick={e => setShowModal(true)}>Log In</button>
      { showModal && (
        <Modal onClose={e => setShowModal(false)}>
          <LoginForm />
        </Modal>
      )}
    </>
  )
}

export default LoginFormModal;