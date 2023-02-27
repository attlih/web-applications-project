import { Box, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { CommentType } from '../types'

// TODO add timestamp
// TODO change user format to username

export default function Comment(props: CommentType) {
    return (
        <Box
            sx={{
                m: 0.5,
                p: 2,
                bgcolor: "white",
                display: "flex" 
            }}>
            { props.postedby + ": " + props.comment }
        </Box>
    )
}