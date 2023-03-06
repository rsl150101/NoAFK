const _ = require('lodash');

class ConvertCase {
  /**
   * 오브젝트의 키 중 카멜 케이스 키들을 스네이크 케이스로 변환한다.
   * @param {Object} obj 변환할 오브젝트
   * @returns {Object} 변환된 오브젝트
   */
  snakeToComel = (obj) => {
    const conversion = _.mapKeys(obj, (_value, key) => _.snakeCase(key));
    return conversion;
  };

  /**
   * 오브젝트의 키 중 스네이크 케이스 인 키들을 카멜 케이스로 변환한다.
   * @param {Object} obj 변환할 오브젝트
   * @returns {Object} 변환된 오브젝트
   */
  comelToSnake = (obj) => {
    const conversion = _.mapKeys(obj, (_value, key) => _.camelCase(key));
    return conversion;
  };
}

module.exports = ConvertCase;
