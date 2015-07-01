module.exports =
    inherit: true
    replace: true
    template: require('./template.jade')()
    components:
        'contact-item': require './contact-item/index.coffee'
