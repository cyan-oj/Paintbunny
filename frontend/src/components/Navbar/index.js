import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Navbar.css"
import "../../colors.css"
import GuestMenu from "./GuestMenu";
import ProfileButton from "./ProfileButton";

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