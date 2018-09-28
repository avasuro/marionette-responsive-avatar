# marionette-responsive-avatar
Marionette component to render avatar or initials if no avatar provided

## How to install:

``` npm install marionette-responsive-avatar ```

### Browser:
```html
<script src="backbone.js" type="text/javascript"></script>
<script src="backbone.marionette.js" type="text/javascript"></script>
<script src="marionette-responsive-avatar.js" type="text/javascript"></script>
```

### Common JS:
```javascript
var ResponsiveAvatar = require('marionette-responsive-avatar');
```
### ES6:
```javascript
import ResponsiveAvatar from 'marionette-responsive-avatar';
```

## How to use

Responsive avatar can be used as any normal Marionette View. Some examples:

1. Using with model that have properties, expected by default (for more code see example "simple_use_case" in folder "examples"):
    ```javascript
    var SomeViewConstructor = Marionette.View.Extend({
        onRender: function() {
            this.showChildView('some_region', new ResponsiveAvatar({
                model: new Backbone.Model({
                    // Set picture of the avatar:
                    picture: 'http://vokrug.tv/pic/person/f/4/a/9/f4a9c7b9ce44e06ac21466d91cf1a6ce.jpeg',
                    // Set picture that will be used if main picture failed to load:
                    fallbackPicture: '',
                    // Set background color of the avatar:
                    background: '#00495e',
                    // Set font color of the avatar:
                    color: 'white',
                    // Set font size of the avatar:
                    fontSize: 36,
                    // Set initials to display if no picture assigned:
                    initials: 'EW',
                    // Set picture size to fill all avatar area:
                    pictureSize: ResponsiveAvatar.PICTURE_SIZE.FILL
                })
            }));
        }
    })
    ```
2. Using with model with custom properties. In this case we need to override "templateContext" of the ResponsiveAvatar view to work with custom model:
    (for more code see example "using_your_custom_model" in folder "examples")
    ```javascript
    // We have some our custom model:
    var myCustomModel = new Backbone.Model({
       image: 'some_image_url',
       firstName: 'Alex',
       lastName: 'Watson'
    });

    // Finally we can render the avatar:
    var SomeViewConstructor = Marionette.View.Extend({
        onRender: function() {
            this.showChildView('some_region', new ResponsiveAvatar({
                model: myCustomModel,
                templateContext() {
                     return {
                         pictures: this.model.get('image'),
                         background: 'darkred',
                         color: 'white',
                         fontSize: 45,
                         initials: ResponsiveAvatar.capitalizeFirstAndLastName(this.model.get('firstName'), this.model.get('lastName'))
                         pictureSize: ResponsiveAvatar.PICTURE_SIZE.FILL
                     };
                }
            }));
        }
    })
    ```
## Methods

* *refreshAvatarFrom* - refresh avatar from new list of URLs

// TODO: write more about this method and it's usage

## Helpers

There is static method of the ResponsiveAvatar class, named "capitalizeFirstAndLastName"
that can be used to get capitalized first letters of first and last name. There is example of usage:
```javascript
var firstName = 'walter';
var lastName = 'white';
var initials = ResponsiveAvatar.capitalizeFirstAndLastName(firstName, lastName);
console.log(initials); // Returns 'WW'
```