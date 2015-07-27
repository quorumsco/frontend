Emitter = require('events').EventEmitter
store = module.exports = new Emitter()

request = require('superagent')
api = 'http://localhost:8080'

store.find = (id, cb) ->
  request
    .get api + '/contact/' + id + '/tags/'
    .set 'Accept', 'application/json'
    .end (err, res) ->
      if res.body.status == 'success'
        cb(res.body.data.contacts)

store.save = (id, contact, cb) ->
  request
    .post api + '/contact/' + id + '/tags'
    .set 'Content-Type', 'application/json'
    .send {data: {tag: tag}}
    .end (err, res) ->
      cb(res)

store.delete = (id, tag, cb) ->
  request
    .del api + '/contacts/' + id + '/tags/' + tag.id
    .end (err, res) ->
      cb(res)
