((factory) => {
    // Define as CommonJS export:
    if (typeof require === 'function' && typeof exports === 'object') {
        /* eslint-disable global-require */
        module.exports = factory(require('backbone.marionette'), require('underscore'));
        /* eslint-enable global-require */
    }
    // Define as AMD:
    else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
        define(['backbone.marionette', 'underscore'], factory); // eslint-disable-line no-undef
    }
    // Browser:
    else {
        window.ResponsiveAvatar = factory(window.Marionette, window._);
    }
})((Marionette, _) => {
    /**
     * Class of the responsive avatar
     */
    var ResponsiveAvatar = Marionette.View.extend({
        className: 'responsive-avatar',
        template: _.template(
            '<svg class="responsive-avatar__initials" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color: <%- background %>">' +
                '<text x = "50" y = "<%- 50 + (+(fontSize/3).toFixed(3)) %>" text-anchor="middle" font-size="<%- fontSize %>" style="fill: <%- color %>">' +
                    '<%- initials %>' +
                '</text>' +
            '</svg>' +
            '<div class="responsive-avatar__image"' +
                '<% if (picture) { %>' +
                    'style="background-image: url(<%- picture %>);"' +
                '<% } %>' +
            '></div>'
        ),
        templateContext() {
            return {
                picture: this.model.get('picture') || '',
                background: this.model.get('background') || '#00495e',
                color: this.model.get('color') || 'white',
                fontSize: this.model.get('fontSize') || 36,
                initials: this.model.get('initials') || ''
            }
        }
    });
    /**
     * Helper to capitalize first and last name of the user
     *
     * @param {string} first
     * @param {string} last
     *
     * @returns {string}
     */
    ResponsiveAvatar.capitalizeFirstAndLastName = function (first = '', last = '') {
        if (typeof first !== 'string') {
            throw new Error(`first name need to be type of "string", ${typeof first} given`);
        }
        if (typeof last !== 'string') {
            throw new Error(`last name need to be type of "string", "${typeof last}" given`);
        }
        return (first.charAt(0) + last.charAt(0)).toUpperCase();
    };

    return ResponsiveAvatar;
});
