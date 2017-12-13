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

        template: _.template('<svg class="responsive-avatar__initials" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="background-color: <%- background %>">' + '<text x = "50" y = "<%- 50 + (+(fontSize/3).toFixed(3)) %>" text-anchor="middle" font-size="<%- fontSize %>" style="fill: <%- color %>">' + '<%- initials %>' + '</text>' + '</svg>' + '<div class="responsive-avatar__image js-responsive-avatar__image"' + '<% if (_picture) { %>' + 'style="background-image: url(<%- _picture %>);"' + '<% } %>' + '></div>'),
        ui: {
            avatarImage: '.js-responsive-avatar__image'
        },
        templateContext: function templateContext() {
            return {
                pictures: [this.model.get('picture') || '', this.model.get('fallbackPicture') || ''],
                background: this.model.get('background') || '#00495e',
                color: this.model.get('color') || 'white',
                fontSize: this.model.get('fontSize') || 36,
                initials: this.model.get('initials') || ''
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
        refreshAvatarFrom: function refreshAvatarFrom() {
            var _this = this;

            var pictures = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            this._actualPicture = this.constructor.ACTUAL_PICTURE_NOT_INITIALIZED;

            return this._findAvailableSourceIn(pictures).then(function (source) {
                _this._actualPicture = source;
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
                this.getUI('avatarImage').css('background-image', 'url(' + (this._actualPicture || '') + ')');
            }
        },


        /**
         * Checks all passed avatar sources to find one that can be loaded
         *
         * @returns {Promise.<string>} empty string if no avatar
         *
         * @private
         */
        _findAvailableSourceIn: function _findAvailableSourceIn(avatarsSources) {
            var _this2 = this;

            return avatarsSources.reduce(function (result, source) {
                return result.catch(function () {
                    return _this2._isPictureCanBeLoaded(source);
                });
            }, Promise.reject('')).catch(function () {
                return '';
            });
        },


        /**
         * Check is picture can be loaded
         *
         * @param {string} imgUrl
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