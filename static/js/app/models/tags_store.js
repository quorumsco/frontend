var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api;

store.find = function(root, id, cb) {
  return request
  .get(`${api}/contacts/${id}/tags`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.tags);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.save = function(root, id, tag, cb) {
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
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.delete = function(root, id, tag, cb) {
  return request
  .del(`${api}/contacts/${id}/tags/${tag.id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    if (common.token(res)) {
      common.cb(root);
    } else {
      cb(res);
    }
  });
};
