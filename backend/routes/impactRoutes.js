const express = require('express');
const router = express.Router();
const impactController = require('../controllers/impactController');

router.post('/generate', impactController.generate);

module.exports = router;
