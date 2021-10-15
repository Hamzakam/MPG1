import React from 'react'
import { Nav, 
        Bars, 
        NavMenu,
        NavBtn,
        NavLink, 
        NavBtnLink} from './NavbarElements';
import Img from './1.png'
import SearchBar from'../SearchBar/SearchBar';
import BookData from "../Data.json";

const Navbar = () => {
    return (
        <>
            <Nav>

                <NavLink to="/">
                <img src= {Img} className='pic' alt="pic"/>
                </NavLink>
                <Bars />
                <NavMenu>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/signin">Sign In</NavBtnLink>
                </NavBtn>
                <SearchBar placeholder="Search" data={BookData} />
            </Nav>
            

        </>
    )
}

export default Navbar
