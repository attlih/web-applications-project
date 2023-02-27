import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Snippet from './Snippet';

interface SnippetGridProps {
    snippets: {
        _id: string,
        title: string,
        code: string,
        shortid: string,
        postedby: string,
        postedon: string,
        likes: string[],
        comments: string[],
    }[],
    snippetState: {
        handleClick: (shortid: string) => void,
        showComments: boolean,
    }
}

export default function SnippetGrid(props: SnippetGridProps) {
    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={3}>
                {props.snippets.map((snippet) => (
                    <Grid item key={snippet.shortid} xs={12} sm={12} md={6}>
                        <Snippet snippet={snippet} state={props.snippetState}/>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}