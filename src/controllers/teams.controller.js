const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class TeamController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  getTeam = async (req, res, next) => {
    const teamId = req.params.teamId;

    // const teamName = await this.ProjectService.get팀이름(teamId)
    // const projectStatus = await this.ProjectService.get프로젝트진행상태(teamId)
    const memberList = await this.teamService.findAllByTeamId(teamId);

    return res.status(200).json({ memberList });
  };

  postTeamMember = async (req, res, next) => {
    console.log('@@@@@@@ postTeamMember @@@@@@@');

    const teamId = req.params.teamId;
    const { nickname, position } = req.body;
    console.log(
      `teamId, nickname, position: ${teamId}, ${nickname}, ${position}`
    );

    // const userByNickname = await this.userService.findUserInfo(nickname);
    const userId = 2;
    const newMember = await this.teamService.addNewMember(
      position,
      // userByNickname.id,
      userId,
      teamId
    );

    return res.status(201).json(newMember);
  };

  updateTeam = async (req, res, next) => {
    // const { MemberList, projectStatus } = req.body
    const { MemberList } = req.body;

    for (let i = 0; i < MemberList.length; i++) {
      await this.teamService.updateTeamMember(MemberList[i]);
    }

    return res.status(200).json({ msg: success });
  };

  deleteTeam = async (req, res, next) => {};
}

module.exports = TeamController;
