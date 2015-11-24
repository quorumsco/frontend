var Emitter = require('events').EventEmitter,
  search = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api,
  contact_store = require('./contact_store.js');

search.find = function(root, query, cb) {
  query = query.trim();
  if (query.length == 0) {
    contact_store.find(cb);
  } else {
    request
    .get(`${api}/search/${query}`)
    .use(nocache)
    .withCredentials()
    .set('Accept', 'application/json')
    .end(function(err, res) {
      if (res.body.status === 'success') {
        cb(res.body.data.contacts);
      } else if (common.token(res)) {
        common.cb(root);
      } else {
        console.log("error");
      }
    });
  }
}
