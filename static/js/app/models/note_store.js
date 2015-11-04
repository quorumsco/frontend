var Emitter = require('events').EventEmitter,
  store = module.exports = new Emitter(),
  request = require('superagent'),
  nocache = require('superagent-no-cache'),
  // api = 'https://api.quorumapps.com';
  api = 'http://localhost:8080';

store.find = function(id, cb) {
  request
  .get(`${api}/contacts/${id}/notes`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.notes);
    } else {
      console.log("error");
    }
  });
};

store.first = function(id, cb) {
  request
  .get(`${api}/contacts/${id}/notes/${note_id}`)
  .use(nocache)
  .withCredentials()
  .set('Accept', 'application/json')
  .end(function(err, res) {
    if (res.body.status === 'success') {
      cb(res.body.data.note);
    } else {
      console.log("error");
    }
  });
};

store.save = function(id, note, cb) {
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
    } else {
      console.log("error");
    }
  });
};

store.update = function(id, note, cb) {
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
    } else {
      console.log("error");
    }
  });
};

store.delete = function(id, note_id, cb) {
  request
  .del(`${api}/contacts/${id}/notes/${note_id}`)
  .use(nocache)
  .withCredentials()
  .end(function(err, res) {
    if (err) {
      console.log(err);
    } else {
      cb(res);
    }
  });
};
