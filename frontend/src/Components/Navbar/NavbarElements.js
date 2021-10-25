import {NavLink as Link} from 'react-router-dom'
import {FaBars} from 'react-icons/fa'
import styled from 'styled-components'

export const Nav= styled.nav`
    background:#012c3d;
    height: 80px;
    display: flex;
    flex-direction:row;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem ;
    z-index: 10;
`
export const Logo = styled.img`
    height:79px;
`
export const NavLink = styled(Link)`
    color:#fff;
    
    text-decoration: none;
    padding: 0 1rem;
    
    cursor: pointer;
    &.active {
        color:#15cdfc;
    }
`

export const Bars =styled(FaBars)`
    color: #fff;

    @media screen and (max-width: 768px) {
        display:;
        postion:;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;      
    
`





export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: rgb(236, 112, 11);
    padding: 10px 22px;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    margin-right: 24px;

    @media screen and (max-width: 768px) {
        display: none;
    }
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`