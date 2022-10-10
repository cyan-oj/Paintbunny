import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Navbar.css"
import UserMenu from "../UserMenu";
import GuestMenu from "../GuestMenu";

function Navbar() {
  const user = useSelector(state => state.session.user);
  
  const navMenu = user ? <UserMenu /> : <GuestMenu />

  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/">Posts</Link>
      <Link to="/">Groups</Link>
      <Link to="/">Premium</Link>
      <Link to="/">Help</Link>
      { navMenu }
    </nav>
  );
}

export default Navbar;