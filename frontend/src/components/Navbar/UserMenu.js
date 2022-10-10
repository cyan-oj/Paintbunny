import { useDispatch } from "react-redux"
import { logout } from "../../store/session"
import { NavLink } from "react-router-dom";

function UserMenu() {
  const dispatch = useDispatch();

  return (
    <div className="usermenu">
      <NavLink 
        className={ isActive => "dropdown" + (isActive ? "active" : "" ) }
        to="/"
        >Profile</NavLink>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;
