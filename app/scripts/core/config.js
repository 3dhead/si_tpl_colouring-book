(function () {
  'use strict';

  /** @ngInject */
  angular
    .module('app.core')
    .run(initAnalytics)
    .config(configure);

  initAnalytics.$inject = [
    'Angularytics', 'CONFIG',
    '$location', 'OriginAPI'
  ];

  /** @ngInject */
  function initAnalytics(
    Angularytics, CONFIG,
    $location, OriginAPI
  ){
    // Override AdId if found
    var adId = $location.search().adId;

    // Init GA
    ga('create', CONFIG.analytics.ga.id);
    Angularytics.init();

    // Init EA
    if((typeof CONFIG.analytics.ea) !== 'undefined' &&
        (CONFIG.analytics.ea !== null)){

      // Init Origin API
      OriginAPI.init({
        adId : adId ? adId : CONFIG.analytics.ea.id,
        placement : CONFIG.analytics.ea.placement
      });
    }
  }

  configure.$inject = [
    '$stateProvider', '$urlRouterProvider', 
    'AngularyticsProvider', '$provide'
  ];

  /** @ngInject */
  function configure(
    $stateProvider, $urlRouterProvider, 
    AngularyticsProvider, $provide
  ){
    AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);

    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise('/');

    // Now set up the states
    $stateProvider

      .state('colouringbook', {
        url: '/',
        templateUrl: 'scripts/colouringbook/colouringbook.html',
        controller: 'ColouringBookController',
        controllerAs: 'colorbook'
      });

    $provide.constant('CONFIG', {

      // Set here your analytics data
      'analytics': {

        // Google Analytics
        // Don't change the id, we are always tracking internally
        // to Integration Marketing Account
        // Change the category according to the name of
        // your project
        'ga' : {
          'id': 'UA-12310597-137',
          'category':'[Default] ‘Project ID’ ‘Division’ ‘Name of Ad’ ‘Product’'
        },

        // Evolve Analytics
        // For now... we can only track events sent
        // from iframes living inside origin
        // Set the id of the origin product you created
        // For placement, use overthepage for overlays,
        // or inpage
        // In case you don't need EA (standalone) set it to null
        // 'ea' :  null
        'ea': {
         'id' : 190,
         'placement' : 'overthepage'
        }
      },

      'preload': {
        'images': [
          'assets/images/angular.png'
        ]
      },

      'settings': {
        'colouringbook': {
          'options': {
            'width': 320,
            'height': 300,
            'backgroundColor': '#fff',
            'color': '#000',
            'lineWidth': 1, 
            'opacity': 0.9,
            'undo': true, 
            'undoEnabled': true, 
            'imageSrc': 'assets/images/draw.png',
            'customCanvasId': 'mainbook' 
          },
          'colors': [
            '#000', 
            '#9CB199', 
            '#CF3759', 
            '#485247', 
            '#E77547', 
            '#D38E47', 
            '#0A6A74', 
            '#153974'
          ]
        }
      }

    });
  }

})();
