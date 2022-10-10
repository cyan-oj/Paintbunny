import { Link } from "react-router-dom";

function GuestMenu() {
  return (
    <div class="usermenu">
      <Link to="/login">Log In</Link>
      <Link to="/signup">Sign Up</Link>
    </div> 
  )
}  

export default GuestMenu;