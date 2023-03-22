const TeamRepository = require('../repositories/teams.repository');
const ProjectRepository = require('../repositories/projects.repository');
const UserRepository = require('../repositories/users.repository');
const ChatRepository = require('../repositories/chats.repository');

const { Project, ProjectUser, User, Chatting } = require('../models');

class ChatService {
  chatRepository = new ChatRepository(Chatting);
  teamRepository = new TeamRepository(ProjectUser);
  projectRepository = new ProjectRepository(Project);
  userRepository = new UserRepository(User);

  findAllMessagesByChatId = async (chatId) => {
    try {
      return await this.chatRepository.findAllMessagesByChatId(chatId);
    } catch (error) {
      throw error;
    }
  };

  addNewChat = async (chatId, userId, message) => {
    try {
      return await this.chatRepository.createChatHistory(
        chatId,
        userId,
        message
      );
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ChatService;
