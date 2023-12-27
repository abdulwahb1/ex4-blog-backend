const User = require('../models/user')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {blogs: 0})
    response.json(blogs)
  })
  
blogRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
  
});

blogRouter.delete('/:id', async (request, response) => {
  // console.log({ request });
  // console.log({ response });
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.json(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);
  const blog = await Blog.findById(request.params.id);

  console.log({ user });
  console.log({ decodedToken });
  console.log('blogid', blog.user.toString());
  console.log('userid', user.id.toString());

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (user) {
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      return response
        .status(401)
        .json({ error: 'user unauthorized to delete blog' });
    }
  } else {
    return response.status(403).end();
  }
});

  module.exports = blogRouter
