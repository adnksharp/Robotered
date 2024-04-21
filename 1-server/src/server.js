const express = require('express'),
	prs = require('./routes/posts.routes.js'),
	server = express()

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(prs)

module.exports = server
