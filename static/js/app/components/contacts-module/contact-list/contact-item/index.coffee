module.exports =
  inherit: true
  replace: true
  template: require('./template.jade')()
  methods:
    onClick: (e) ->
      e.preventDefault()
      @selected = !@selected
      console.log(@.id)
