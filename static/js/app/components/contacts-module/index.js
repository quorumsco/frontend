module.exports = {
    data: function () {
        return {};
    },
    replace: true,
    ready: function () {
        var circles = require('circles');
        circles.create({
            id:           'circles-1',
            radius:       12,
            value:        30,
            maxValue:     100,
            width:        3,
            colors:       ['#FFF2D8', '#FEBF3C'],
            duration:     0,
            wrpClass:     'circles-wrp',
            styleWrapper: false,
            styleText: false,
            text: null
        });
        circles.create({
            id:           'circles-2',
            radius:       12,
            value:        85,
            maxValue:     100,
            width:        3,
            colors:       ['#E3FCF5', '#72EFCB'],
            duration:     0,
            wrpClass:     'circles-wrp',
            styleWrapper: false,
            styleText: false,
            text: null
        });
    },
    template: require('./template.html')
};
