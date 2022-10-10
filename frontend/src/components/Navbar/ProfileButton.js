import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";

function ProfileButton() {
  const [showMenu, setShowMenu] = useState(false);
  const { username } = useSelector(state => state.session.user);

  useEffect (() => {
    if (!showMenu) return
    document.addEventListener("click", toggleMenu)
    return () => document.removeEventListener("click", toggleMenu);
  }, [showMenu])

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }

  return (
    <>
      <button 
      className="profile-button"
      onClick={toggleMenu}>{username}</button>
      { showMenu && (
        <UserMenu />
      )}
    </>
  )
}

export default ProfileButton;