import SignupForm from "./SignupForm";
import { Modal } from "../../context/Modal";
import { useState } from "react";

function SignupFormModal() {
  const [showModal, setShowModal] = useState();

  return (
    <>
      <button onClick={e => setShowModal(true)}>Sign Up</button>
      { showModal && (
        <Modal onClose={e => setShowModal(false)}>
          <SignupForm />
        </Modal>
      )}
    </>
  )
}

export default SignupFormModal;