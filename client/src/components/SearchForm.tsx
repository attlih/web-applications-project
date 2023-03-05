import React from 'react'
import { Search } from '@mui/icons-material'
import { Box, IconButton, TextField } from '@mui/material'
import { type SearchFormProps } from '../misc/props'

const SearchForm = (props: SearchFormProps): JSX.Element => {
  return (
      <Box
        component="form"
        justifyContent={'center'}
        onSubmit={props.handlers.handleSearchFormSubmit}
        sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search"
          name="search"
          value={props.data.search}
          onChange={props.handlers.handleSearchFormChange} />
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <Search />
        </IconButton>
      </Box>
  )
}

export default SearchForm
