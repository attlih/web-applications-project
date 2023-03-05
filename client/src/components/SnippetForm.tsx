import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { SnippetFormProps } from '../misc/props'

export default function SnippetForm(props: SnippetFormProps) {

    // handle tab keypress
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const target = event.target as HTMLTextAreaElement;
            const start = target.selectionStart;
            const end = target.selectionEnd;
            target.value = target.value.substring(0, start) + '\t' + target.value.substring(end);
            target.selectionStart = target.selectionEnd = start + 1;
            props.handlers.handleSnippetFormChange(target.value);
        }
      };

    return (
        <Box
            component={'form'}
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
            }}
            onSubmit={props.handlers.handleSnippetFormSubmit}
            autoComplete="off">
            <TextField variant='outlined' label='Title' name='title'
                required
                value={props.data.title}
                onChange={props.handlers.handleSnippetFormChange} />
            <TextField variant='outlined' label='Code' name='code' sx={{ mt: 1 }} type=''
                required multiline rows={6}
                value={props.data.code}
                onChange={props.handlers.handleSnippetFormChange} 
                onKeyDown={ handleKeyDown } />
            <Button type='submit' variant='contained' sx={{ mt: 2 }}>Submit</Button>
        </Box>
    )
}