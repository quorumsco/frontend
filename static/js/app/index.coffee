module.exports =
    router: null
    el: 'app-module'
    components:
        'contacts-module': require './components/contacts-module/index.coffee'
    template: require('./template.jade')()
    data:
        view: null,
        router: null
    created: ->
        @router = require('page')

        contacts = =>
            @view = 'contacts-module'

        @router '/contacts', contacts
        @router '/', '/contacts'
        @router {hashbang: true}
    events:
        navigate: (path) ->
            this.router(path)
            return false
