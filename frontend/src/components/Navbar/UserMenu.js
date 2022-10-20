import { useDispatch } from "react-redux"
import { logout } from "../../store/session"
import { Link, useHistory } from "react-router-dom";

function UserMenu({user}) {
  const dispatch = useDispatch();

  const signOut = e => {
    dispatch(logout())
  }

  return (
    <div className="dropdown">
      <p className="nav-link">{user.username}</p>
      <div className="usermenu">
        <Link className="nav-link" to={`/users/${user.id}`}>Profile</Link>
        <Link className="nav-link" to={"/new"}>Create</Link>
        <a className="nav-link" href="#" onClick={ signOut }>Logout</a>
      </div>
    </div>
  )
}  

export default UserMenu;