import { NavLink } from "react-router-dom";
import LoginFormModal from "../LoginFormModal";

function GuestMenu() {
  return (
    <div className="guestmenu">
      <NavLink to="/signup">Sign Up</NavLink>
      <LoginFormModal />
    </div> 
  )
}

export default GuestMenu;