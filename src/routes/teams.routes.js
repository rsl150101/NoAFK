const express = require('express');
const TeamController = require('../controllers/teams.controller');

const router = express.Router();
const teamController = new TeamController();

module.exports = router;
