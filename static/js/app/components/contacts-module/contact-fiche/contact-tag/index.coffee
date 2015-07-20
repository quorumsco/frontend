module.exports =
  inherit: true
  replace: true
  template: require('./template.jade')()
  components:
  	'tag-container': require './tag-container/index.coffee'