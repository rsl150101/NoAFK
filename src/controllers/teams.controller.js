const TeamService = require('../services/teams.service');

class TeamController {
  teamService = new TeamService();
}

module.exports = TeamController;
