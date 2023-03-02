import {
    Stack,
    Card,
    CardContent,
    CardActions,
    Button,
    IconButton,
    Typography,
    Box,
    TextField,
} from '@mui/material'
import Comment from './Comment'
import { SnippetProps } from '../dec/props'
import { ThumbUp, Comment as CommentIcon } from '@mui/icons-material';
// highlight.js for react
import SyntaxHighlighter from 'react-syntax-highlighter';

function Snippet(props: SnippetProps) {
    if (!props.snippet) return (<div></div>);
    // filter comments by snippet
    const comments = props.comments.filter(comment => props.snippet?.comments.some(c => c === comment._id))

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey' }}>
            <CardContent onClick={() => props.handlers.handleSnippetClick(props.snippet)} sx={{ textAlign: 'left' }}>
                <Typography gutterBottom variant="h5" component="h2">{props.snippet.title}</Typography>
                <SyntaxHighlighter >{props.snippet.code}</SyntaxHighlighter>
            </CardContent>
            <CardActions>
                <IconButton size="small" onClick={props.handlers.handleLikeButton}><ThumbUp /> {props.snippet.likes.length}</IconButton>
                <IconButton size="small" onClick={() => props.handlers.handleSnippetClick(props.snippet)}><CommentIcon /> {props.snippet.comments.length}</IconButton>
            </CardActions>
            {props.other.snippetClicked
                ? <Stack
                    direction="column"
                    sx={{ p: 2, bgcolor: 'grey.300', }}>
                    {comments.map((comment) => (
                        <Comment key={comment._id} _id={comment._id} postedby={comment.postedby} comment={comment.comment} postedon={comment.postedon} />
                    ))}
                    {props.user
                        ? <Box
                            component={'form'}
                            sx={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}
                            onSubmit={props.handlers.handleCommentSubmit}
                            autoComplete="off">
                            <TextField variant='outlined' label='Write a comment' name='comment' sx={{ bgcolor: 'white', mt: 1 }}
                                required defaultValue={props.other.commentForm.comment} onChange={props.handlers.handleCommentChange} rows={6} />
                            <Button type='submit' variant='contained' sx={{ mt: 2 }}>Submit</Button>
                        </Box>
                        : null
                    }
                </Stack>
                : null
            }
        </Card>
    )
}

// export all
export { Snippet }