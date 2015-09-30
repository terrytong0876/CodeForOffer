Meteor.methods({
  'longToShort': function(longUrl) {
    if (!Counters.find({ _id: 'main' }).count()) {
      Counters.insert({
        _id: 'main',
        seq: 0
      });
    }

    // TODO: deal with racing clients
    var curSeq = Counters.findOne({ _id: 'main' }).seq;
    Counters.update({ _id: 'main' }, {$inc: { seq: 1 }});

    var shortUrl = curSeq;  // TODO: replace with a function generating better shortUrl string based on curSeq

    Urls.insert({
      longUrl: longUrl,
      shortUrl: shortUrl,
      createdAt: new Date()
    });

    return shortUrl;
  }  // 'longToShort'
});