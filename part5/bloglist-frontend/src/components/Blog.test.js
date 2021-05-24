import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', () => {
  const blog = {
    author: "name",
    url:"www.blog.com",
    title: "title",
    likes: 10,
    user:{
        username: "name2",
        id: "123"
    }
  }
  const user2 ={
    username: "name2",
    id: "123"
}
  const component = render(
    <Blog blog = {blog} user = {user2} />
  )
  component.debug()
  expect(component.container).toHaveTextContent(
      'name'
  )
})

test('blog url and likes are shown after clicking show button', () => {
    const blog = {
      author: "name",
      url:"www.blog.com",
      title: "title",
      likes: 10,
      user:{
          username: "name2",
          id: "123"
      }
    }
    const user2 ={
      username: "name2",
      id: "123"
  }

    const component = render(
      <Blog blog = {blog} user = {user2} />
    )
    const button = component.getByText('hide')
    fireEvent.click(button)
    component.debug()
    expect(component.container).toHaveTextContent(
        'name'
    )
  })

  test('like button pressed twice', () => {
    const blog = {
      author: "name",
      url:"www.blog.com",
      title: "title",
      likes: 10,
      user:{
          username: "name2",
          id: "123"
      }
    }
    const user2 ={
      username: "name2",
      id: "123"
  }
  const mockHandler = jest.fn()

    const component = render(
      <Blog blog = {blog} user = {user2} handleLikes = {mockHandler} />
    )
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)
    component.debug()
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('blog form works', () => {
      const createBlog = jest.fn()
      const component = render(
          <BlogForm createBlog = {createBlog} />
      )
      const title = component.container.querySelector('.title')
      const author = component.container.querySelector('.author')
      const url = component.container.querySelector('.url')
      const form = component.container.querySelector('form')

      fireEvent.change(title,{
          target: { value: 'this is the title' }
      })
      fireEvent.change(author,{
        target: { value: 'this is the author' }
      })
      fireEvent.change(url,{
        target: { value: 'www.blog.com' }
      })
      fireEvent.submit(form)


      expect(createBlog.mock.calls).toHaveLength(1)
      expect(createBlog.mock.calls[0][0].title).toContain('this is the title' )

  })