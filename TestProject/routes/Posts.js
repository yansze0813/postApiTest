const express = require('express')
const router = express.Router()
const postControllers = require('../controllers/Posts')


router.get("/top_posts", postControllers.getTopPosts)
router.get("/comments", postControllers.getfilteredPosts)

module.exports = router