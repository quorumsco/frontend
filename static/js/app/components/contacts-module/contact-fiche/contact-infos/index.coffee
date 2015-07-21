module.exports =
  inherit: true
  replace: true
  template: require('./template.jade')()
  created: ->
    @loadFiche(this)
   	@manageOverflow(0)
