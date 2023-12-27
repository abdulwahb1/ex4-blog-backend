const blogRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {blogs: 0})
    response.json(blogs)
  })
  
  blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;
    // console.log('POST blogsRouter', { user });   // user is undefined here
    // console.log('POST blogsRouter', { request });
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    });
  
    const savedBlog = await blog.save();
  
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
  
    response.status(201).json(savedBlog);
  });

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
  
});

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  // console.log({ request });
  // console.log({ response });
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);

  // if (!decodedToken.id) {
  //   return response.json(401).json({ error: 'token invalid' });
  // }

  // const user = await User.findById(decodedToken.id);
  const user = await User.findById(request.user.id)
  const blog = await Blog.findById(request.params.id);

  console.log({ user });
  // console.log({ decodedToken });
  // console.log('blogid', blog.user.toString());
  // console.log('userid', user.toString());

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }

  if (blog) {
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
