// Root view constructor:
var Root = Marionette.View.extend({
    el: document.getElementById('root'),
    template: function() {
        return '<div id="region-1"></div><div id="region-2"></div><div id="region-3"></div><div id="region-4"></div>';
    },
    regions: {
        'region-1': '#region-1',
        'region-2': '#region-2',
        'region-3': '#region-3',
        'region-4': '#region-4'
    },
    onRender: function() {
        // Render simple avatar with picture that fills area fully:
        this.showChildView('region-1', new ResponsiveAvatar({
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
                pictureSize: ResponsiveAvatar.PICTURE_SIZE.FILL,
                // Set picture to fully cover avatar canvas:
                pictureLayout: ResponsiveAvatar.PICTURE_LAYOUT.COVER
            })
        }));
        // Render simple avatar with picture that is fit into avatar region:
        this.showChildView('region-2', new ResponsiveAvatar({
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
                // Set picture size to fit avatar area:
                pictureSize: ResponsiveAvatar.PICTURE_SIZE.FIT,
                // Set picture to fully cover avatar canvas:
                pictureLayout: ResponsiveAvatar.PICTURE_LAYOUT.COVER
            })
        }));
        // Render simple avatar without picture:
        this.showChildView('region-3', new ResponsiveAvatar({
            model: new Backbone.Model({
                // Set picture of the avatar:
                picture: '',
                // Set background color of the avatar:
                background: '#00495e',
                // Set font color of the avatar:
                color: 'white',
                // Set font size of the avatar:
                fontSize: 36,
                // Set initials to display if no picture assigned:
                initials: 'EW',
                // Set picture size to fill all avatar area:
                pictureSize: ResponsiveAvatar.PICTURE_SIZE.FILL,
                // Set picture to fully cover avatar canvas:
                pictureLayout: ResponsiveAvatar.PICTURE_LAYOUT.COVER
            })
        }));
        // Render simple avatar with picture that is fit into avatar region + fit into avatar canvas:
        this.showChildView('region-4', new ResponsiveAvatar({
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
                // Set picture size to fit avatar area:
                pictureSize: ResponsiveAvatar.PICTURE_SIZE.FIT,
                // Set picture to be fit into avatar canvas:
                pictureLayout: ResponsiveAvatar.PICTURE_LAYOUT.CONTAIN
            })
        }));
    }
});


(new Root()).render();
