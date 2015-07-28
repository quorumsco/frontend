module.exports =
  inherit: true
  replace: true
  template: require('./template.jade')()
  attached: ->
    @loadFiche(this)
