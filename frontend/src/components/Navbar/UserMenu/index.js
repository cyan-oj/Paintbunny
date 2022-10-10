import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../../store/session"
import { NavLink } from "react-router-dom";

function UserMenu() {
  const dispatch = useDispatch();
  const { username } = useSelector(state => state.session.user);

  return (
    <div class="usermenu">
      <NavLink to="/">{username}</NavLink>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;
