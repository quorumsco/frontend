var Emitter = require('events').EventEmitter,
  search = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api,
  contact_store = require('./contact_store.js');

search.find = function(root, query, cb, filter) {
  query = query.trim();
  if (query.length == 0) {
    contact_store.find(root, cb);
  } else {
    request
    .post(`${api}/search`)
    .use(nocache)
    .withCredentials()
    .set('Content-Type', 'application/json')
  .send({
    data: {
      query: query,
      fields: filter
  }
  })
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
