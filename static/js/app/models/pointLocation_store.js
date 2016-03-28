var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api;

store.find = function(root, id, cb) {
  console.log("store.find de pointLocation_store")
  request
  .get(`${api}/territories/${id}/polygon`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.polygon);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.first = function(root, id, cb) {
  request
  .get(`${api}/territories/${id}/polygon/${pointLocation_id}`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.pointLocation);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.save = function(root, id, note, cb) {
  request
  .post(`${api}/contacts/${id}/notes`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      note: note
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

store.update = function(root, id, note, cb) {
  request
  .patch(`${api}/contacts/${id}/notes/${note.id}`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      note: note
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

store.delete = function(root, id, note_id, cb) {
  request
  .del(`${api}/contacts/${id}/notes/${note_id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    if (err) {
      console.log(err);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};
