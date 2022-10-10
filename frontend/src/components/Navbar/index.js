import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Navbar.css"
import "../../colors.css"
import UserMenu from "./UserMenu";
import GuestMenu from "./GuestMenu";

function Navbar() {
  const user = useSelector(state => state.session.user);

  const navMenu = user ? <UserMenu /> : <GuestMenu />

  return (
    <nav>
      <NavLink to="/">Paintbunny</NavLink>
      { navMenu }
    </nav>
  );
}

export default Navbar;