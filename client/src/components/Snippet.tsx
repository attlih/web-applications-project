import React from 'react'
import {
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box
} from '@mui/material'
import Comment from './Comment'
import { type SnippetProps } from '../misc/props'
import { ThumbUp, Comment as CommentIcon } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
// highlight.js for react
import SyntaxHighlighter from 'react-syntax-highlighter'
import { formatDateTime } from '../misc/functions'
import CommentForm from './CommentForm'

function Snippet (props: SnippetProps): JSX.Element {
  if (props.snippet == null) return (<div></div>)
  // filter comments by snippet
  const comments = props.comments.filter(comment =>
    props.snippet?.comments.some(c => c === comment._id)
  )

  return (
        <Card sx={{ bgcolor: 'grey', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ textAlign: 'left', flexGrow: 1 }}>
                {/* Title */}
                <Typography
                    gutterBottom
                    variant="h5"
                    onClick={() => { props.handlers.handleSnippetClick(props.snippet) }}
                    component="h2">
                    {props.snippet.title}
                </Typography >
                {/* Code */}
                <Box sx={{ maxHeight: 600, display: 'flex', flexDirection: 'column' }}>
                    <SyntaxHighlighter >
                        {props.snippet.code}
                    </SyntaxHighlighter>
                </Box>
                {/* Timestamp */}
                <Typography variant='body2'>
                    { props.snippet.postedon === props.snippet.editedon
                      ? 'Posted: ' + formatDateTime(props.snippet.postedon)
                      : 'Edited: ' + formatDateTime(props.snippet.editedon)
                    }
                </Typography>
            </CardContent>
            <CardActions >
                {/* Like button */}
                <IconButton size="small" onClick={() => { props.handlers.handleLikeButton(props.snippet) }}>
                    <ThumbUp />
                    <Typography p={0.5} variant='body1'>
                        {props.snippet.likes.length}
                    </Typography>
                </IconButton>
                {/* Comment button */}
                <IconButton
                    size="small"
                    onClick={() => { props.handlers.handleSnippetClick(props.snippet) }}>
                    <CommentIcon />
                    <Typography p={0.5} variant='body1'>
                        {props.snippet.comments.length}
                    </Typography>
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {/* Edit button */}
                {(props.user?.id === props.snippet?.postedby ||
                        props.user?.username === 'admin') &&
                        props.clicked
                  ? <IconButton
                        size="small"
                        onClick={() => { props.handlers.handleEditButton(props.snippet) }
                        }>
                        <EditIcon />
                    </IconButton>
                  : null
                }
                {/* Delete button */}
                {props.user?.username === 'admin' && props.clicked
                  ? <IconButton
                        size="small"
                        onClick={() => { props.handlers.handleDeleteButton(props.snippet) }}>
                        <DeleteForeverIcon />
                    </IconButton>
                  : null
                }
            </CardActions>
            {/* Comments */}
            {props.clicked
              ? <Stack
                    direction="column"
                    sx={{ m: 0.5, p: 1, bgcolor: 'grey.300' }}>
                    {comments.map((comment) => (
                        <Stack
                            key={comment._id}
                            direction={'row'}
                            sx={{ m: 0.5 }}>
                            <Comment
                                _id={comment._id}
                                postedby={comment.postedby}
                                comment={comment.comment}
                                postedon={comment.postedon}
                                likes={comment.likes}
                                editedon={comment.editedon} />
                            {/* Like button */}
                            <IconButton
                                onClick={() => { props.handlers.handleCommentLikeButton(comment) }}>
                                <ThumbUp />
                                <Typography p={0.5} variant='body1'>
                                    {comment.likes.length}
                                </Typography>
                            </IconButton>

                            {/* Edit button */}
                            {(props.user?.username === comment?.postedby ||
                            props.user?.username === 'admin')
                              ? <IconButton
                                    onClick={() => { props.handlers.handleCommentEditButton(comment) }}>
                                    <EditIcon />
                                </IconButton>
                              : null
                            }
                            {/* Delete button */}
                            {props.user?.username === 'admin'
                              ? <IconButton
                                    onClick={() => { props.handlers.handleCommentDeleteButton(comment) }}>
                                    <DeleteForeverIcon />
                                </IconButton>
                              : null
                            }
                        </Stack>
                    ))}
                    {/* New comment */}
                    {props.snippet !== null && (props.user != null)
                      ? <CommentForm
                            commentForm={props.commentForm.commentForm}
                            handleCommentChange={props.commentForm.handleCommentChange}
                            handleCommentSubmit={props.commentForm.handleCommentSubmit} />
                      : null
                    }
                </Stack>
              : null
            }
        </Card>
  )
}

export { Snippet }
