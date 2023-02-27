import { useState, useEffect } from 'react'
import { bgcolor } from '@mui/system'
import {
    Stack,
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    TextField,
} from '@mui/material'
import Comment from './Comment'
import { getUserFromToken } from '../auth/validateToken'
import { SnippetType, CommentType } from '../types'

interface SnippetProps {
    snippet: SnippetType
    state: {
        handleClick: (shortid: string) => void,
        showComments: boolean,
    }
}



function Snippet(props: SnippetProps) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [user, setUser] = useState(getUserFromToken());
    const [formData, setFormData] = useState<FormData>({ user: '', comment: '', shortid: '' });

    // check if user is still logged in
    useEffect(() => {
        setUser(getUserFromToken());
    }, []);

    // get comments
    useEffect(() => {
        if (user) {
            fetch("/snippet/comment/" + props.snippet.shortid, {
                method: "GET",
                headers: {
                    'authorization': "Bearer " + localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    setComments(data);
                })
        }
    }, []);

    const handleLikeButton = () => {
        if (!user) return;
        fetch("/snippet/" + props.snippet.shortid, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem('token')
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    }

    const handleCommentChange = (e: any) => { // TODO fix type
        e.preventDefault();
        if (!user) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (!user) return;
        event.preventDefault();
        // add user and post to comment
        formData.user = user.username;
        formData.shortid = props.snippet.shortid;
        // post comment
        fetch('/snippet/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': "Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => {
                // clear form
                setFormData({
                    user: '',
                    comment: '',
                    shortid: '',
                });
            });
    };

    return (
        <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'grey.200' }}
        >
            <CardContent sx={{
                textAlign: 'left'
            }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {props.snippet.title}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {props.snippet.code}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleLikeButton}>Likes: {props.snippet.likes.length}</Button>
                <Button size="small" onClick={() => props.state.handleClick(props.snippet.shortid)}>Comments: {props.snippet.comments.length}</Button>
            </CardActions>
            {props.state.showComments
                ? <Stack
                    direction="column"
                    sx={{
                        p: 2,
                        bgcolor: 'grey.300',
                    }}>
                    {comments.map((comment) => (
                        <Comment key={comment._id} _id={comment._id} postedby={comment.postedby} comment={comment.comment} postedon={comment.postedon} />
                    ))}
                    {getUserFromToken()
                        ? <Box
                            component={'form'}
                            sx={{
                                display: 'inline-flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}
                            onSubmit={handleCommentSubmit}
                            autoComplete="off">
                            <TextField variant='outlined' label='Write a comment' name='comment' sx={{ bgcolor: 'white', mt: 1 }}
                                required defaultValue={formData.comment} onChange={handleCommentChange} rows={6} />
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

interface FormData {
    user: string,
    comment: string,
    shortid: string,
}


export default Snippet;