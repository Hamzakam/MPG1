import React from 'react'
import Card  from '../Card/Card.js'
import ComCard from '../SubCom/ComCard';
import './pages.css'
const Home = () => {
    return (
        <div className="parentcard">
        <div className="card" > 
            <Card/>
            <Card/>
            <Card/>
            
        </div>

        <div className="comcard">
            <ComCard/>
        </div>
        </div>
    )
}

export default Home