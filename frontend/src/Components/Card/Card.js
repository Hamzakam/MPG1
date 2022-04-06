import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions, Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShareIcon from '@mui/icons-material/Share';
import Share from '@mui/icons-material/Share';
import Img from './images.jpg'
import { ImagesearchRoller } from '@mui/icons-material';


export default function MultiActionAreaCard({post}) {
  return (
    <Card sx={{margin: 2.5,boxShadow: 5,width:"100%" }} key= {post.id}>
      <CardActionArea>
      <CardContent>
          <Typography gutterBottom variant="h4" align="Left">
            {post.title}
          </Typography>
          <Typography gutterBottom variant="h6" align="left"  st>
            {post.community.name}
          </Typography>
          <Typography gutterBottom variant="h7" display="grid" align="left">
            {post.user.username}
          </Typography>
          <Typography>
            {post.content}
          </Typography>
          
        </CardContent>
      </CardActionArea>
      <CardActions>
          <IconButton size="small">
            {post.votes} <ArrowDropUpIcon/>
          </IconButton>
          <IconButton size="small">
            <ArrowDropDownIcon/>
          </IconButton>
          <IconButton size="small">
            <Share/>
          </IconButton>
      </CardActions>
    </Card>
  );
}
