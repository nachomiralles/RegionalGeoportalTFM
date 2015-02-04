/* 
  Location where web application is started.
  The main.js file loads maps ooptions nad applcaition-elevl optiosn from a configurable file.
*/

/*global require*/	// Jshint option to indicate global objects
(function () {
  'use strict';	// Jshint configuration: place the function in strict mode

  require([
    "dojo/_base/lang", 
    "esri/request",                 // Loads resources from URL
    "esri/map",
    "services/mapservices",         // Loads loading features from services  
    "controllers/widgetcontroller", // Loads list of widgets
    'dojo/domReady!'				        // Loads modules once page is loaded
  ], function (lang, esriRequest, Map, mapServices, widgetController) {

    function onConfigSuccess(response) {
        // Creates map object with default map options
        var map = new Map("mapDiv", response.mapOptions);

        // When map loads, pass it to the options for widget loader
        map.on("load", function() {
          var options = lang.mixin({
            map: map}, 
            response);
                   
          // loads operational layers. 
          var layers =  mapServices.loadDefaultLayers(options.operationalLayers);
          map.addLayers(layers);

          var loader = new widgetController(options);
          loader.startup();
        });
    }

    function onConfigError (error) {
      console.log("ERROR - Loading config file:" + error);
    }


    function requestParam() {
      return {
        url: "config/config-rrs.json",
        handleAs: "json"
      };
    }

    console.debug('DEBUG - Starting application');
    esriRequest(requestParam()).then(onConfigSuccess, onConfigError);
  });
})();
