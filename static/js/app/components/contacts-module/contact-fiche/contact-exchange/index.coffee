module.exports =
  data: ->
  	expanded: false
  	addMode: false
  inherit: true
  replace: true
  template: require('./template.jade')()
  attached: ->
  	@changeColor(0)
  components:
  	'tag-container': require './tag-container/index.coffee'