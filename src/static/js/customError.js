class emailExist extends Error {
  constructor(message) {
    super(message);
    this.name = 'emailExist';
    this.message = '이미 존재하는 이메일입니다.';
  }
}

class nicknameExist extends Error {
  constructor(message) {
    super(message);
    this.name = 'nicknameExist';
    this.message = '이미 존재하는 닉네임입니다.';
  }
}

module.exports = {
  emailExist,
  nicknameExist,
};
