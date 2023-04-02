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

class BlackUser extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlackUser';
    this.message = '차단된 계정입니다.';
  }
}

class NotFoundNickname extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundNickname';
    this.message = '닉네임을 찾을 수 없습니다.';
  }
}

class AlreadyMember extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyMember';
    this.message = '이미 등록된 팀원입니다.';
  }
}

class AlreadyDeadLine extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyDeadLine';
    this.message = '이미 모집 마감된 프로젝트입니다.';
  }
}

class AlreadyWorkPass extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyWorkPass';
    this.message = '이미 작업이 끝난 단계입니다.';
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
  BlackUser,
  NotFoundNickname,
  AlreadyMember,
  AlreadyDeadLine,
  AlreadyWorkPass,
};
