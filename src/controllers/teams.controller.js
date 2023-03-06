const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  getTeam = async (req, res, next) => {
    const { teamId } = req.params;

    const projectInfo = await this.teamService.findTeamNameAndStatusByTeamId(
      teamId
    );
    const teamName = projectInfo.team_name;
    const projectStatus = projectInfo.status;

    if (projectStatus == 5) {
      return res.render('deletedTeam');
    }

    const memberList = await this.teamService.findAllByTeamId(teamId);
    const memberListHasNickname = JSON.parse(JSON.stringify(memberList));
    for (let i = 0; i < memberList.length; i++) {
      const userId = memberList[i].user_id;
      memberListHasNickname[i].nickname = `닉네임임시구현 ${userId}`;
    }
    // return res.status(200).json({ projectInfo, memberListHasNickname });
    return res.render('myteam', {
      teamName,
      projectStatus,
      memberListHasNickname,
    });
  };

  postTeamMember = async (req, res, next) => {
    const { teamId } = req.params;
    const { nickname, position } = req.body;

    const user = await this.teamService.findUserByNickname(nickname);
    const userId = user.id;
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
    // status == 5 => 소프트 삭제 상태

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
