const express = require('express');
const ApiController = require('../controllers/api.controller');

const router = express.Router();
const apiController = new ApiController();

module.exports = router;
