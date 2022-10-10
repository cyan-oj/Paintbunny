import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/session"
import { Link } from "react-router-dom";

function UserMenu() {
  const dispatch = useDispatch();
  const { username } = useSelector(state => state.session.user);

  return (
    <div class="usermenu">
      <Link to="/">{username}</Link>
      <Link to="/">Dashboard</Link>
      <Link to="/">Create</Link>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;
