import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { SnippetFormProps } from '../dec/props'

export default function SnippetForm(props: SnippetFormProps) {
    return (
        <Box
            component={'form'}
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
            }}
            onSubmit={props.handlers.handleSnippetFormSubmit}
            autoComplete="off"
        >
            <TextField variant='outlined' label='Title' name='title'
                required
                defaultValue={props.data.title}
                onChange={props.handlers.handleSnippetFormChange} />
            <TextField variant='outlined' label='Code' name='code' sx={{ mt: 1 }}
                required
                defaultValue={props.data.code}
                multiline onChange={props.handlers.handleSnippetFormChange} rows={6} />
            <Button type='submit' variant='contained' sx={{ mt: 2 }}>Submit</Button>
        </Box>
    )
}