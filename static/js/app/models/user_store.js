var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  api = 'http://api.quorumapps.com';

//Test session, si oui ok si non on go sur login

store.me = function(cb) {
  request
  .get(`${api}/me`)
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      this.$root.navigate('app:login');
    } else if (res.body.status === 'success') {
      cb(res.body.data.user);
    }
  });
}

store.getSession = function(cb) {
  request
  .post(`${api}/session`)
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      //tu ecris de la merde bro
    } else if (res.body.status === 'success') {
      cb(res.body.data.session);
    }
  });
}