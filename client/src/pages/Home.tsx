import React, { useState, useEffect } from 'react'
import { Button, Typography, Container, Stack, Grid } from '@mui/material'
import SnippetForm from '../components/SnippetForm'
import { getUserFromToken } from '../auth/validateToken'
import { Snippet } from '../components/Snippet'
import { type SnippetType, type CommentType, type UserType, type CommentFormType, type SnippetFormType } from '../misc/types'
import { type HomeButtonsProps } from '../misc/props'
import SearchForm from '../components/SearchForm'

function Home (): JSX.Element {
  // states
  const [user, setUser] = useState<UserType | null>(null)
  const [snippets, setSnippets] = useState<SnippetType[]>([])
  const [comments, setComments] = useState<CommentType[]>([])
  const [snippet, setSnippet] = useState<SnippetType | null>(null)
  const [comment, setComment] = useState<CommentType | null>(null)
  // Booleans states
  const [isPosting, setIsPosting] = useState(false) // show snippet form
  const [isEditingSnippet, setIsEditingSnippet] = useState(false)
  const [isEditingComment, setIsEditingComment] = useState(false)
  // Form states
  const [commentForm, setCommentForm] = useState<CommentFormType>({
    shortid: '',
    comment: '',
    user: ''
  })
  const [snippetForm, setSnippetForm] = useState<SnippetFormType>({
    title: '',
    code: ''
  })
  const [searchForm, setSearchForm] = useState({
    search: ''
  })

  // check if user is still logged in
  useEffect(() => {
    const user = getUserFromToken()
    setUser(user)
  }, [])

  // get snippets
  useEffect(() => {
    fetch('/snippet')
      .then(async res => await res.json())
      .then(data => { setSnippets(data) })
      .catch(err => { console.log(err) })
  }, [])

  // get comments
  useEffect(() => {
    fetch('/comment')
      .then(async res => await res.json())
      .then(data => {
        if (data !== null) setComments(data)
      })
      .catch(err => { console.log(err) })
  }, [])

  /*
  Click handlers
  */
  const handlePostButtonClick = (): void => {
    if (user == null) return
    setIsPosting(!isPosting)
    if (isEditingSnippet) setIsEditingSnippet(!isEditingSnippet)
    setSnippetForm({
      title: '',
      code: ''
    })
  }

  const handleLogout = (event: any): void => {
    event.preventDefault()
    localStorage.removeItem('token')
    setUser(null)
  }

  const handleSnippetClick = (newSnippet: SnippetType | null): void => {
    // if the snippet is null, set snippet to newSnippet
    if ((snippet == null) && (newSnippet != null)) {
      // update snippets state
      setSnippet(newSnippet)
    // eslint-disable-next-line @typescript-eslint/brace-style
    }
    // if the snippet is not null, set snippet to null
    else if (snippet != null) {
      setSnippet(null)
    }
  }

  const handleLikeButton = (newSnippet: SnippetType | null): void => { // TODO fix 404 error
    const token = localStorage.getItem('token')
    if ((user == null) || (newSnippet == null) || (token === null)) return
    fetch('/snippet/like/' + newSnippet.shortid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    })
      .then(async res => {
        if (res.ok) return await res.json()
        else throw new Error(`Error: ${res.status} ${res.statusText}`)
      })
      .then(data => {
        // update snippets state
        const newSnippets = snippets.map((s) => {
          if (s.shortid === data.shortid) {
            setSnippet(data)
            return data
          } else return s
        })
        setSnippets(newSnippets)
      })
      .catch(err => { console.log(err) })
  }

  // handle edit button click
  const handleSnippetEditButton = (newSnippet: SnippetType | null): void => {
    if (newSnippet == null) return
    setIsPosting(!isPosting)
    setIsEditingSnippet(!isEditingSnippet)
    // set snippet form values
    setSnippetForm({
      title: newSnippet.title,
      code: newSnippet.code
    })
    // scroll to top
    window.scrollTo(0, 0)
  }

  // handle delete button click
  const handleSnippetDeleteButton = (newSnippet: SnippetType | null): void => {
    const token = localStorage.getItem('token')
    if (newSnippet == null || token === null) return
    fetch('/snippet/delete/' + newSnippet.shortid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    })
      .then(async res => await res.json())
      .then(data => {
        // update snippets state, data is the deleted snippet
        const newSnippets = snippets.filter((s) => s.shortid !== data.shortid)
        setSnippet(null)
        setSnippets(newSnippets)
      })
      .catch(err => { console.log(err) })
  }

  // handle comment delete button click
  const handleCommentDeleteButton = (newComment: CommentType | null): void => {
    const token = localStorage.getItem('token')
    if ((newComment == null) || (snippet == null) || token === null) return
    fetch('/comment/delete/' + newComment._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify({ snippet: snippet._id })
    })
      .then(async res => await res.json())
      .then(data => {
        // update snippets state, remove comment id from comments where it was posted
        const newSnippets = snippets.map((s) => {
          const index = s.comments.findIndex((c) => c === data._id)
          // if found, remove it
          if (index !== -1) {
            s.comments.splice(index, 1)
          }
          return s
        })
        setSnippets(newSnippets)
        // update comments state, data is the deleted comment
        const newComments = comments.filter((c) => c._id !== data._id)
        setComments(newComments)
      })
      .catch(err => { console.log(err) })
  }

  const handleCommentEditButton = (newComment: CommentType | null): void => {
    if (newComment == null) return
    if (!isEditingComment) {
      // update comment form to display clicked comment
      setCommentForm({
        comment: newComment.comment,
        user: '',
        shortid: ''
      })
      // update comment state
      setComment(newComment)
    } else {
      // clear comment form
      setCommentForm({
        comment: '',
        user: '',
        shortid: ''
      })
    }
    setIsEditingComment(!isEditingComment)
  }

  const handleCommentLikeButton = (newComment: CommentType | null): void => {
    const token = localStorage.getItem('token')
    if ((user == null) || (newComment == null) || token === null) return
    fetch('/comment/like/' + newComment._id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      }
    })
      .then(async res => {
        if (res.ok) return await res.json()
        else throw new Error('Error liking comment')
      })
      .then(data => {
        if (data !== null) {
          // update comments state
          const newComments = comments.map((c) => {
            if (c._id === data._id) return data
            else return c
          })
          setComments(newComments)
        }
      })
      .catch(err => { console.log(err) })
  }

  /* STATE HANDLERS */
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('Editing: ', isEditingComment)
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value })
  }

  /* Snippet form */
  const handleSnippetFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log('Editing: ', isEditingSnippet)
    setSnippetForm({ ...snippetForm, [e.target.name]: e.target.value })
  }

  const handleSearchFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value })
  }

  const handleCommentSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    const token = localStorage.getItem('token')
    event.preventDefault()
    if ((user == null) || (snippet == null) || commentForm.comment === null || token === null) return
    if (commentForm.comment === '') return
    // set route depending on if editing or not
    let route
    if (isEditingComment && (comment != null)) route = '/comment/edit/' + comment._id
    else if (!isEditingComment) route = '/comment'
    else {
      console.log('error, this should not happen')
      return
    }
    // add user and post to comment
    const newCommentForm = { ...commentForm, user: user.username, shortid: snippet.shortid }
    // post comment
    fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(newCommentForm)
    })
      .then(async (res) => {
        if (res.ok) return await res.json()
        else {
          const error = await res.json()
          throw new Error(error.message)
        }
      })
      .then((data) => {
        // if editing, update comment in state
        if (isEditingComment && (comment != null)) {
          const newComments = comments.map((c) => {
            if (c._id === data._id) return data
            else return c
          })
          setComments(newComments)
        // eslint-disable-next-line @typescript-eslint/brace-style
        }
        // if posting
        else {
          // add comment to state
          setComments([...comments, data])
          // add comment to snippet comments list
          const newSnippet = { ...snippet, comments: [...snippet.comments, data._id] }
          setSnippet(newSnippet)
        }

        // update snippet in state
        const newSnippets = snippets.map((s) => {
          if (s.shortid === data.shortid) {
            s.comments.push(data._id)
            return s
          } else return s
        })
        setSnippets(newSnippets)
        // clear comment form
        setCommentForm({
          comment: ''
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSnippetFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const token = localStorage.getItem('token')
    if (token === null) return
    // check if editing or posting
    let route: string
    if (isEditingSnippet && (snippet !== null)) {
      route = `/snippet/update/${snippet.shortid}`
    } else if (!isEditingSnippet) {
      route = '/snippet/add'
    } else {
      console.log('error, this should not happen')
      return
    }
    // send to server
    fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token
      },
      body: JSON.stringify(snippetForm)
    })
      .then(async (res) => await res.json())
      .then((data) => {
        if (isEditingSnippet) {
          setSnippet(data)
          // replace snippet in state
          const newSnippets = [...snippets]
          const index = snippets.findIndex((s) => s.shortid === data.shortid)
          newSnippets[index] = data
          setSnippets(newSnippets)
          setIsEditingSnippet(false)
        } else {
          // add snippet to state
          setSnippets([...snippets, data])
        }
        // clear form
        setSnippetForm({
          title: '',
          code: ''
        })
        setIsPosting(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleSearchFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    // send to server
    fetch('/snippet/search/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchForm)
    })
      .then(async (res) => await res.json())
      .then((data) => {
        // add snippet to state
        setSnippets(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handlers = {
    handleLikeButton,
    handleSnippetClick,
    handleEditButton: handleSnippetEditButton,
    handleDeleteButton: handleSnippetDeleteButton,
    handleCommentLikeButton,
    handleCommentEditButton,
    handleCommentDeleteButton
  }
  const snippetFormHandlers = { handleSnippetFormChange, handleSnippetFormSubmit }
  const commentFormProps = { commentForm, handleCommentChange, handleCommentSubmit }

  return (
    <main>
      {/* Root unit */}
      <Container maxWidth={false}>
        {/* Title */}
        <Typography
          component="h1"
          variant="h2"
          color="text.primary"
          gutterBottom
        >
          Snippety
        </Typography>
        {/* Description */}
        <Typography variant="h5" align="center" color="text.secondary" paragraph gutterBottom >
          Awesome collection of code snippets, for everyone. By creating an account you can save
          your own snippets and share them with others. Create an user and start saving your snippets!
        </Typography>
        {/* Buttons */}
        <HomeButtons
          handlePostButtonClick={handlePostButtonClick}
          user={user}
          handleLogout={handleLogout} />
        {/* Snippet form */}
        {isPosting && (user != null)
          ? <SnippetForm
          data={snippetForm}
          handlers={snippetFormHandlers} />
          : null
        }
        {/* Search form */}
        <SearchForm
        data={searchForm}
        handlers={{
          handleSearchFormSubmit,
          handleSearchFormChange
        }}
        />
        {/* Show one or all snippets */}
        <Grid container spacing={4} justifyContent="center" my={1}
        >
          {snippet !== null
            ? <Grid item key={snippet.shortid} xs={12} sm={12} md={12} lg={12} xl={6}>
              <Snippet
                user={user}
                snippet={snippet}
                clicked={true}
                comments={comments}
                comment={comment}
              commentForm={commentFormProps}
              handlers={handlers} />
            </Grid>
            : snippets.map((snippet) => (
              <Grid item key={snippet.shortid} xs={12} sm={12} md={12} lg={12} xl={6}>
                <Snippet
                  user={user}
                  snippet={snippet}
                  clicked={false}
                  comments={comments}
                  comment={comment}
                  commentForm={commentFormProps}
                  handlers={handlers} />
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </main>
  )
}

function HomeButtons (props: HomeButtonsProps): JSX.Element {
  return (
    <Grid container justifyContent={'center'}>
      {(props.user !== null)
        ? <Stack
          spacing={2}
          direction="row">
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
    </Grid>
  )
}

export default Home
