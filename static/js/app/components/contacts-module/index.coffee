contact_store = require '../../models/contact_store.coffee'
_ = require('lodash')

module.exports =
  data: ->
    contacts: []
    new_contact: {firstname: null, surname: null, phone: null}
    contact_id: null

    #temporary
    tags: [{tag: 'Test'}, {tag: 'famille'}, {tag: 'Equipement sportif'}, {tag: 'bouffe'}, {tag: 'lorem'}, {tag: 'ipsum'}, {tag: 'sécurité'}, {tag: 'Europe'}, 
    {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}, {tag: 'big'}]
    notes: [
      {author: 'Guilleuahou', date: '16 juin 2015', hour: '17h29', content: 'Mdr mange mes couilles stp. lorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem
       ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem ipsumlorem
        ipsumlorem ipsum adazdazdddddddddddddddadad azdazdazd azdazdad adefzefqz ef rhtjytrhqegre yjherteyj reyztee yeyèih -èejhq-j hqhj qhzs-su yqztqsuyz tqysuqztys(eyq ztsuyqt )adazdadad adadad dazda dadsd qd azdsqd
         azdqs adazdazdadaz ddaazdaddad adazdazdadazd azdaddasd sdasdadasd adda&&d&d &d&d&z d&zdzdadaz dazdadad azdaadadasd qsdadqsd adqsdad qsdazdqs dazdqs dazdqsd azdqsd azdqsdaz dqsdazd qsdazd qsdazdasda zdad adsqd
          azdqsd azdqsd azd qsd azdqsd fqz ef rhtjytrhqegre yjherteyj reyztee yeyèih -èejhq-j hqhj qhzs-su yqztqsuyz tqysuqztys(eyq ztsuyqt )adazdadad adadad dazda dadsd qd azdsqd azdqs adazdazdadaz ddaazdaddad adazdazdadazd
           azdaddasd sdasdadasd adda&&d&d &d&d&z d&zdzdadaz dazdadad azdaadadasd qsdadqsd adqsdad qsdazdqs dazdqs dazdqsd azdqsd azdqsdaz dqsdazd qsdazd qsdazdasda zdad adsqd azdqsd azdqsd azd qsd azdqsd fqz ef rhtjytrhqegre
            yjherteyj reyztee yeyèih -èejhq-j hqhj qhzs-su yqztqsuyz tqysuqztys(eyq ztsuyqt )adazdadad adadad dazda dadsd qd azdsqd azdqs adazdazdadaz ddaazdaddad adazdazdadazd azdaddasd sdasdadasd adda&&d&d &d&d&z d&zdzdadaz
             dazdadad azdaadadasd qsdadqsd adqsdad qsdazdqs dazdqs dazdqsd azdqsd azdqsdaz dqsdazd qsdazd qsdazdasda zdad adsqd azdqsd azdqsd azd qsd azdqsd '}, 
      {author: 'Guy yeu ahou', date: '17 juin 2015', hour: '03h29', content: 'Ok inchallah'}, 
      {author: 'Nope', date: '6 juillet 2015', hour: '14h29', content: 'Invitez moi les gars eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
      eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee eeeeeeeeeeeeeeee eeeeeeeeeee eeeeeeeeeeee eeeeeeeeeee eeeeeeeeeeeeeeeeee
       pinpinnpin npin inhobui buibvy vyuvtf yi uo u ui b iv uib ub y vyi  u yi yi uo vyi u yi uo  fyiueeeee eeeeeeee '}
    ]
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
        contact = 0
        @contacts = _(res).forEach((n) ->
          n = _.assign n, {selected: false}
          contact++
        ).value()
        @nb_contact = contact
    createContact: (contact) ->
      contact_store.save contact, (res) => @fetchContacts()
    deleteContact: (contact) ->
      contact_store.delete contact, (res) => @fetchContacts()
    deleteMultiple: (contacts, i) ->
      if (contacts.$children[i])
        if (contacts.$children[i].selected)
          contact_store.delete contacts.$children[i], (res) => @fetchContacts()
        @deleteMultiple(contacts, i + 1)
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
    unfade: (note, i) ->
      if (i < note.length)
        curOverflow = note[i].style.overflow;
        if (!curOverflow || curOverflow == "visible")
          note[i].style.overflow = "hidden";
        isOverflowing = note[i].clientWidth < note[i].scrollWidth - 5 || note[i].clientHeight < note[i].scrollHeight - 5
        note[i].style.overflow = curOverflow;
        fade = note[i].getElementsByClassName("fade") if !isOverflowing
        fade[0].style.display = "none" if !isOverflowing
        @unfade(note, i + 1)
    manageOverflow: (i) ->
      note = document.querySelectorAll(".content")
      @unfade(note, 0)
    #temporary
    assignColor: (tag_array, i) ->
      if (i < tag_array.length)
        color = "a"
        color = Math.floor(Math.random() * 16777215).toString(16) while color.length != 6
        tag_array[i].style.background = "#" + color
        @assignColor(tag_array, i + 1)
    changeColor: () ->
      tag_array = document.querySelectorAll(".tag");
      @assignColor(tag_array, 0)
    #!temporary
    hideNotes: (note, i) ->
      if note.expanded
        if (i < note.$parent.$children.length)
          note.$parent.$children[i].$el.style.display = "none"
          @hideNotes(note, i + 1)
        note.$el.style.display = "block"
      else
        if (i < note.$parent.$children.length)
          note.$parent.$children[i].$el.style.display = "block"
          @hideNotes(note, i + 1)
    expandNote: (note) ->
      note.expanded = !note.expanded
      @hideNotes(note, 0)
      note.$parent.$el.children[2].style.overflow = "hidden" if note.expanded
      note.$parent.$el.children[2].style.overflow = "scroll" if !note.expanded
    expandTags: (tags) ->
      tags.expanded = !tags.expanded
      @$el.getElementsByTagName("contact-fiche")[0].className = "opacity" if tags.expanded
      @$el.getElementsByTagName("contact-fiche")[0].className = "" if !tags.expanded
    addTag: (addButton) ->
      addButton.addMode = !addButton.addMode
    displayProfile: (profile) ->
      profile.displaying_exchanges = false
    displayExchanges: (profile) ->
      profile.displaying_exchanges = true