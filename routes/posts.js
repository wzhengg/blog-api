const express = require('express');
const router = express.Router();

const postController = require('../controllers/post-controller');
const commentsRouter = require('./comments');

// GET request for all posts
router.get('/', postController.postsGET);

// GET request for a specific post
router.get('/:postid', postController.postGET);

// POST request for creating a post
router.post('/', postController.postPOST);

// PUT request for a specific post
router.put('/:postid', postController.postPUT);

// DELETE request for a specific post
router.delete('/:postid', postController.postDELETE);

router.use('/:postid', commentsRouter);

module.exports = router;
