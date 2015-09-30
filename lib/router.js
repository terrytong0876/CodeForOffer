Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function() {
  this.route('home', {
    path: '/',
    template: 'home',
    data: function() {
      templateData = {
        urls: Urls.find()
      };
      return templateData;
    }
  });
});