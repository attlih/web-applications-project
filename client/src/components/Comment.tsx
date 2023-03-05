import React from 'react'
import { Box, Typography } from '@mui/material'
import { type CommentType } from '../misc/types'
import { formatDateTime } from '../misc/functions'

export default function Comment (props: CommentType): JSX.Element {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'white',
        display: 'flex',
        flexDirection: 'row'
      }}>
      <Typography
        variant="body1"
        sx={{ fontWeight: 'bold' }}>
        {props.postedby + ':'}
      </Typography>
      <Typography variant="body1" paddingX={0.5} >
        {props.comment}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography variant="caption" >
        {props.postedon === props.editedon
          ? 'Posted:' + formatDateTime(props.postedon)
          : 'Edited:' + formatDateTime(props.editedon)
        }
      </Typography>
    </Box>
  )
}
