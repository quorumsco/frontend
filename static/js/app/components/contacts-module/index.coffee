contact_store = require '../../models/contact_store.coffee'

module.exports =
    data: ->
        contacts: []
        new_contact: {firstname: null, surname: null, phone: null}
        contact_id: null
    replace: true
    template: require('./template.jade')()
    created: ->
        @fetchContacts()
    components:
        'contact-list': require './contact-list/index.coffee'
    methods:
        fetchContacts: ->
            contact_store.find (res) =>
                @contacts = res
        createContact: (contact) ->
            contact_store.save contact, (res) => @fetchContacts()
        deleteContact: (contact) ->
            contact_store.delete contact, (res) => @fetchContacts()
