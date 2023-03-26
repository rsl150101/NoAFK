const ChatService = require('../services/chats.service');
const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class ChatsController {
  chatService = new ChatService();
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  renderTeamChatPage = async (req, res) => {
    try {
      const { chatId } = req.params;

      const memberList = await this.teamService.findAllByTeamId(chatId);
      const chattingList = await this.chatService.findAllMessagesByChatId(
        chatId
      );

      return res.render('chat', { memberList, chattingList });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  renderPrivateChatPage = async (req, res) => {
    try {
      const { teamId, memberId } = req.params;
      const { id: userId } = res.locals.user;

      const myMemberInfo = await this.teamService.findMemberIdByUserIdAndTeamId(
        userId,
        teamId
      );
      const chatId = [teamId, myMemberInfo.id, memberId]
        .sort((a, b) => a - b)
        .join('$');

      const memberList = await this.teamService.findAllByTeamId(teamId);
      const chattingList = await this.chatService.findAllMessagesByChatId(
        chatId
      );

      return res.render('chat', { memberList, chattingList });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  postTeamMessage = async (req, res) => {
    try {
      const { chatId } = req.params;
      const { message } = req.body;

      if (!res.locals.user) {
        return res.redirect('/login');
      }

      const userId = res.locals.user.id;

      const newTeamChatData = await this.chatService.addNewChat(
        chatId,
        userId,
        message
      );

      return res.status(201).json(newTeamChatData);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };

  postPrivateMessage = async (req, res) => {
    try {
      const { teamId, memberId } = req.params;
      const { message } = req.body;

      if (!res.locals.user) {
        return res.redirect('/login');
      }

      const userId = res.locals.user.id;

      const myMemberInfo = await this.teamService.findMemberIdByUserIdAndTeamId(
        userId,
        teamId
      );
      const chatId = [myMemberInfo.id, memberId]
        .sort((a, b) => a - b)
        .join('$');

      const newPrivateChatData = await this.chatService.addNewChat(
        chatId,
        userId,
        message
      );

      return res.status(201).json(newPrivateChatData);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}

module.exports = ChatsController;
