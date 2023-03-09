class EmailExist extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailExist';
    this.message = '이미 존재하는 이메일입니다.';
  }
}

class NicknameExist extends Error {
  constructor(message) {
    super(message);
    this.name = 'NicknameExist';
    this.message = '이미 존재하는 닉네임입니다.';
  }
}

class UserNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'UserNotFound';
    this.message = '유저가 존재하지 않습니다.';
  }
}

class IncorrectPassword extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncorrectPassword';
    this.message = '비밀번호가 틀렸습니다.';
  }
}

class AlreayLogin extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreayLogin';
    this.message = '이미 로그인되어 있습니다.';
  }
}

class AlreadyApply extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyApply';
    this.message = '이미 신청했습니다.';
  }
}

class RefreshTokenNotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'RefreshTokenNotFound';
    this.message = '저장된 RefreshToken 과 다릅니다.';
  }
}

class TokenExpired extends Error {
  constructor(message) {
    super(message);
    this.name = 'TokenExpired';
    this.message = '만료된 Token 입니다.';
  }
}

module.exports = {
  EmailExist,
  NicknameExist,
  UserNotFound,
  IncorrectPassword,
  AlreayLogin,
  AlreadyApply,
  RefreshTokenNotFound,
  TokenExpired,
};
