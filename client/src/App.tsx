import './App.css';
import { Outlet } from 'react-router-dom';
import {
  Typography,
  Link,
  CssBaseline,
  AppBar,
  Toolbar,
  Box,
  IconButton,
} from '@mui/material';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* AppBar */}
        <AppBar position="static">
          <Toolbar >
            <IconButton edge="start" href="/">
              <TextSnippetIcon /> Snippety
            </IconButton>
            {/* <Box sx={{justifyContent: 'right', direction: 'row', m: 5}}> */}
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="h6" component="div">
              Hello, world!
            </Typography>
            {/* </Box> */}
          </Toolbar>
        </AppBar>
        {/* Main page */}
        <Outlet />
        {/* Footer */}
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
          <Typography variant="h6" align="center" gutterBottom>
            Snippety
          </Typography>
          <Copyright />
        </Box>
      </ThemeProvider>
    </div>
  );
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/attlih">
        Atte Lihtamo
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default App;
