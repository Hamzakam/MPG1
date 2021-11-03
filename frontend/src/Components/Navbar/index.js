import './Navbar.css'
import React from "react";
import {
  Nav,
  Bars,
  NavMenu,
  NavBtn,
  Logo,
  NavLink,
  NavBtnLink,
  NavBtnLink2,
} from "./NavbarElements";
import Img from "./1.png";
import SearchBar from "../SearchBar/SearchBar";
import BookData from "../Data.json";
import AddIcon from '@mui/icons-material/Add';

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
        <NavBtnLink2 className="plus" to="/community"><AddIcon/></NavBtnLink2>
      </Nav>
    </>
  );
};


export default Navbar;
