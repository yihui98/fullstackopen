const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blogModel')

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 3,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiaWQiOiI2MGE1ZWJjODZmNzlhMjA1MzhmZjViNzEiLCJpYXQiOjE2MjE1MDU4ODN9.PE0REU6qbfyhUPH5VoGUSzebjjWMFAj8JgTrrnita1g"

beforeEach(async () => {
    await Blog.deleteMany({})
    
      const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
      const promiseArray = blogObjects.map(blog => blog.save())
      await Promise.all(promiseArray)
    })

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('Each notes has their own id', async () => {

    let blogs = await Blog.find({})
    blogs =  blogs.map(blog => blog.toJSON())
  
    const blogToView = blogs[0]
    blogs.forEach(blog =>
        expect(blog.id).toBeDefined())
  })

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Valid Blog",
    author: "me",
    url: "www.newblog.com",
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    let blogs = await Blog.find({})
    blogs =  blogs.map(blog => blog.toJSON())
  expect(blogs).toHaveLength(initialBlogs.length + 1)

  const titles = blogs.map(n => n.title)
  expect(titles).toContain(
    'Valid Blog'
  )
})

test('blog with likes property missing -> default to 0 ', async () => {
    const newBlog = {
      title: "Valid Blog with 0 likes",
      author: "me",
      url: "www.newblog.com",
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
    let blogs = await Blog.find({})
    blogs =  blogs.map(blog => blog.toJSON())
    expect(blogs).toHaveLength(initialBlogs.length + 1)

    const addedBlog = blogs[blogs.length - 1]
    expect(addedBlog.likes).toBe(0)
  })

test('blog with missing title/url ', async () => {
    const newBlog = {
      author: "me"
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(401)

  })

afterAll(() => {
    mongoose.connection.close()
  }) 