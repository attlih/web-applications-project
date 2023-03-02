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
import { SnippetProps } from '../types/props'
import { ThumbUp, Comment as CommentIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// highlight.js for react
import SyntaxHighlighter from 'react-syntax-highlighter';

function Snippet(props: SnippetProps) {
    if (!props.snippet) return (<div></div>);
    // filter comments by snippet
    const comments = props.comments.filter(comment => props.snippet?.comments.some(c => c === comment._id))

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey' }}>
            <CardContent sx={{ textAlign: 'left' }}>
                <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    onClick={() => props.handlers.handleSnippetClick(props.snippet)}>
                    {props.snippet.title}
                </Typography>
                <SyntaxHighlighter >{props.snippet.code}</SyntaxHighlighter>
            </CardContent>
            <CardActions >
                <IconButton size="small" onClick={props.handlers.handleLikeButton}>
                    <ThumbUp /> {props.snippet.likes.length}
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => props.handlers.handleSnippetClick(props.snippet)}>
                    <CommentIcon /> {props.snippet.comments.length}
                </IconButton>
                {/* Check if user has posted */}
                {props.user &&
                    (props.user?.username === props.snippet.postedby ||
                        props.user?.username === 'admin') ?
                    <IconButton size="small" onClick={() =>
                        props.handlers.handleEditButton(props.snippet)
                    }><EditIcon />
                    </IconButton> :
                    null
                }
                {/* Check if admin user  */}
                {props.user?.username === 'admin' ?
                    <IconButton
                        size="small"
                        onClick={() => props.handlers.handleDeleteButton(props.snippet)}>
                        <DeleteForeverIcon />
                    </IconButton> :
                    null
                }
                {/* </Stack> */}
            </CardActions>
            {/* Show comments if snippet is clicked */}
            {props.other.snippetClicked ?
                <Stack
                    direction="column"
                    sx={{ p: 2, bgcolor: 'grey.300', }}>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            _id={comment._id}
                            postedby={comment.postedby}
                            comment={comment.comment}
                            postedon={comment.postedon} />
                    ))}
                    {/* Show new comment section */}
                    {props.user ?
                        <Box
                            component={'form'}
                            sx={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}
                            onSubmit={props.handlers.handleCommentSubmit}
                            autoComplete="off">
                            <TextField
                                variant='outlined'
                                label='Write a comment'
                                name='comment'
                                sx={{ bgcolor: 'white', mt: 1 }}
                                required
                                defaultValue={props.other.commentForm.comment}
                                onChange={props.handlers.handleCommentChange}
                                rows={6} />
                            <Button
                                type='submit'
                                variant='contained'
                                sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Box> :
                        null
                    }
                </Stack> :
                null
            }
        </Card>
    )
}

export { Snippet }