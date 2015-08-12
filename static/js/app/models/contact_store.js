var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  api = 'http://localhost:8080';

store.find = function(cb) {
  request
  .get(`${api}/contacts`)
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')());
    } else if (res.body.status === 'success') {
      cb(res.body.data.contacts);
    }
  });
};

store.first = function(id, cb) {
  request
  .get(`${api}/contacts/${id}`)
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')(id));
    } else if (res.body.status === 'success') {
      cb(res.body.data.contact);
    }
  });
};

store.save = function(contact, cb) {
  request
  .post(`${api}/contacts`)
  .set('Content-Type', 'application/json')
  .send({
    data: {
      contact: contact
    }
  })
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')());
    } else if (res.body.status === 'success') {
      cb(res);
    } else {
      cb(require('../fixtures/contacts.js')());
    }
  });
};

store.delete = function(contact, cb) {
  request
  .del(`${api}/contacts/${contact.id}`)
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')(contact.id));
    } else if (res.body.status === 'success') {
      cb(res);
    }
  });
};
