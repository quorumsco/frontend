Emitter = require('events').EventEmitter
store = module.exports = new Emitter()

request = require('superagent')
api = 'http://localhost:8080'

store.find = (cb) ->
  console.log(api + '/contacts')
  request
    .get api + '/contacts'
    .set 'Accept', 'application/json'
    .end (err, res) ->
      if res.body.status == 'success'
        cb(res.body.data.contacts)

store.save = (contact, cb) ->
  console.log({data: {contact: contact}})
  request
    .post api + '/contacts'
    .set 'Content-Type', 'application/json'
    .send {data: {contact: contact}}
    .end (err, res) ->
      cb(res)

store.delete = (contact, cb) ->
  request
    .del api + '/contacts/' + contact.id
    .end (err, res) ->
      cb(res)
