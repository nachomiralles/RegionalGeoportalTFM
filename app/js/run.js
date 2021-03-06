(function () {
  'use strict'; 

  var pathRX = new RegExp(/\/[^\/]+$/);
  var locationPath = location.pathname.replace(pathRX, '');
  console.log(locationPath);
  require({
    async: true,
    aliases: [
      ['text', 'dojo/text']],
    packages: [{
      name: 'controllers',
      location: locationPath + '/js/controllers'
    },
    {
      name: 'services',
      location: locationPath + '/js/services'
    },
    {
      name: 'models',
      location: locationPath + '/js/models'
    },
    {
      name: 'widgets',
      location: locationPath + '/js/widgets'
    },
    {
      name: 'templates',
      location: locationPath + '/js/templates'
    },
    {
      name: 'utils',
      location: locationPath + '/js/utils'
    },
    {
      name: 'app',
      location: locationPath + '/js',
      main: 'mainLauncher'
    }]},
    ['app']);



})();
