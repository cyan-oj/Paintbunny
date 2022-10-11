import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function GuestMenu() {
  return (
    <div className="guestmenu">
      <SignupFormModal />
      <LoginFormModal />
    </div> 
  )
}

export default GuestMenu;