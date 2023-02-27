import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Snippet from './Snippet';
import { SnippetGridProps } from '../dec/props';

export default function SnippetGrid(props: SnippetGridProps) {
    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={3}>
                {props.snippets.map((snippet) => (
                    <Grid item key={snippet.shortid} xs={12} sm={12} md={6}>
                        {/* <Snippet /> */}
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}