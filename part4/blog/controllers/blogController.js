const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blogModel')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{username:1,name:1,id:1})
  response.json(blogs.map(blog => blog.toJSON()))

  })

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user',{username:1,name:1,id:1})
  response.json(blog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  blog.comments = blog.comments.concat(request.body.comment)
  await blog.save()

  response.json(blog)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

      const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user,
      comments: []
    })

    const newBlog = await blog.save()
    user.blogs = user.blogs.concat(newBlog.id)
    await user.save()

    response.json(newBlog)
  
  })

blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

  const user = await User.findById(decodedToken.id)
  if (user._id == decodedToken.id){
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({ error: 'Wrong user' })

})

blogsRouter.put('/:id', async (request, response) => {
  console.log(request)
  const blog = request.body.blog
  blog.user = blog.user.id

  const updatedblog = await (await Blog.findByIdAndUpdate(request.params.id, blog, {new : true})).populated('user')
  response.json(updatedblog)
})

  module.exports = blogsRouter