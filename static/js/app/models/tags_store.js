var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  api = 'http://api.quorumapps.com';
  // api = 'http://localhost:8080';

store.find = function(id, cb) {
  return request
  .get(`${api}/contacts/${id}/tags`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.tags);
    } else {
      console.log("error");
    }
  });
};

store.save = function(id, tag, cb) {
  return request
  .post(`${api}/contacts/${id}/tags`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      tag: tag
    }
  })
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res);
    } else {
      console.log("error");
    }
  });
};

store.delete = function(id, tag, cb) {
  return request
  .del(`${api}/contacts/${id}/tags/${tag.id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    cb(res);
  });
};
