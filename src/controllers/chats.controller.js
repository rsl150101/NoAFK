const ChatService = require('../services/chats.service');
const TeamService = require('../services/teams.service');
const ProjectService = require('../services/projects.service');
const UserService = require('../services/users.service');

class ChatsController {
  chatService = new ChatService();
  teamService = new TeamService();
  projectService = new ProjectService();
  userService = new UserService();

  renderTeamChatPage = async (req, res, next) => {
    const { chatId } = req.params;
    console.log(typeof chatId);

    const memberList = await this.teamService.findAllByTeamId(chatId);
    const chattingList = await this.chatService.findAllMessagesByChatId(chatId);

    return res.render('chat', { memberList, chattingList });
  };

  renderPrivateChatPage = async (req, res, next) => {
    const { teamId, memberId } = req.params;
    const userId = 5; // req.cookies.userId 등 임시구현

    const myMemberInfo = await this.teamService.findMemberIdByUserIdAndTeamId(
      userId,
      teamId
    );
    const chatId = [myMemberInfo.id, memberId].sort((a, b) => a - b).join('$');

    const memberList = await this.teamService.findAllByTeamId(chatId);
    const chattingList = await this.chatService.findAllMessagesByChatId(chatId);

    return res.render('chat', { memberList, chattingList });
  };

  postTeamMessage = async (req, res, next) => {
    const { chatId } = req.params;
    const { userId, message } = req.body;

    const newTeamChatData = await this.chatService.addNewChat(
      chatId,
      userId,
      message
    );

    return res.status(201).json(newTeamChatData);
  };

  postPrivateMessage = async (req, res, next) => {
    const { teamId, memberId } = req.params;
    const { userId, message } = req.body;

    const myMemberInfo = await this.teamService.findMemberIdByUserIdAndTeamId(
      userId,
      teamId
    );
    const chatId = [myMemberInfo.id, memberId].sort((a, b) => a - b).join('$');

    const newPrivateChatData = await this.chatService.addNewChat(
      chatId,
      userId,
      message
    );

    return res.status(201).json(newPrivateChatData);
  };
}

module.exports = ChatsController;
