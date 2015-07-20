contact_store = require '../../models/contact_store.coffee'
_ = require('lodash')

module.exports =
  data: ->
    contacts: []
    new_contact: {firstname: null, surname: null, phone: null}
    contact_id: null
    #temporary
    tags: [{tag: 'Test'}, {tag: 'famille'}, {tag: 'famille'}, {tag: 'bouffe'},{tag: 'lorem'},{tag: 'ipsum'},{tag: 'sécurité'},{tag: 'Europe'}]
    contact_fiche: [firstname: null, surname: null, phone: null]
    #!temporary
    fiche: false
    nb_contact: 0
  replace: true
  template: require('./template.jade')()
  created: ->
    @fetchContacts()
  components:
    'contact-list': require './contact-list/index.coffee'
    'contact-fiche': require './contact-fiche/index.coffee'
  methods:
    fetchContacts: ->
      contact_store.find (res) =>
        i = 0
        @contacts = _(res).forEach((n) ->
          n = _.assign n, {selected: false}
          i++
        ).value()
        @nb_contact = i
    createContact: (contact) ->
      contact_store.save contact, (res) => @fetchContacts()
    deleteContact: (contact) ->
      contact_store.delete contact, (res) => @fetchContacts()
    deleteMultiple: (contacts) ->
      i = 0
      while (contacts.$children[i])
        if (contacts.$children[i].selected)
          contact_store.delete contacts.$children[i], (res) => @fetchContacts()
        i++
    loadFiche: (fiche) ->
      fiche.firstname = @contact_fiche[0].firstname
      fiche.surname = @contact_fiche[0].surname
      fiche.phone = @contact_fiche[0].phone
    showFiche: (contact) ->
      @contact_fiche[0].firstname = contact.firstname if contact?
      @contact_fiche[0].surname = contact.surname if contact?
      @contact_fiche[0].phone = contact.phone if contact?
      @fiche = !@fiche

