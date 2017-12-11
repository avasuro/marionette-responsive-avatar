/**
 * In this two examples shown how to use your own model (here - UserModel) with avatar
 *
 * Our UserModel has properties:
 * image - image of the user
 * firstName - first name of the user
 * lastName - last name of the user
 */
const userModel = new Backbone.Model({
    image: 'http://vokrug.tv/pic/person/f/4/a/9/f4a9c7b9ce44e06ac21466d91cf1a6ce.jpeg',
    firstName: 'Emma',
    lastName: 'Watson'
});
const userModel_noAvatar = new Backbone.Model({
    image: '',
    firstName: 'Emma',
    lastName: 'Watson'
});

// Root view constructor:
var Root = Marionette.View.extend({
    el: document.getElementById('root'),
    template: function() {
        return '<div id="region-1"></div><div id="region-2"></div>';
    },
    regions: {
        'region-1': '#region-1',
        'region-2': '#region-2'
    },
    onRender: function() {
        /**
         * Example 1:
         * In this case we extend default settings of the avatar with our custom.
         */
        this.showChildView('region-1', new ResponsiveAvatar({
            model: userModel,
            templateContext: function() {
                var nativeContext = ResponsiveAvatar.prototype.templateContext.apply(this);
                nativeContext.pictures = [this.model.get('image')];
                nativeContext.initials = ResponsiveAvatar.capitalizeFirstAndLastName(this.model.get('firstName'), this.model.get('lastName'));
                return nativeContext;
            }
        }));
        /**
         * Example 2:
         * In this case we completely replace settings of the avatar with our custom
         */
        this.showChildView('region-2', new ResponsiveAvatar({
            model: userModel_noAvatar,
            templateContext() {
                return {
                    pictures: [this.model.get('image')],
                    background: 'darkred',
                    color: 'white',
                    fontSize: 45,
                    initials: ResponsiveAvatar.capitalizeFirstAndLastName(this.model.get('firstName'), this.model.get('lastName'))
                };
            }
        }));
    }
});


(new Root()).render();
