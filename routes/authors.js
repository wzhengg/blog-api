const express = require('express');
const router = express.Router();

const authorController = require('../controllers/author-controller');

// GET request for a specific author
router.get('/:authorid', authorController.authorGET);

// POST request for creating an author
router.post('/', authorController.authorPOST);

// PUT request for updating an author
router.put('/:authorid', authorController.authorPUT);

module.exports = router;
