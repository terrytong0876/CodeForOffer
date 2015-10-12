Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  path: '/',
  name: '/',
  template: 'home',
  data: function() {
    templateData = {
      urls: Urls.find()
    };
    return templateData;
  }
});

Router.route('/:id', {
    path: '/:id',
    action: function() {
      // TODO: check host headers to make sure user is expecting a short url redirect
      var record = Urls.findOne({ _id: this.params.id });
      if (record) {
        console.log('redirect to: ' + record.longUrl);
        this.response.writeHead(301, { Location: record.longUrl });
        this.response.end();
      } else {
        this.next();
      }
    },
    where: 'server'
});