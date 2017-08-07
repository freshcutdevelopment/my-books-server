var Config = require('../config');
var auth = require('./auth.js');

module.exports = (function() {
  function getFindHash(req) {
    let userName = auth.getUserName(req);

    let findHash = { _id: req.params.book_id };

    if (Config.authEnabled) findHash["userName"] = userName;

    return findHash;
  }

  return {
    getFindHash: getFindHash
  };
})();
