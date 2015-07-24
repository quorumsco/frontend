module.exports =
  data: ->
  	expanded: false
  inherit: true
  replace: true
  template: require('./template.jade')()
  created: ->
  	@changeColor(0)
  components:
  	'tag-container': require './tag-container/index.coffee'