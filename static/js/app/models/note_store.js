var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  // api = 'http://api.quorumapps.com';
  api = 'http://localhost:8080';
store.find = function(id, cb) {
  request
  .get(`${api}/contacts/${id}/notes`)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')());
    } else if (res.body.status === 'success') {
      cb(res.body.data.notes);
    }
  });
};

store.first = function(id, cb) {
  request
  .get(`${api}/contacts/${id}/notes/${note_id}`)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')(id));
    } else if (res.body.status === 'success') {
      cb(res.body.data.note);
    }
  });
};

store.save = function(id, note, cb) {
  request
  .post(`${api}/contacts/${id}/notes`)
  .withCredentials()
  .set('Content-Type', 'application/json')
  .send({
    data: {
      note: note
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

store.update = function(id, note, cb) {
  request
  .post(`${api}/contacts/${id}/notes`)
  .withCredentials()
  .set('Content-Type', 'application/json-patch')
  .send({
    data: {
      note: note
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

store.delete = function(id, note_id, cb) {
  request
  .del(`${api}/contacts/${id}/notes/${note_id}`)
  .withCredentials()
  .end(function(err, res) {
    if (err) {
      cb(require('../fixtures/contacts.js')(contact.id));
    } else if (res.body.status === 'success') {
      cb(res);
    }
  });
};
