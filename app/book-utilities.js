var Config = require('../config');
var auth = require('./auth.js');

module.exports = (function() {
  function getFindHash(req) {
   

    let findHash = { _id: req.params.book_id };

    if (Config.authEnabled) {
      let userName = auth.getUser(req).name;
      findHash["userName"] = userName;
    }
    return findHash;
  }

  return {
    getFindHash: getFindHash
  };
})();
