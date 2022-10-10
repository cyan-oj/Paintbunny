import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../store/session"
import { Link } from "react-router-dom";

function UserMenu() {
  const dispatch = useDispatch();

  return (
    <div className="usermenu">
      <Link to="/">Profile</Link>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;
