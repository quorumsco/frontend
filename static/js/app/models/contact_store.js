var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api;

store.find = function(root, cb) {
  request
  .get(`${api}/contacts`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.contacts);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.first = function(root, id, cb) {
  request
  .get(`${api}/contacts/${id}`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.contact);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.save = function(root, contact, cb) {
  request
  .post(`${api}/contacts`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      contact: contact
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

store.update = function(root, contact, cb) {
  request
  .patch(`${api}/contacts/${contact.id}`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      contact: contact
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

store.delete = function(root, id, cb) {
  request
  .del(`${api}/contacts/${id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    if (!err) {
      cb(res);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};
