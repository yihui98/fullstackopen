const listHelper = require('../utils/list_helper')

const emptyList = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]
const blogs = [
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
    likes: 0,
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

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {


  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)

    expect(result).toBe(5)
  })

  test('when list has 3 blog', () => {
    const result = listHelper.totalLikes(blogs)
    console.log(result)
    expect(result).toBe(36)
  })

})

describe('favourite blog', () => {

  test('of empty list is zero', () => {
    const result = listHelper.favouriteBlog(emptyList)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    
    const answer =   {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }

    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual(answer)
  })

  test('when list has alot of blogs', () => {
    
    const answer =   {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    }
    const result = listHelper.favouriteBlog(blogs)
    expect(result).toEqual(answer)
  })

})

describe('most blogs',()=>{
  test('no blog', ()=>{
    const result = listHelper.mostBlogs(emptyList)
    expect(result).toBe(0)
  })
  test('one blog', () =>{
    const answer = {
      "author": 'Edsger W. Dijkstra',
      "blogs": 1
    }
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(answer)
  })

  test('many blog', () =>{
    const answer = {
      author: "Robert C. Martin",
      blogs: 3
    }
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(answer)
  })
})

describe('most likes', ()=>{
  
  test('no blog', ()=>{
    answer = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(answer)
    
  })
})