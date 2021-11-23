import "./Navbar.css";
import React, { useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import { logout } from "../Community/Login/services";
const Navbar = () => {
  const [toggleSign,setToggleSign] = useState(true);
  return (
    <>
      <Nav>
        <NavLink to="/">
          <Logo src={Img} alt="pic" />
        </NavLink>
        {/* <Bars /> */}
        <SearchBar placeholder="Search" data={BookData} />
        {localStorage.getItem("user") === null ? (
          <NavBtnLink 
          onClick={() => {
            setToggleSign(false);
          }}
          to="/signin">Sign In</NavBtnLink>
        ) : (
          <NavBtnLink
            to="/"
            onClick={() => {
              logout();
              setToggleSign(true);
            }}
          >
            Logout
          </NavBtnLink>
        )}
        <NavBtnLink2 className="plus" to="/community">
          <AddIcon />
        </NavBtnLink2>
      </Nav>
    </>
  );
};

export default Navbar;
