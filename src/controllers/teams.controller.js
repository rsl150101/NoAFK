const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  getTeam = async (req, res, next) => {
    const { teamId } = req.params;

    const { teamName, status } =
      await this.teamService.findTeamNameAndStatusByTeamId(teamId);

    const isSoftDeletedProject = status === 5;
    if (isSoftDeletedProject) {
      return res.render('deletedTeam');
    }

    const memberList = await this.teamService.findAllByTeamId(teamId);
    for (let member of memberList) {
      const { nickname } = await this.teamService.findUserById(member.userId);
      member.nickname = nickname;
    }

    return res.render('myteam', {
      teamName,
      status,
      memberList,
    });
  };

  postTeamMember = async (req, res, next) => {
    const { teamId } = req.params;
    const { nickname, position } = req.body;
    const { id: userId } = await this.teamService.findUserByNickname(nickname);

    const newMember = await this.teamService.addNewMember(
      position,
      userId,
      teamId
    );

    return res.status(201).json(newMember);
  };

  updateTeam = async (req, res, next) => {
    const { teamId } = req.params;
    const { status } = req.body;

    const updatedTeamStatus = await this.teamService.updateStatus(
      teamId,
      status
    );

    return res.status(200).json({ updatedTeamStatus }); // 임시구현
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
