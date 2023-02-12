import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SnippetGrid from './SnippetGrid';
import SnippetForm from './SnippetForm';
import { useState } from 'react';

interface HomeButtonsProps {
  isLoggedIn: boolean,
  handlePostButtonClick: () => void,
  handleLogout: () => void,
}

function HomeButtons(props: HomeButtonsProps) {
  return (
    <div>
      {props.isLoggedIn
        ? <Stack
          spacing={2}
          sx={{ pt: 4 }}
          direction="row"
          justifyContent="center">
          <Button variant="contained" onClick={props.handlePostButtonClick}>Post</Button>
          <Button variant="outlined" onClick={props.handleLogout}>Log out</Button>
        </Stack>
        : <Stack spacing={2}
          sx={{ pt: 4 }}
          direction="row"
          justifyContent="center">
          <Button variant="contained" href='/login'>Login</Button>
          <Button variant="outlined" href='/register'>Register</Button>
        </Stack>
      }
    </div>
  )
}

export default function Home() {
  const [isLoggedin, setIsLoggedin] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const handlePostButtonClick = () => {
    setIsPosting(!isPosting);
  };

  // TODO check if user is logged in

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedin(false);
  };
  

  return (
    <main>
      {/* Hero unit */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Snippety
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Awesome collection of code snippets, for everyone. By creating an account you can save your own snippets and share them with others.
          </Typography>
          <HomeButtons
            isLoggedIn={isLoggedin}
            handlePostButtonClick={handlePostButtonClick}
            handleLogout={handleLogout} />
        </Container>
      </Box>
      {isPosting ? <SnippetForm /> : null}
      <SnippetGrid />
    </main>
  );
}