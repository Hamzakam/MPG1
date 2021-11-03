import './Community.css'
import React from 'react'
import Newpost from "../newpost/index"
import RichEditor from '../richeditor'
import { Button } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export const Community = () => {
    return (
        <div>
          <input className="Title" 
                            type="text"
                            name="title"
                            placeholder="Title"
                        
          />
          <input className="Tags"
                            type="text"
                            name="title"
                            placeholder="Tags"
                        
          />
          <RichEditor/>
        </div>
    )
}
