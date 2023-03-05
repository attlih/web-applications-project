import React from 'react'
import { useState, type FormEvent } from 'react'
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
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

export default function SignIn (props: Props): JSX.Element {
  // redirect to home if user is already logged in
  props.verifyAuth()
  const [error, setError] = useState('')
  const [user, setUser] = useState({
    user: '',
    password: ''
  })

  const handleChange = (e: any): void => { // TODO fix type
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
      .then(async (response) => {
        if (response.ok) {
          window.location.href = '/'
        }
        return await response.json()
      })
      .then((data) => {
        if (data.error !== undefined) {
          setError(data.error)
          return
        }
        if (data.token !== null) localStorage.setItem('token', data.token)
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
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="user"
              label="Email Address"
              name="user"
              autoComplete="email"
              autoFocus
              defaultValue={user.user}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              defaultValue={user.password}
              onChange={handleChange}
            />
            <Typography color="error" variant='body2'>{error}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Link href="/register" variant="body2">
              {"Don't have an account?"}
            </Link>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
