contact_store = require '../../models/contact_store.coffee'
_ = require('lodash')

module.exports =
  data: ->
    contacts: []
    new_contact: {firstname: null, surname: null, phone: null}
    contact_id: null

    #temporary
    tags: [{tag: 'Test'}, {tag: 'famille'}, {tag: 'Equipement sportif'}, {tag: 'bouffe'}, {tag: 'lorem'}, {tag: 'ipsum'}, {tag: 'sécurité'}, {tag: 'Europe'}]
    notes: [{author: 'Guilleuahou', date: '16 juin 2015', hour: '17h29', content: 'Mdr mange mes couilles stp. lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsum'}, {author: 'Guy yeu ahou', date: '17 juin 2015', hour: '03h29', content: 'Ok inchallah'}, {author: 'Nope', date: '6 juillet 2015', hour: '14h29', content: 'Invitez moi les gars'}, {author: 'Nope', date: '6 juillet 2015', hour: '14h29', content: 'Invitez moi les gars'}]
    contact_fiche: [firstname: null, surname: null, phone: null]
    #!temporary

    displaying_profile: false
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
      
      #temporary
      @contact_fiche[0].firstname = contact.firstname if contact?
      @contact_fiche[0].surname = contact.surname if contact?
      @contact_fiche[0].phone = contact.phone if contact?
      #temporary
      
      @displaying_profile = !@displaying_profile

    #temporary
    changeColor: (i) ->
      tag_array = document.querySelectorAll(".tag");
      if ((tag_array == null || tag_array.length == 0) && i < 10)
        timeoutID = window.setTimeout(@changeColor, 100, i + 1);
      else if (tag_array != null && tag_array.length != 0)
        i = 0
        while (i < tag_array.length)
          tag_array[i].style.background = "#" + Math.floor(Math.random() * 16777215).toString(16)
          i++
        window.clearTimeout(timeoutID)
    #!temporary