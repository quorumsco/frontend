module.exports =
    data: ->
        contacts: [
            id: 0
            firstname: 'Roger'
            surname: 'Descours'
            email: 'r.descours@gmail.com'
            phone: '04 75 48 74 75'
            selected: false
        ,
            id: 1
            firstname: 'Roger'
            surname: 'Descours'
            email: 'r.descours@gmail.com'
            phone: '04 75 48 74 75'
            selected: false
        ,
            id: 2
            firstname: 'Roger'
            surname: 'Descours'
            email: 'r.descours@gmail.com'
            phone: '04 75 48 74 75'
            selected: false
        ]
    replace: true
    template: require('./template.jade')()
    components:
        'contact-list': require './contact-list/index.coffee'
