const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const minPasswordLength = (password) => {
    return password.length >= 3 // Set the desired minimum length
}

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!minPasswordLength(password)) {
        return response.status(400).json({ error: 'Password should be at least 6 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter


