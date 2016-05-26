var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  common = require('./common.js'),
  api = common.api;

store.find = function(root, id, cb) {
  request
  .get(`${api}/contacts/${id}/formdatas`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.formdatas);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.first = function(root, id, cb) {
  request
  .get(`${api}/contacts/${id}/formdatas/${formdata_id}`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.formdata);
    } else if (common.token(res)) {
      common.cb(root);
    } else {
      console.log("error");
    }
  });
};

store.save = function(root, id, formdata, cb) {
  request
  .post(`${api}/contacts/${id}/formdatas`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      formdata: formdata
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

store.update = function(root, id, formdata, cb) {
  request
  .patch(`${api}/contacts/${id}/formdatas/${formdata.id}`)
  .use(nocache)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      formdata: formdata
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

store.delete = function(root, id, formdata_id, cb) {
  request
  .del(`${api}/contacts/${id}/formdatas/${formdata_id}`)
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
