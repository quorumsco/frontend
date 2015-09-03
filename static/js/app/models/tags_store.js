var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  // api = 'http://api.quorumapps.com';
  api = 'http://localhost:8080';

store.find = function(id, cb) {
  return request
  .get(`${api}/contact/${id}/tags`)
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      return cb(res.body.data.contacts);
    }
  });
};

store.save = function(id, contact, cb) {
  return request
  .post(`${api}/contact/${id}/tags`)
  .set('Content-Type', 'application/json')
  .send({
    data: {
      tag: tag
    }
  })
  .end(function(err, res) {
    return cb(res);
  });
};

store.delete = function(id, tag, cb) {
  return request
  .del(`${api}/contacts/${id}/tags/${tag.id}`)
  .end(function(err, res) {
    return cb(res);
  });
};
