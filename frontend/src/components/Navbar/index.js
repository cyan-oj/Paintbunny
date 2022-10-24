import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import GuestMenu from "./GuestMenu";
import "./Navbar.css"
import "../../colors.css"
import UserMenu from "./UserMenu";
import github from './GitHub-Mark-Light-120px-plus.png'

function Navbar() {
  const user = useSelector(state => state.session.user);

  const navMenu = user ? <UserMenu user={user} /> : <GuestMenu />

  return (
    <nav>
      <NavLink className="nav-link" to="/">Paintbunny</NavLink>
      <a href="https://github.com/cyan-oj/Paintbunny">
        <img src={github} alt="github link" className="github-icon"/>
      </a>
      { navMenu }
    </nav>
  );
}

export default Navbar;