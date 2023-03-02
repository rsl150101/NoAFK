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

class userNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'userNotFound';
    this.message = '유저가 존재하지 않습니다.';
  }
}

class incorrectPassword extends Error {
  constructor(message) {
    super(message);
    this.name = 'incorrectPassword';
    this.message = '비밀번호가 틀렸습니다.';
  }
}

module.exports = {
  emailExist,
  nicknameExist,
  userNotFound,
  incorrectPassword,
};
