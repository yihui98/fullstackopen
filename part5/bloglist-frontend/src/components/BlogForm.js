import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ( { createBlog } ) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: title,
            author: author,
            url: url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return(
        <div>
        <h2>Create new blog</h2>
      <Form onSubmit = {addBlog}>
        <Form.Group>
            <Form.Label> title: </Form.Label>
              <Form.Control className = "title"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
            />
            <Form.Label>author:</Form.Label>
              <Form.Control className = "author"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
            />
            <Form.Label> url: </Form.Label>
              <Form.Control className = "url"
              type="text"
              value={url}
              name="URL"
              onChange={({ target }) => setUrl(target.value)}
            />
          <Button variant = "primary" id = "create" type = "submit">create</Button>
        </Form.Group>
      </Form>
        </div>
    )
}

export default BlogForm