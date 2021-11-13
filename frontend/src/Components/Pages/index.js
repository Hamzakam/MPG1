import React from 'react'
import Cardfeed from '../Card/Cardfeed'
import ComCard from '../SubCom/ComCard';
import './pages.css'
const Home = () => {
    return (
        <div className="parentcard">
        <div className="card" > 
            {/* <Cardfeed/> */}
            
        </div>

        <div className="comcard">
            <ComCard/>
        </div>
        </div>
    )
}

export default Home