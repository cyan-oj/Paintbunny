import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestMenu from "./GuestMenu";
import "./Navbar.css"
import "../../colors.css"
import UserMenu from "./UserMenu";

function Navbar() {
  const user = useSelector(state => state.session.user);

  const navMenu = user ? <UserMenu user={user} /> : <GuestMenu />

  return (
    <nav>
      <NavLink className="nav-link" to="/">Paintbunny</NavLink>
      { navMenu }
    </nav>
  );
}

export default Navbar;