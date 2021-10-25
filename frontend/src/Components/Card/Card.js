import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ShareIcon from '@mui/icons-material/Share';
import Share from '@mui/icons-material/Share';
import Img from './images.jpg'
import { ImagesearchRoller } from '@mui/icons-material';

export default function MultiActionAreaCard() {
  return (
    <Card sx={{margin : 10,borderSpacing : 10,boxShadow: 5 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="210"
          image={Img}
          alt="Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Irfan Bhai Big Fan
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
          <IconButton size="small">
            10 <ArrowDropUpIcon/>
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
