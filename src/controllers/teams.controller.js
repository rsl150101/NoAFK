const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

const { NotFoundNickname, AlreadyMember } = require('../utility/customError');

class TeamsController {
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  renderTeamPage = async (req, res, next) => {
    try {
      if (!res.locals.user) {
        return res.redirect('/login');
      }

      const { teamId } = req.params;
      const { nickname } = res.locals.user;

      const memberList = await this.teamService.findAllByTeamId(teamId);
      const invitedUserList = await this.teamService.findInvitedUserByTeamId(
        teamId
      );

      if (memberList.length === 0) {
        return res.render('404', {
          pageTitle: 'No Team',
          pageContent: '팀이 존재하지 않습니다.',
        });
      }

      const { teamName, status } =
        await this.teamService.findTeamNameAndStatusByTeamId(teamId);

      return res.render('myteam', {
        pageTitle: 'My Team',
        teamName,
        nickname,
        memberList,
        invitedUserList,
        status,
      });
    } catch (error) {
      return res.render('404', {
        pageTitle: 'NoTeam',
        pageContent: '팀을 찾을 수 없습니다.',
      });
    }
  };

  renderMyTeamListPage = async (req, res, next) => {
    try {
      const { id } = res.locals.user;

      const myTeamList = await this.teamService.findAllTeamByUserId(id);
      const applyTeamList = await this.teamService.findApplyTeam(id);
      const hostTeamList = await this.teamService.findHostTeam(id);
      return res.render('myTeamList', {
        pageTitle: 'My Team List',
        myTeamList,
        applyTeamList,
        hostTeamList,
      });
    } catch (error) {
      return res.render('404', {
        pageTitle: 'NoTeam',
        pageContent: '팀을 찾을 수 없습니다.',
      });
    }
  };

  renderTeamsPage = async (req, res) => {
    try {
      const { cursor } = req.query;
      const { teams, nextCursor, existNextTeams } =
        await this.teamService.findAllTeam(cursor);

      return res.render('allteam', {
        pageTitle: 'All Team',
        teams,
        nextCursor,
        existNextTeams,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  getTeams = async (req, res) => {
    try {
      const { cursor } = req.query;
      const { teams, nextCursor, existNextTeams } =
        await this.teamService.findAllTeam(cursor);

      return res.status(200).json({
        teams,
        nextCursor,
        existNextTeams,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  postTeamMember = async (req, res, next) => {
    try {
      const { teamId } = req.params;
      const { nickname } = req.body;

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
      const invitedUser = await this.teamService.inviteNewUser(
        userIdverifiedByNickname,
        teamId
      );
      return res.status(201).json(invitedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateTeam = async (req, res, next) => {
    try {
      const { teamId } = req.params;
      const { status } = req.body;

      const updatedTeamStatus = await this.teamService.updateStatus(
        teamId,
        status
      );

      return res.status(200).json({ updatedTeamStatus });
    } catch (error) {
      if (error.name === 'AlreadyWorkPass') {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  };

  deleteTeam = async (req, res, next) => {
    try {
      const { teamId } = req.params;

      await this.teamService.deleteTeam(teamId);

      return res.status(200).json({ message: '팀 삭제 성공!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  updateTeamMember = async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const { position, task } = req.body;

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
    try {
      const { memberId } = req.params;

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
      if (error.name === 'AlreadyApply') {
        return res.status(403).json({ message: error.message });
      }
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

  // 공고 신청 취소
  cancelApply = async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      const cancelResult = await this.teamService.cancelApply(
        projectId,
        userId
      );

      return res.status(200).json(cancelResult);
    } catch (error) {
      res.status(400).json({ errorMessage: error.message });
    }
  };
}

module.exports = TeamsController;
