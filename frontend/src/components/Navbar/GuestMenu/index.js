import { NavLink } from "react-router-dom";

function GuestMenu() {
  return (
    <div className="usermenu">
      <NavLink to="/login">Log In</NavLink>
      <NavLink to="/signup">Sign Up</NavLink>
    </div> 
  )
}

export default GuestMenu;