const { User, Project, Chatting } = require('../models');

class ChatRepository {
  constructor(ChatModel) {
    this.chatModel = ChatModel;
  }

  findAllMessagesByChatId = async (chatId) => {
    try {
      return await this.chatModel.findAll({
        where: { room: chatId },
      });
    } catch (error) {
      throw error;
    }
  };

  createChatHistory = async (chatId, userId, message) => {
    try {
      await this.chatModel.create({
        room: chatId,
        userId,
        msg: message,
      });

      return { status: 201, message: '채팅 기록 추가 성공!' };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ChatRepository;
