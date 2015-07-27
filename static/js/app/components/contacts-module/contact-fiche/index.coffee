module.exports =
  data: ->
    displaying_exchanges: false
    firstname: null
    surname: null
    phone: null
  inherit: true
  replace: true
  template: require('./template.jade')()
  attached: ->
    @manageOverflow(0)
  components:
    'contact-tag': require './contact-tag/index.coffee'
    'contact-notes-container': require './contact-notes/index.coffee'
    'contact-infos': require './contact-infos/index.coffee'
    'contact-exchange': require './contact-exchange/index.coffee'