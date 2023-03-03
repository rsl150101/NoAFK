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
    const teamName = 'jin'; // 'joo', 'bin', 'soo'
    const projectStatus = 0;
    const memberList = await this.teamService.findAllByTeamId(teamId);

    return res.status(200).json({ teamName, projectStatus, memberList });
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
    const teamId = req.params.teamId;
    let status = 5; // 소프트 삭제 상태
    if (req.body.status) {
      status = req.body.status;
    }
    console.log('status: ', status);
    // const updatedStatus = await this.projectService.팀상태변경(status)

    // return res.status(200).json(updatedStatus);
    return res.status(200).json({ msg: 'updateTeam success', status });
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
}

module.exports = TeamController;
