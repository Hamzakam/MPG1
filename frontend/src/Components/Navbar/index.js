import React from 'react'
import { Nav, 
        Bars, 
        NavMenu,
        NavBtn,
        NavLink, 
        NavBtnLink} from './NavbarElements';
import Img from './1.png'


const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLink to="/">
                <img src= {Img} className='pic' alt="pic"     style={{ alignSelf: 'centre' }}/>
                </NavLink>
                <Bars />
                <NavMenu>
                    <NavLink to="/about" activeStyle>
                        About
                    </NavLink>
                    <NavLink to="/services" activeStyle>
                        Services
                    </NavLink>
                    <NavLink to="/contact-us" activeStyle>
                        Contact Us
                    </NavLink>
                    <NavLink to="/sign-up" activeStyle>
                        Sign Up
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/signin">Sign In</NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    )
}

export default Navbar
