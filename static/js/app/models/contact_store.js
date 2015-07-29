var Emitter = require('events').EventEmitter,
store = module.exports = new Emitter(),
request = require('superagent'),
api = 'http://localhost:8080';

store.find = function(cb) {
  return request
  .get(api + '/contacts')
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      return cb(res.body.data.contacts);
    }
  });
};

store.save = function(contact, cb) {
  return request
  .post(api + '/contacts')
  .set('Content-Type', 'application/json')
  .send({
    data: {
      contact: contact
    }
  })
  .end(function(err, res) {
    return cb(res);
  });
};

store["delete"] = function(contact, cb) {
  return request
  .del(api + '/contacts/' + contact.id)
  .end(function(err, res) {
    return cb(res);
  });
};
