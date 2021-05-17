var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>{
    const total = function(accumulator, currentValue){
        return accumulator + currentValue.likes
      }

    return blogs.length === 0 
    ? 0
    : blogs.reduce(total, 0)
}

const favouriteBlog = (blogs) =>{
    var index = 0
    var CurrentHigh = -99
    if (blogs.length === 0){
        return 0
    }
    for (i = 0; i < blogs.length; i++){
        if (blogs[i].likes > CurrentHigh){
            CurrentHigh = blogs[i].likes
            index = i
        }
    }
    return {
        "title": blogs[index].title,
        "author": blogs[index].author,
        "likes": blogs[index].likes
    }
}

const mostBlogs = (blogs) =>{
    const numBlogs = (blog) =>{
        return blog.author
    }
    if (blogs.length === 0){
        return 0
    }
    var name = ''
    var number = 0
    var test = _.countBy(blogs,numBlogs)
    _.forEach(test, function(value, key){
        if (value > number){
            number = value
            name = key
        }
    })
    return({
        "author": name,
        "blogs": number
    })

}

const mostLikes = (blogs) =>{
    const numBlogs = (blog) =>{
        return blog.author
    }
    const total = function(accumulator, currentValue){
        return accumulator + currentValue.likes
      }

    var test = _.groupBy(blogs, numBlogs)
    var name = ''
    var totalLikes = 0
    
    _.forEach(test, function(value,key){
        const currentLikes = value.reduce(total, 0 )
        if (currentLikes > totalLikes){
            name = key
            totalLikes = currentLikes
        }
    })

    return({
        author: name,
        likes: totalLikes
    })

}




module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}