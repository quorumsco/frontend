module.exports =
  inherit: true
  replace: true
  template: require('./template.jade')()
  components:
    'contact-notes': require './contact-notes/index.coffee'