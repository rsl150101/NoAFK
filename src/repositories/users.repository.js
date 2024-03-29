const { has } = require('lodash');
const { userInfo } = require('os');
const { Op } = require('sequelize');
const { ProjectUser } = require('../models');

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
  blockUser = async (id) => {
    try {
      return await this.userModel.update(
        { authLevel: 2 }, //* 2 = 차단
        { where: { id } }
      );
    } catch (error) {
      throw error;
    }
  };

  //* 회원 차단 해제
  pardonUser = async (id) => {
    try {
      return await this.userModel.update({ authLevel: 0 }, { where: { id } });
    } catch (error) {
      throw error;
    }
  };

  //* 회원 삭제
  deleteUser = async (id) => {
    try {
      return await this.userModel.destroy({
        where: {
          id,
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

  // * 유저조회,백오피스-회원조회
  getSearchUser = async (start, perPage, pathUrl, sfl, stx) => {
    try {
      const isSelectField = sfl || false;
      const isSearchField = stx || false;
      const isSFLEmail = sfl === 'user_email';
      const isSFLNickname = sfl === 'user_nickname';

      const baseSQL = {
        raw: true,
        offset: start,
        limit: perPage,
        attributes: [
          'id',
          'email',
          'nickname',
          'testResult',
          'introduction',
          'image',
          'expiredAt',
          'authLevel',
          'privateEmail',
        ],
        order: [['id', 'ASC']],
      };

      if (isSelectField) {
        if (isSFLEmail) {
          if (pathUrl === '/members') {
            baseSQL.where = {
              email: { [Op.like]: `%${stx}%` },
              privateEmail: 1,
            };
          } else {
            baseSQL.where = { email: { [Op.like]: `%${stx}%` } };
          }
        } else if (isSFLNickname) {
          baseSQL.where = { nickname: { [Op.like]: `%${stx}%` } };
        } else {
          if (!stx) {
            baseSQL;
          } else {
            baseSQL.where = { testResult: { [Op.like]: `%${stx}%` } };
          }
        }
      } else if (isSearchField) {
        baseSQL.where = {
          [Op.or]: [
            { email: { [Op.like]: `%${stx}%` } },
            { nickname: { [Op.like]: `%${stx}%` } },
            { testResult: { [Op.like]: `%${stx}%` } },
          ],
        };
      }

      const users = await this.userModel.findAndCountAll(baseSQL);
      return users;
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (image)
  updateUserImage = async (id, image) => {
    try {
      await this.userModel.update({ image }, { where: { id } });

      return { status: 201, message: '프로필사진이 수정되었습니다.' };
    } catch (error) {
      throw error;
    }
  };

  //* 마이페이지 유저정보 렌더링
  loginUserInfo = async (id) => {
    try {
      const loginUserInfo = await this.userModel.findOne({
        where: { id },
        attributes: [
          'id',
          'email',
          'nickname',
          'loginMethod',
          'testResult',
          'introduction',
          'image',
          'expiredAt',
          'privateEmail',
        ],
      });

      return loginUserInfo;
    } catch (error) {
      throw error;
    }
  };

  //* 회원 정보 수정 (privateEmail)
  updateUserPrivateEmail = async (id, privateEmail) => {
    try {
      await this.userModel.update({ privateEmail }, { where: { id } });

      return { status: 201, message: '비밀번호가 수정되었습니다.' };
    } catch (error) {
      throw error;
    }
  };
}

module.exports = UserRepository;
