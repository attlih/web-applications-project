import { Box, Button, Typography, Container, Stack, Grid } from '@mui/material'
import SnippetGrid from '../components/SnippetGrid';
import SnippetForm from '../components/SnippetForm';
import { useState, useEffect } from 'react';
import { getUserFromToken } from '../auth/validateToken';
import Snippet from '../components/Snippet';
import { SnippetType, CommentType, UserType, CommentFormType, SnippetFormType } from '../dec/types';

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
  const [user, setUser] = useState<UserType | null>(getUserFromToken());
  const [snippets, setSnippets] = useState<SnippetType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  // TODO change default values, not wokring when refreshing
  const [isPosting, setIsPosting] = useState(false); // show snippet form
  const [snippet, setSnippet] = useState<SnippetType | null>(null); // clicked snippet
  const [snippetClicked, setSnippetClicked] = useState(false);
  const [commentForm, setCommentForm] = useState<CommentFormType>({ "shortid": "", "comment": '', "user": "" });
  const [snippetForm, setSnippetForm] = useState<SnippetFormType>({
    title: '',
    code: '',
  });
  // check if user is still logged in
  useEffect(() => {
    const user = getUserFromToken() 
    setUser(user);
  }, []);


  // get snippets
  useEffect(() => {
    fetch('/snippet')
      .then(res => res.json())
      .then(data => setSnippets(data))
  }, []);


  // get comments
  useEffect(() => {
    fetch("/comment")
      .then(res => res.json())
      .then(data => {
        if (data) setComments(data);
      })
  }, []);

  // Click handlers
  const handleSnippetClick = (snippet: SnippetType | null) => {
    setSnippet(snippet);
    setSnippetClicked(!snippetClicked);
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

  const handleLikeButton = () => {
    if (!user || !snippet) return;
    fetch("/snippet/" + snippet.shortid, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": "Bearer " + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        setSnippet(data)
        // update snippets state
        const newSnippets = snippets.map((s) => {
          if (s.shortid === data.shortid) return data;
          else return s;
        });
        setSnippets(newSnippets);
      })
  }

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !snippet) return;
    if (commentForm.comment === "") return;
    // add user and post to comment
    commentForm.user = user.username;
    commentForm.shortid = snippet.shortid;
    // post comment
    fetch('/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify(commentForm),
    })
      .then((res) => res.json())
      .then((data) => {
        // update comments state
        setComments([...comments, data]);
        // add comment to snippet
        snippet.comments.push(data._id);
        // update snippets state
        const newSnippets = snippets.map((s) => {
          if (s.shortid === snippet.shortid) return snippet;
          else return s;
        });
        setSnippets(newSnippets);
        // clear form
        setCommentForm({
          user: '',
          comment: '',
          shortid: '',
        });
      });
  };

  // state handlers
  const handleCommentChange = (e: any) => { // TODO fix type
    e.preventDefault();
    if (!user) return;
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  /* Snippet form */ 
  const handleSnippetFormChange = (e: any) => { // TODO fix type
    setSnippetForm({ ...snippetForm, [e.target.name]: e.target.value });
  };

  const handleSnippetFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // send to server
    fetch('/snippet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': "Bearer " + localStorage.getItem('token')
      },
      body: JSON.stringify(snippetForm),
    })
      .then((res) => res.json())
      .then((data) => {
        // add snippet to state
        setSnippets([...snippets, data]);
        // clear form
        setSnippetForm({
          title: '',
          code: '',
        });
        setIsPosting(false);
      });
  };

  const snippetHandlers = { handleCommentChange, handleCommentSubmit, handleLikeButton, handleSnippetClick }
  const snippetFormHandlers = {handleSnippetFormChange, handleSnippetFormSubmit }
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
      {isPosting && user ? <SnippetForm data={snippetForm} handlers={snippetFormHandlers}/> : null}
      {snippetClicked
        ? <Snippet snippet={snippet} comments={comments} user={user}
          handlers={snippetHandlers}
          other={{ snippetClicked, commentForm }} />
        : <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={3}>
            {snippets.map((snippet) => (
              <Grid item key={snippet.shortid} xs={12} sm={12} md={6}>
                <Snippet snippet={snippet} comments={comments} user={user}
                  handlers={snippetHandlers}
                  other={{ snippetClicked, commentForm }} />
              </Grid>
            ))}
          </Grid>
        </Container>
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