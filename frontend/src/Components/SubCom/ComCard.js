import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import React from 'react'
import { Grid, List } from '@mui/material';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function MultiActionAreaCard() {
    return(
        <Grid container direction="column" alignItems="flex-end">
            <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h8" component="div">
            The recommendation system will show the content on this section.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </Grid>


        
          );
}