import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SnippetGrid from '../components/SnippetGrid';
import SnippetForm from '../components/SnippetForm';
import { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth/validateToken';
import Snippet from '../components/Snippet';
import { log } from 'console';

interface HomeButtonsProps {
  handlePostButtonClick: () => void,
  handleLogout: (event: any) => void,
}
// TODO change data transfer handling, its a mess
// TODO login doesnt work as expected, stays logged in after refresh, even if no token
// TODO add like functionality
// TODO add logged in user info to appbar

function Home() {
  // states
  const [user, setUser] = useState<object | null>(getUserFromToken());
  // TODO change default values, not wokring when refreshing
  const [isPosting, setIsPosting] = useState(false);
  const [snippetClicked, setSnippetClicked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [snippets, setSnippets] = useState([{ _id: '', title: '', code: '', shortid: '', likes: [], comments: [], postedon: '', postedby: ''}]);
  const [snippetId, setSnippetId] = useState("");

  // fetch snippets
  useEffect(() => {
    fetch('/snippet')
      .then(res => res.json())
      .then(data => setSnippets(data))
  }, []);

  // Click handlers
  const handleSnippetClick = (shortid: string) => { // TODO fix type
    setSnippetClicked(!snippetClicked);
    setShowComments(!showComments);
    setSnippetId(shortid);
  };

  const handlePostButtonClick = () => {
    if (!user) return;
    setIsPosting(!isPosting);
  };

  const handleLogout = (event: any) => {
    event.preventDefault();
    localStorage.removeItem('token');
    setUser(getUserFromToken());
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
            handlePostButtonClick={handlePostButtonClick}
            handleLogout={handleLogout} />
        </Container>
      </Box>
      {isPosting && user ? <SnippetForm /> : null}
      {snippetClicked
      ? <Snippet snippet={
        snippets.filter((snippet) => snippet.shortid === snippetId)[0]
        }
        state={{
          showComments: showComments,
          handleClick: handleSnippetClick,
        }} />
        : <SnippetGrid snippets={snippets} snippetState={{
          showComments: showComments,
          handleClick: handleSnippetClick,
        }}/>
      }
    </main>
  );
}

function HomeButtons(props: HomeButtonsProps) {
  return (
    <div>
      {getUserFromToken()
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

export default Home;