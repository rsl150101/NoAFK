const express = require('express');
const ApiController = require('../controllers/api.controller');

const router = express.Router();
const apiController = new ApiController();

router.post('/auth/join', apiController.join);
router.post('/auth/login', apiController.login);
router.get('/auth/logout', apiController.logout);

module.exports = router;
