'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (factory) {
    // Define as CommonJS export:
    if (typeof require === 'function' && (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
        /* eslint-disable global-require */
        module.exports = factory(require('backbone.marionette'), require('underscore'));
        /* eslint-enable global-require */
    }
    // Define as AMD:
    else if (typeof define === 'function' && define.amd) {
            // eslint-disable-line no-undef
            define(['backbone.marionette', 'underscore'], factory); // eslint-disable-line no-undef
        }
        // Browser:
        else {
                window.ResponsiveAvatar = factory(window.Marionette, window._);
            }
})(function (Marionette, _) {
    /**
     * Class of the responsive avatar
     */
    var ResponsiveAvatar = Marionette.View.extend({
        initialize: function initialize() {
            /**
             * Contains picture URL that exists and loads from server or null if no picture
             * can be loaded
             *
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

        template: function template(data) {
            var xmlns = 'http://www.w3.org/2000/svg';

            var avatarInitialsBox = document.createElementNS(xmlns, 'svg');
            avatarInitialsBox.setAttributeNS(null, 'viewBox', '0 0 100 100');
            avatarInitialsBox.setAttribute('class', 'responsive-avatar__initials');
            avatarInitialsBox.style.backgroundColor = data.background;

            var avatarInitials = document.createElementNS(xmlns, 'text');
            avatarInitials.setAttributeNS(null, 'x', 50);
            avatarInitials.setAttributeNS(null, 'y', 50 + +(data.fontSize / 3).toFixed(3));
            avatarInitials.setAttributeNS(null, 'text-anchor', 'middle');
            avatarInitials.setAttributeNS(null, 'font-size', data.fontSize);
            avatarInitials.style.fill = data.color;
            avatarInitials.appendChild(document.createTextNode(data.initials));

            avatarInitialsBox.appendChild(avatarInitials);

            var avatarImage = document.createElement('div');
            avatarImage.setAttribute('class', ['responsive-avatar__image', 'js-responsive-avatar__image', 'responsive-avatar__image--size-' + data.pictureSize, 'responsive-avatar__image--layout-' + data.pictureLayout].join(' '));
            if (data._picture) {
                avatarImage.style.backgroundImage = 'url(' + data._picture + ')';
            }

            var result = document.createDocumentFragment();
            result.appendChild(avatarInitialsBox);
            result.appendChild(avatarImage);
            return result;
        },


        ui: {
            avatarImage: '.js-responsive-avatar__image'
        },

        templateContext: function templateContext() {
            return {
                pictures: [this.model.get('picture') || '', this.model.get('fallbackPicture') || ''],
                background: this.model.get('background') || '#00495e',
                color: this.model.get('color') || 'white',
                fontSize: this.model.get('fontSize') || 36,
                initials: this.model.get('initials') || '',
                pictureSize: this.model.get('pictureSize') || this.constructor.PICTURE_SIZE.FILL,
                pictureLayout: this.model.get('pictureLayout') || this.constructor.PICTURE_LAYOUT.COVER
            };
        },
        _renderHtml: function _renderHtml(template, data) {
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

            var pictures = Array.isArray(data.pictures) ? data.pictures : [data.pictures];
            // If actual picture is not set, or new array of pictures provided - recheck sources:
            if (this._actualPicture === this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED || !_.isEqual(pictures, this._lastRenderedPictures) || pictures.length && !pictures.includes(this._actualPicture)) {
                this.refreshAvatarFrom(pictures);
            }

            data._picture = this._actualPicture;
            return Marionette.View.prototype._renderHtml.call(this, template, data);
        },


        /**
        * Attaches the content of a given view.
         * This method is overridden to optimize rendering
        *
        * @param {HTMLElement|DocumentFragment} html
        *
        * @returns {ResponsiveAvatar}
        */
        attachElContent: function attachElContent(html) {
            this.$el.empty();
            this.el.appendChild(html);
            return this;
        },


        /**
         * Refresh avatar from list of pictures
         *
         * @param {Array} pictures
         *
         * @returns {Promise.<void>}
         */
        refreshAvatarFrom: function refreshAvatarFrom() {
            var _this = this;

            var pictures = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this._actualPicture = this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED;

            return this._findAvailableSourceIn(pictures).then(function (source) {
                _this._actualPicture = source || null;
                _this._updateAvatarSrc();
            });
        },


        /**
         * Update avatar image source
         *
         * @returns {void}
         *
         * @private
         */
        _updateAvatarSrc: function _updateAvatarSrc() {
            if (this.isRendered() && !this.isDestroyed()) {
                this.getUI('avatarImage').css('background-image', this._actualPicture ? 'url(' + this._actualPicture + ')' : '');
            }
        },


        /**
         * Checks all passed avatar sources to find one that can be loaded
         *
         * @param {array} avatarsSources
         *
         * @returns {Promise.<string>} empty string if no avatar
         *
         * @private
         */
        _findAvailableSourceIn: function _findAvailableSourceIn(avatarsSources) {
            var _this2 = this;

            var startSearch = null;
            var initialPromise = new Promise(function (resolve, reject) {
                startSearch = reject;
            });

            var searchProcess = avatarsSources.reduce(function (result, source) {
                return result.catch(function () {
                    return _this2._isPictureCanBeLoaded(source);
                });
            }, initialPromise).catch(function () {
                return '';
            });

            startSearch();
            return searchProcess;
        },


        /**
         * Check is picture can be loaded
         *
         * @param {string} imgUrl
         *
         * @returns {void}
         *
         * @private
         */
        _isPictureCanBeLoaded: function _isPictureCanBeLoaded(imgUrl) {
            var _this3 = this;

            return !imgUrl ? Promise.reject() : new Promise(function (resolve, reject) {
                var img = new Image();
                img.onload = _this3._onImageLoadOrErr(img, resolve);
                img.onerror = _this3._onImageLoadOrErr(img, reject);
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
        _onImageLoadOrErr: function _onImageLoadOrErr(img, action) {
            return function (e) {
                img.onload = null;
                img.onerror = null;
                var toPass = e.type === 'load' ? img.src : new Error('Failed to load image');
                action(toPass);
                img.src = '';
            };
        }
    }, {
        ACTUAL_PICTURE_NOT_INITIALIZED: undefined,
        PICTURE_LAYOUT: {
            COVER: 'cover',
            CONTAIN: 'contain'
        },
        PICTURE_SIZE: {
            // Make image on full size of avatar area:
            FILL: 'fill',
            // Fit image into avatar area (counting rounded corners, so no image part
            // will be outside of the avatar)
            FIT: 'fit'
        },

        /**
         * Helper to capitalize first and last name of the user
         *
         * @param {string} first
         * @param {string} last
         *
         * @returns {string}
         */
        capitalizeFirstAndLastName: function capitalizeFirstAndLastName() {
            var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var last = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

            if (typeof first !== 'string') {
                throw new Error('first name need to be type of "string", ' + (typeof first === 'undefined' ? 'undefined' : _typeof(first)) + ' given');
            }
            if (typeof last !== 'string') {
                throw new Error('last name need to be type of "string", "' + (typeof last === 'undefined' ? 'undefined' : _typeof(last)) + '" given');
            }
            return (first.charAt(0) + last.charAt(0)).toUpperCase();
        }
    });

    return ResponsiveAvatar;
});