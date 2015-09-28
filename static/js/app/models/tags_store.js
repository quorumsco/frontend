var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  // api = 'http://api.quorumapps.com';
  api = 'http://localhost:8080';

store.find = function(id, cb) {
  return request
  .get(`${api}/contacts/${id}/tags`)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      console.log(err);
    } else if (res.body.status === 'success') {
      cb(res.body.data.tags);
    }
  });
};

store.save = function(id, tag, cb) {
  return request
  .post(`${api}/contacts/${id}/tags`)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      tag: tag
    }
  })
  .end(function(err, res) {
    if (err) {
      console.log(err);
    } else {
      cb(res);
    }
  });
};

store.delete = function(id, tag, cb) {
  return request
  .del(`${api}/contacts/${id}/tags/${tag.id}`)
  .withCredentials()
  .end(function(err, res) {
    cb(res);
  });
};
