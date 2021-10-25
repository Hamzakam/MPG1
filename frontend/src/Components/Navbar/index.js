import React from "react";
import {
  Nav,
  Bars,
  NavMenu,
  NavBtn,
  Logo,
  NavLink,
  NavBtnLink,
} from "./NavbarElements";
import Img from "./1.png";
import SearchBar from "../SearchBar/SearchBar";
import BookData from "../Data.json";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to="/">
          <Logo src={Img} alt="pic" />
        </NavLink>
        {/* <Bars /> */}
        <SearchBar placeholder="Search" data={BookData} />
        
        <NavBtnLink to="/signin">Sign In</NavBtnLink>
        
      </Nav>
    </>
  );
};


export default Navbar;
