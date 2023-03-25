const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

const { NotFoundNickname, AlreadyMember } = require('../utility/customError');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  renderTeamPage = async (req, res, next) => {
    const { teamId } = req.params;
    const { nickname } = res.locals.user;

    try {
      const memberList = await this.teamService.findAllByTeamId(teamId);

      if (memberList.length === 0) {
        return res.render('deletedTeam');
      }

      const { teamName, status } =
        await this.teamService.findTeamNameAndStatusByTeamId(teamId);

      return res.render('myteam', {
        pageTitle: 'My Team',
        teamName,
        status,
        memberList,
        nickname,
      });
    } catch (error) {
      return res.render('deletedTeam');
    }
  };

  renderMyTeamListPage = async (req, res, next) => {
    const { id } = res.locals.user;

    try {
      const myTeamList = await this.teamService.findAllTeamByUserId(id);

      return res.render('myTeamList', {
        pageTitle: 'My Team List',
        myTeamList,
      });
    } catch (error) {
      return res.render('deletedTeam');
    }
  };

  getAllTeam = async (req, res, next) => {
    try {
      const allTeam = await this.teamService.findAllTeam();
      return res.render('allteam', {
        pageTitle: 'All Team',
        allTeam,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  postTeamMember = async (req, res, next) => {
    const { teamId } = req.params;
    const { nickname, position } = req.body;

    try {
      const userIdverifiedByNickname = await this.teamService.verifyNickname(
        nickname
      );
      if (!userIdverifiedByNickname) {
        const error = new NotFoundNickname();
        throw error;
      }

      const isAleadyMember =
        await this.teamService.findMemberIdByUserIdAndTeamId(
          userIdverifiedByNickname,
          teamId
        );
      if (isAleadyMember) {
        const error = new AlreadyMember();
        throw error;
      }

      const newMember = await this.teamService.addNewMember(
        position,
        userIdverifiedByNickname,
        teamId
      );
      return res.status(201).json(newMember);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateTeam = async (req, res, next) => {
    const { teamId } = req.params;
    const { status } = req.body;

    try {
      const updatedTeamStatus = await this.teamService.updateStatus(
        teamId,
        status
      );

      return res.status(200).json({ updatedTeamStatus });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteTeam = async (req, res, next) => {
    const { teamId } = req.params;

    try {
      await this.teamService.deleteTeam(teamId);

      return res.status(200).json({ message: '팀 삭제 성공!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateTeamMember = async (req, res, next) => {
    const { memberId } = req.params;
    const { position, task } = req.body;

    try {
      const updatedMember = await this.teamService.updateMember(
        memberId,
        position,
        task
      );

      return res.status(200).json({ updatedMember });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  deleteTeamMember = async (req, res, next) => {
    const { memberId } = req.params;
    try {
      const deletedMember = await this.teamService.deleteMember(memberId);

      return res.status(200).json({ deletedMember });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
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
