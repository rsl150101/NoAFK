const { has } = require('lodash');
const { userInfo } = require('os');
const { Op } = require('sequelize');

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

  //* 회원 전체 조회
  getAllUserInfo = async () => {
    try {
      const users = await this.userModel.findAll({});

      return users;
    } catch (error) {
      error.status = 500;
      throw error;
    }
  };

  //* 회원 정보 조회
  userInfo = async (id) => {
    try {
      const userInfo = await this.userModel.findOne({
        where: { id },
        attributes: [
          'email',
          'nickname',
          'login_method',
          'test_result',
          'introduction',
          'image',
          'expired_at',
        ],
      });

      return userInfo;
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (passowrd)
  updateUserPassword = async (id, password) => {
    try {
      await this.userModel.update({ password }, { where: { id } });

      return { status: 201, message: '비밀번호가 수정되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (nickname)
  updateUserNickname = async (id, nickname) => {
    try {
      await this.userModel.update({ nickname }, { where: { id } });

      return { status: 201, message: '별명이 수정되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (introduction)
  updateUserIntroduction = async (id, introduction) => {
    try {
      await this.userModel.update({ introduction }, { where: { id } });

      return { status: 201, message: '자기소개가 수정되었습니다.' };
    } catch (error) {
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

  //* 검사결과 저장
  test = async (id, testResult) => {
    try {
      return await this.userModel.update({ testResult }, { where: { id } });
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
      throw error;
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
          console.log('🚀  file: users.repository.js:214  users:', users);

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

  // Todo <장빈> [레포지토리] 유저조회
  getSearchUser = async (sfl, stx) => {
    try {
      const isSearchField = sfl !== undefined;
      const isSFLEmail = sfl === 'user_email';
      const isSFLNickname = sfl === 'user_nickname';

      const baseSQL = {
        raw: true,
        attributes: [
          'email',
          'nickname',
          'testResult',
          'introduction',
          'image',
        ],
        order: [['id', 'ASC']],
      };

      if (isSearchField) {
        if (isSFLEmail) {
          baseSQL.where = { email: { [Op.like]: `%${stx}%` } };
        } else if (isSFLNickname) {
          baseSQL.where = { nickname: { [Op.like]: `%${stx}%` } };
        } else {
          baseSQL.where = { testResult: { [Op.like]: `%${stx}%` } };
        }
      }

      const users = await this.userModel.findAll(baseSQL);
      return users;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserRepository;
