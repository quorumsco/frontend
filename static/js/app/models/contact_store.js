var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  api = 'https://api.quorumapps.com';
  // api = 'http://localhost:8080';

store.find = function(cb) {
  request
  .get(`${api}/contacts`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.contacts);
    } else {
      console.log("error");
    }
  });
};

store.first = function(id, cb) {
  request
  .get(`${api}/contacts/${id}`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.contact);
    } else {
      console.log("error");
    }
  });
};

store.save = function(contact, cb) {
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
    } else {
      console.log("error");
    }
  });
};

store.update = function(contact, cb) {
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
    } else {
      console.log("error");
    }
  });
};

store.delete = function(id, cb) {
  request
  .del(`${api}/contacts/${id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    if (!err) {
      cb(res);
    } else {
      console.log("error");
    }
  });
};
