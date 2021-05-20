const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blogModel')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')
const userExtractor = middleware.userExtractor

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1,id:1})
  response.json(blogs.map(blog => blog.toJSON()))

  })

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user',{username:1,name:1,id:1})
  response.json(blog)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = request.user

      const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    })

    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog.id)
    await user.save()

    response.json(newBlog)
  
  })

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

  const userID = request.user._id
  if (userID == decodedToken.id){
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({ error: 'Wrong user' })

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