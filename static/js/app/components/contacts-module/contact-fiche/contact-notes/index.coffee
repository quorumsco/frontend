module.exports =
  data: ->
  	addMode: false
  	new_note: {author: null, date: null, content: null}
  inherit: true
  replace: true
  template: require('./template.jade')()
  components:
    'contact-notes': require './contact-notes/index.coffee'
    'contact-create-note': require './contact-create-notes/index.coffee'