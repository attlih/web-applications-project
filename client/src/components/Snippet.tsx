import * as React from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { bgcolor } from '@mui/system'

interface SnippetProps {
    snippet: {
        title: string,
        code: string,
        shortid: string
    }
}


export default function Snippet(props: SnippetProps) {

    const handleClick = (e: any) => { // TODO fix type
        console.log(props.snippet.shortid);
        //  open page with snippet
        window.location.href = `/snippet/${props.snippet.shortid}`;
    }

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey.100' }}
            onClick={handleClick}
        >
            <CardContent sx={{
                textAlign: 'left'
            }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.snippet.title}
                </Typography>
                <Typography sx={{whiteSpace: 'pre-line'}}>
                    {props.snippet.code}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Like</Button>
                <Button size="small">Comment</Button>
            </CardActions>
        </Card>
    )
}