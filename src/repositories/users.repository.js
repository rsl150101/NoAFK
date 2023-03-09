const { userInfo } = require('os');

class UserRepository {
  constructor(UserModel) {
    this.userModel = UserModel;
  }

  findByEmail = async (email) => {
    try {
      return await this.userModel.findAll({
        where: { email },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findByNickname = async (nickname) => {
    try {
      return await this.userModel.findAll({
        where: { nickname },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findIdByNickname = async (nickname) => {
    try {
      return await this.userModel.findOne({
        attributes: ['id'],
        where: { nickname },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  findNicknameById = async (id) => {
    try {
      return await this.userModel.findOne({
        attributes: ['nickname'],
        where: { id },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  createUser = async (userInfo) => {
    try {
      await this.userModel.create({
        ...userInfo,
      });

      return { status: 200, message: '회원가입에 성공하였습니다.' };
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  getAllUserInfo = async () => {
    try {
      const users = await this.userModel.findAll({});

      return users;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 회원 차단
  blockUser = async (userId) => {
    try {
      return await this.userModel.update(
        { auth_level: 2 }, //* 2 = 차단
        { where: { id: userId } }
      );
    } catch (error) {
      throw error;
    }
  };

  //* 회원 삭제
  deleteUser = async (userId) => {
    try {
      return await this.userModel.destroy({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  // 유저아이디로 회원 정보 조회
  findUserInfoByUserId = async (userId) => {
    try {
      return await this.userModel.findAll({
        where: { id: userId },
      });
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  // refreshToken 저장
  refreshToken = async (id, refreshToken) => {
    try {
      await this.userModel.update(
        { refreshToken },
        {
          where: { id },
        }
      );
    } catch (error) {
      error.status = 500;
    }
  };

  //Todo <장빈> [임시] 회원관리 페이지 페이지네이션
  getUsers = async (start, perPage, sfl, stx) => {
    try {
      const isSearchField = sfl !== undefined;
      const isSFLEmail = sfl === 'user_email';

      if (isSearchField) {
        if (isSFLEmail) {
          const users = await this.userModel.findAndCountAll({
            raw: true,
            offset: start,
            limit: perPage,
            where: {
              email: {
                [Op.like]: `%${stx}%`,
              },
            },
          });

          return users;
        }

        const users = await this.userModel.findAndCountAll({
          raw: true,
          offset: start,
          limit: perPage,
          where: {
            nickname: {
              [Op.like]: `%${stx}%`,
            },
          },
        });

        return users;
      } else {
        const users = await this.userModel.findAndCountAll({
          raw: true,
          offset: start,
          limit: perPage,
        });

        return users;
      }
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserRepository;
