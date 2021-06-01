/* eslint-disable no-inner-declarations */
import blogService from '../services/blogs'

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)
    newBlog.comments = []
    dispatch({
      type: "ADD",
      data: newBlog
    })
  }
}

export const addComments = (comment, blog ) => {
  return async dispatch => {
    await blogService.addComments(blog.id, comment)
    const changedBlog = {
      ...blog,
      comments: blog.comments.concat(comment)
    }
    dispatch({
      type: "ADD-COMMENT",
      data: changedBlog
    })
  }
}

export const addLikes = (blog) => {
  return async dispatch => {
    const toLike = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1
    }
    console.log(toLike)
    const data = await blogService.increaseLikes(toLike)
    console.log("DATA", data)
    dispatch({
    type: 'LIKE',
    data
  })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    blogs.sort(function (a,b){
        return b.likes - a.likes
      })
    await dispatch({
      type: 'INIT',
      data: blogs
    })
  }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogService.deleteBlog(id)
        await dispatch({
            type: 'DELETE',
            id: id
        })
    }
  }

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type){
    case "ADD":
      return state.concat(action.data)
    case "LIKE":{
      const changedBlog = action.data
      return state.map(blog =>
        blog.id !== changedBlog.id ? blog : changedBlog)
      }
    case "DELETE": {
        function findBlog(){
            return state.id === action.id
          }
        const index = state.findIndex(findBlog)
        return state.splice(index,1)
        }
    case "INIT":
      return action.data
    case "ADD-COMMENT":{
      const id = action.data.id
      return state.map(blog =>
        blog.id !== id ? blog: action.data)
    }

  default:
      return state
  }


}

export default reducer