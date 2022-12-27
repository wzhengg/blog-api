const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment-controller');

// GET request for all comments
router.get('/comments', commentController.commentsGET);

// GET request for a specific comment
router.get('/comments/:commentid', commentController.commentGET);

// POST request for a specific comment
router.post('/comments/:commentid', commentController.commentPOST);

// PUT request for a specific comment
router.put('/comments/:commentid', commentController.commentPUT);

// DELETE request for a specific comment
router.delete('/comments/:commentid', commentController.commentDELETE);

module.exports = router;
