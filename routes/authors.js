const express = require('express');
const router = express.Router();

const authorController = require('../controllers/author-controller');

// GET request for a specific user
router.get('/:authorid', authorController.authorGET);

module.exports = router;
