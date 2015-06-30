module.exports = {
    data: function () {
        return {
            contacts: [{
                id: 0,
                firstname: 'Roger',
                surname: 'Descours',
                email: 'r.descours@gmail.com',
                phone: '04 75 48 74 75',
                selected: false
            }, {
                id: 1,
                firstname: 'Roger',
                surname: 'Descours',
                email: 'r.descours@gmail.com',
                phone: '04 75 48 74 75',
                selected: false,
            }, {
                id: 2,
                firstname: 'Roger',
                surname: 'Descours',
                email: 'r.descours@gmail.com',
                phone: '04 75 48 74 75',
                selected: false
            }]
        };
    },
    replace: true,
    template: require('./template.html'),
    components: {
        'contact-list': require('./contact-list')
    }
};
