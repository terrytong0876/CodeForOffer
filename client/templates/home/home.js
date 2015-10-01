Template.home.events({
  'submit .shorten-url-form': function(event) {
    var longUrl = event.target.longUrl.value;

    var shortUrl = Meteor.call('longToShort', longUrl, function(err, shortUrl) {
      if (err) {
        // TODO: better way to handle error
        console.log(err.message);
      } else {
        FlashMessages.sendSuccess('Your url is shortened: ' + shortUrl);
      }
    });

    return false;
  }
});
