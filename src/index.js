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
    const ResponsiveAvatar = Marionette.View.extend({
        ACTUAL_PICTURE_NOT_INITIALIZED: undefined,

        initialize() {
            /**
             * Contains picture URL that exists and loads from server or null if no picture can be loaded
             * Contains:
             *      ACTUAL_PICTURE_NOT_INITIALIZED - if picture never tried to load;
             *      null      - if no picture can be loaded;
             *      string    - url of picture that can be loaded;
             *
             * @type {string|null|ACTUAL_PICTURE_NOT_INITIALIZED}
             */
            this._actualPicture = this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED;

            /**
             * List of pictures that was in list at last render
             *
             * @type {Array}
             *
             * @private
             */
            this._lastRenderedPictures = [];
        },

        className: 'responsive-avatar',

        template: _.template(
            '<svg class="responsive-avatar__initials" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color: <%- background %>">' +
                '<text x = "50" y = "<%- 50 + (+(fontSize/3).toFixed(3)) %>" text-anchor="middle" font-size="<%- fontSize %>" style="fill: <%- color %>">' +
                    '<%- initials %>' +
                '</text>' +
            '</svg>' +
            '<div class="responsive-avatar__image js-responsive-avatar__image"' +
                '<% if (_picture) { %>' +
                    'style="background-image: url(<%- _picture %>);"' +
                '<% } %>' +
            '></div>'
        ),
        ui: {
            avatarImage: '.js-responsive-avatar__image'
        },
        templateContext() {
            return {
                pictures: [
                    this.model.get('picture') || '',
                    this.model.get('fallbackPicture') || ''
                ],
                background: this.model.get('background') || '#00495e',
                color: this.model.get('color') || 'white',
                fontSize: this.model.get('fontSize') || 36,
                initials: this.model.get('initials') || ''
            }
        },
        _renderHtml(template, data) {
            // Support old definition with "picture" property:
            if (data.picture) {
                // TODO: remove this after release stable version
                console.warn('"picture" property in template context is deprecated, use "pictures" property instead');

                // data.pictures takes precedence over data.picture:
                if (!data.pictures) {
                    data.pictures = [data.picture];
                    delete data.picture;
                }
            }

            const pictures = Array.isArray(data.pictures) ? data.pictures : [data.pictures];
            // If actual picture is not set, or new array of pictures provided - recheck sources:
            if (
                this._actualPicture === this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED ||
                !_.isEqual(pictures, this._lastRenderedPictures) ||
                (pictures.length && !pictures.includes(this._actualPicture))
            ) {
                this.refreshAvatarFrom(pictures);
            }

            data._picture = this._actualPicture || '';
            return Marionette.View.prototype._renderHtml.call(this, template, data);
        },

        /**
         * Refresh avatar from list of pictures
         *
         * @param {Array} pictures
         *
         * @returns {Promise.<void>}
         */
        refreshAvatarFrom(pictures = []) {
            this._actualPicture = this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED;

            return this._findAvailableSourceIn(pictures)
                .then(source => {
                    this._actualPicture = source;
                    this._updateAvatarSrc()
                });
        },

        /**
         * Update avatar image source
         *
         * @returns {void}
         *
         * @private
         */
        _updateAvatarSrc() {
            if (this.isRendered() && !this.isDestroyed()) {
                this.getUI('avatarImage').css('background-image', `url(${this._actualPicture || ''})`);
            }
        },

        /**
         * Checks all passed avatar sources to find one that can be loaded
         *
         * @returns {Promise.<string>} empty string if no avatar
         *
         * @private
         */
        _findAvailableSourceIn(avatarsSources) {
            return avatarsSources
                .reduce(
                    (result, source) => result.catch(
                        () => this._isPictureCanBeLoaded(source)
                    ),
                    Promise.reject('')
                )
                .catch(() => '');
        },

        /**
         * Check is picture can be loaded
         *
         * @param {string} imgUrl
         *
         * @private
         */
        _isPictureCanBeLoaded(imgUrl) {
            console.log(`checking url: ${imgUrl}`);
            return !imgUrl ? Promise.reject() : new Promise((resolve, reject) => {
                let img = new Image();
                img.onload = this._onImageLoadOrErr(img, resolve);
                img.onerror = this._onImageLoadOrErr(img, reject);
                img.src = imgUrl;
            });
        },

        /**
         * Returns handler when image load finished (failed or successful)
         *
         * @param {Image} img
         * @param {function} action
         *
         * @returns {function}
         *
         * @private
         */
        _onImageLoadOrErr(img, action) {
            return (e) => {
                img.onload = null;
                img.onerror = null;
                const toPass = e.type === 'load' ? img.src : new Error('Failed to load image');
                action(toPass);
                img.src = '';
            };
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