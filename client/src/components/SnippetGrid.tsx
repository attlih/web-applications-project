import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Snippet from './Snippet';

export default function SnippetGrid() {
    const [snippets, setSnippets] = React.useState([
        {
            title: 'Snippet 1',
            code: 'console.log("Hello World")',
            shortid: "1fsad"
        }
    ]);

    // fetch snippets
    React.useEffect(() => {
        fetch('/snippet')
            .then(res => res.json())
            .then(data => setSnippets(data))    
    }, []);

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={3}>
                {snippets.map((snippet) => (
                    <Grid item key={snippet.shortid} xs={12} sm={12} md={6}>
                        <Snippet snippet={snippet} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}