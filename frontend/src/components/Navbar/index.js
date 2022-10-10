import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestMenu from "./GuestMenu";
import ProfileButton from "./ProfileButton";
import "./Navbar.css"
import "../../colors.css"

function Navbar() {
  const user = useSelector(state => state.session.user);

  const navMenu = user ? <ProfileButton /> : <GuestMenu />

  return (
    <nav>
      <NavLink to="/">Paintbunny</NavLink>
      { navMenu }
    </nav>
  );
}

export default Navbar;