// Collection of the avatars:
var avatars = [];
while (avatars.length < 1000) {
    avatars.push({
        initials: Math.ceil(Math.random()*9+10)
    });
}

// Collection of avatars:
var AvatarsCollection = new Backbone.Collection(avatars);

// Root view constructor:
var AvatarsCollectionView = Marionette.CollectionView.extend({
    childView: ResponsiveAvatar,
    className: 'avatars-collection'
});

// Render collection:
var mainRegion = new Marionette.Region({el: '#root'});
mainRegion.show(new AvatarsCollectionView({
    collection: AvatarsCollection
}));
