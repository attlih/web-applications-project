import React from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
  Container,
  createTheme,
  ThemeProvider
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

interface Props {
  verifyAuth: () => void
}

const theme = createTheme()

export default function Register (props: Props): JSX.Element {
  // redirect to home if user is already logged in
  props.verifyAuth()
  const [error, setError] = React.useState('')
  const [user, setUser] = React.useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e: any): void => { // TODO fix type
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    fetch('/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(async (response) => {
        if (response.ok) {
          window.location.href = '/login'
        } else {
          return await response.json()
        }
      })
      .then((data) => {
        if (data !== undefined) {
          setError(data.error)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  defaultValue={user.username}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type={'email'}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  defaultValue={user.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  defaultValue={user.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Link href='/login' variant="body2">
              Already have an account?
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
