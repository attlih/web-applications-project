import { Box, Button, TextField } from "@mui/material"
// import { useMemo } from "react"
import { CommentFormProps } from "../misc/props"
// TODO does not empty comment field after submit
export default function CommentForm(props: CommentFormProps) {

    return (
        <Box
            component={'form'}
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
            }}
            onSubmit={(event) => props.handleCommentSubmit(event)}
            autoComplete="off">
            <TextField
                variant='outlined'
                placeholder='Write a comment'
                name='comment'
                sx={{ bgcolor: 'white', mt: 1 }}
                value={props.commentForm.comment}
                onChange={props.handleCommentChange}
                rows={6} />
            <Button
                type='submit'
                variant='contained'
                sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    )
}