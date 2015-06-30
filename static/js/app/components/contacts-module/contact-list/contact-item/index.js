module.exports = {
    inherit: true,
    replace: true,
    template: require('./template.html'),
    methods: {
        onClick: function (e) {
            e.preventDefault();
            this.selected = !this.selected;
        }
    }
};
