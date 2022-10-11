import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/session"
import { NavLink } from "react-router-dom";

function UserMenu({userId}) {
  const dispatch = useDispatch();
 // const { userId } = useSelector( state => state.session.user.id)
  return (
    <div className="usermenu">
      <NavLink 
        className={ isActive => "dropdown" + (isActive ? "active" : "" ) }
        to={`/users/${userId}`}
        >Profile</NavLink>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;