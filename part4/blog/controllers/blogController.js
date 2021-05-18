const blogsRouter = require('express').Router()
const Blog = require('../models/blogModel')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))

  })

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)

    const newBlog = await blog.save()
    response.json(newBlog)
  
  })

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const numLikes = request.body
  let blog = await Blog.findById(request.params.id)

  blog.likes = numLikes.likes

  const updatedBlog = blog

  const blogs = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(blogs)
})

  module.exports = blogsRouter