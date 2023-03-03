const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  getTeam = async (req, res, next) => {
    const { teamId } = req.params;

    const teamName = 'jin'; // 임시구현
    const projectStatus = 0; // 임시구현
    const memberList = await this.teamService.findAllByTeamId(teamId);

    return res.status(200).json({ teamName, projectStatus, memberList });
  };

  postTeamMember = async (req, res, next) => {
    const { teamId } = req.params;
    const { nickname, position } = req.body;

    const userId = 2; // 임시구현
    const newMember = await this.teamService.addNewMember(
      position,
      userId,
      teamId
    );

    return res.status(201).json(newMember);
  };

  updateTeam = async (req, res, next) => {
    const { teamId } = req.params;
    let status = 5; // 소프트 삭제 상태
    if (req.body.status) {
      status = req.body.status;
    }

    return res.status(200).json({ msg: 'updateTeam success', status }); // 임시구현
  };

  updateTeamMember = async (req, res, next) => {
    const { teamId, memberId } = req.params;
    const { position, task } = req.body;

    const updatedMember = await this.teamService.updateMember(
      memberId,
      position,
      task
    );

    return res.status(200).json({ updatedMember });
  };

  deleteTeamMember = async (req, res, next) => {
    const { teamId, memberId } = req.params;

    const deletedMember = await this.teamService.deleteMember(memberId);

    return res.status(200).json({ deletedMember });
  };
}

module.exports = TeamsController;
