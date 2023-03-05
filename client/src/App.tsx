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
import { Home } from '@mui/icons-material';
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
              <Home />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
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
