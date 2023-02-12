import {
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material';
import { mapToStyles } from '@popperjs/core/lib/modifiers/computeStyles';
import { FormEventHandler, useState } from 'react';

interface FormData {
    title: string;
    code: string;
}


export default function SnippetForm() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        code: '',
    });

    const handleChange = (e: any) => { // TODO fix type
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // send to server
        fetch('/snippet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((res) => res.json())
            .then((data) => console.log(data));
        // clear form
        setFormData({
            title: '',
            code: '',
        });
    };


    return (
        <Box
            component={'form'}
            sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
            }}
            onSubmit={handleSubmit}
            autoComplete="off"
        >
            <TextField variant='outlined' label='Title' name='title'
                required
                defaultValue={formData.title}
                onChange={handleChange} />
            <TextField variant='outlined' label='Code' name='code' sx={{ mt: 1 }}
                required
                defaultValue={formData.code}
                multiline onChange={handleChange} rows={6} />
            <Button type='submit' variant='contained' sx={{ mt: 2 }}>Submit</Button>
        </Box>
    )
}