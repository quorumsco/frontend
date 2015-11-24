var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api;

//Test session, si oui ok si non on go sur login
store.me = function(cb, cbError, root) {
  console.log(api)
  request
  .get(`${api}/me`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      cbError(root);
    } else if (res.body.status === 'success') {
      cb(res.body.data.user, root);
    }
  });
}

store.getSession = function(data, cb, cbError, root) {
  request
  .post(`${api}/session`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .type('form')
  .send(data)
  .end(function(err, res) {
    if (err) {
      cbError(err);
    } else if (res.body.status === 'success') {
      cb(root);
    }
  });
}

store.delSession = function(app, cb) {
  request
  .post(`${api}/deleteSession`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    cb(app);
  });
}
