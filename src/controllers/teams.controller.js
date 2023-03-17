const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  renderTeamPage = async (req, res, next) => {
    const { teamId } = req.params;

    try {
      const { teamName, status } =
        await this.teamService.findTeamNameAndStatusByTeamId(teamId);
      const memberList = await this.teamService.findAllByTeamId(teamId);

      return res.render('myteam', {
        teamName,
        status,
        memberList,
      });
    } catch (error) {
      return res.render('deletedTeam');
    }
  };

  getAllTeam = async (req, res, next) => {
    const allTeam = await this.teamService.findAllTeam();
    // teamName, owner, status(프로젝트 진행상태), tech_stack, recruit_deadline, project_start, project_end
    console.log(allTeam);
    return res.render('allteam', {
      allTeam,
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

    return res.status(200).json({ updatedTeamStatus });
  };

  deleteTeam = async (req, res, next) => {
    const { teamId } = req.params;

    const deletedTeam = await this.teamService.deleteTeam(teamId);

    return res.status(200).json({ message: '팀 삭제 성공!' });
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

  // 모집공고 참가 신청
  apply = async (req, res) => {
    try {
      const { projectId } = req.params;

      if (!res.locals.user) {
        return res.render('login.html');
      }
      const userId = res.locals.user.id;

      await this.teamService.apply(projectId, userId);

      return res.status(200).json({ message: '참가 신청 완료!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // 모집공고 신청 수락
  acceptApply = async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      const acceptResult = await this.teamService.acceptApply(
        projectId,
        userId
      );

      return res.status(200).json(acceptResult);
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }
  };
}

module.exports = TeamsController;
