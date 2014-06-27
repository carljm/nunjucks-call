var call = require('./call.js');

module.exports = {
  CallBlockExtension: call.CallBlockExtension,

  init: function(nunjucksEnv) {
    nunjucksEnv.addExtension('call', new call.CallBlockExtension());
  }
};
