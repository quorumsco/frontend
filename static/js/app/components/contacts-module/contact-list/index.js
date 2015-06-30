module.exports = {
    inherit: true,
    replace: true,
    template: require('./template.html'),
    components: {
        'contact-item': require('./contact-item')
    }
};
