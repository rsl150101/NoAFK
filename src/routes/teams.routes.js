const express = require('express');
const TeamsController = require('../controllers/teams.controller');

const router = express.Router();
const teamsController = new TeamsController();

// teamId == projectId
// 팀 조회: 팀 이름, 팀 상태, 팀원 목록
router.get('/:teamId', teamsController.getTeam);

// 팀멤버 추가: 1.팀페이지 => position == 1, 2.모집페이지(팀합류신청) => position == 0
router.post('/:teamId', teamsController.postTeamMember);

// 팀 상태(status) 수정 (소프트삭제 기능 포함)
router.patch('/:teamId', teamsController.updateTeam);

// memberId(teamMemberId) == projectUserId
// 팀원 정보 수정: 1. 팀페이지 => task, position, 2. 모집페이지(팀신청수락) => position = 0 에서 1로 수정
router.patch('/:teamId/:memberId', teamsController.updateTeamMember);

// 팀원 삭제
router.delete('/:teamId/:memberId', teamsController.deleteTeamMember);

module.exports = router;
