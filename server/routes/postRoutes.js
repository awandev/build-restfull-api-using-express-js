const express = require('express');
const router = express.Router();
const { getPosts } = require('../controllers/postsController')

router.route('/post').get(getPosts)
module.exports = router;