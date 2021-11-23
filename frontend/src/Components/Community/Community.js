import './Community.css'
import React, { useState } from 'react'
import Newpost from "../newpost/index"
import RichEditor from '../richeditor'
import { Button } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { sendCommunityData } from './services'
export const Community = () => {
  const [communityName,setCommunityName] = useState("");
  const [communityDesc,setCommunityDesc] = useState("");
  const handleCommFormSubmit = async (event)=>{
    event.preventDefault();
    const commObj = await sendCommunityData({ communityName, communityDesc });
    // setUser(userObj);
    console.log("In CommunityForm", commObj);
    setCommunityDesc("");
    setCommunityDesc("");
  }
  return (
      <div >
        <form className="community-form" onSubmit={handleCommFormSubmit}>
        <input 
          className="title"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)} 
          type="text"
          name="title"
          placeholder="Title"            
        />
        <textarea value={communityDesc}
          className="community-form-desc"
          onChange={(e) => setCommunityDesc(e.target.value)}
          rows="10"
          placeholder="Explain what your community is about." />
        <button className="community-form-submit" type="submit"> Create Community!</button>
        </form>
      </div>
  )
}
