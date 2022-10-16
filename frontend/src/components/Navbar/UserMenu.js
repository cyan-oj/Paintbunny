import { useDispatch } from "react-redux"
import { logout } from "../../store/session"
import { Link } from "react-router-dom";

function UserMenu({user}) {
  const dispatch = useDispatch();

  return (
    <div class="dropdown">
      <a href="#" className ="nav-link">{user.username}</a>
      <div className="usermenu">
        <Link className="nav-link" to={`/users/${user.id}`}>Profile</Link>
        <Link className="nav-link" to={"/new"}>Create</Link>
        <a className="nav-link" href="#" onClick={e => dispatch(logout())}>Logout</a>
      </div>
    </div>
  )
}  

export default UserMenu;