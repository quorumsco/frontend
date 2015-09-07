var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  // api = 'http://api.quorumapps.com';
  api = 'http://localhost:8080';

//Test session, si oui ok si non on go sur login

store.me = function(cb, error, root) {
  request
  .get(`${api}/me`)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      error(root);
    } else if (res.body.status === 'success') {
      cb(res.body.data.user);
    }
  });
}

store.getSession = function(data, cb, error) {
  request
  .post(`${api}/session`)
  .withCredentials()
  .set('Accept', 'application/json')
  .type('form')
  .send(data)
  .end(function(err, res) {
    if (err) {
      //"tu ecris de la merde bro"
    } else if (res.body.status === 'success') {
      cb(res.body.data.session);
    }
  });
}