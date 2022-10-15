import { useDispatch } from "react-redux"
import { logout } from "../../store/session"
import { Link } from "react-router-dom";

function UserMenu({userId}) {
  const dispatch = useDispatch();

  return (
    <div className="usermenu">
      <Link to={`/users/${userId}`}
      >Profile</Link>
      <Link to={"/new"}>Create</Link>
      <button onClick={e => dispatch(logout())}>Logout</button>
    </div>
  )
}  

export default UserMenu;