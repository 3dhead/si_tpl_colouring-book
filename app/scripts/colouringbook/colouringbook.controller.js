(function () {
  'use strict';

  angular
    .module('app.colouringbook')
    .controller('ColouringBookController', ColouringBookController);
  
  ColouringBookController.$inject = [
    '$q', '$scope',
    '$timeout', 'CONFIG',
    'preloaderService', 'trackGAEvents',
    'siActivityIndicator'
  ];
  
  /** @ngInject */
  function ColouringBookController(
    $q, $scope,
    $timeout, CONFIG,
    preloader, trackGAEvents,
    siAi
  ){
    var vm = this;
    vm.app = {
      ready: false,
      options: CONFIG.settings.colouringbook.options,
      colors: CONFIG.settings.colouringbook.colors
    };
    vm.app.options.color = vm.app.colors[0];

    // 'preload' object that holds
    // defs map and promises array.
    // ADD any promise to preload.promises
    // array that should be fulfilled while
    // preload is animating.
    var preload = {
      'defs': {}
    };

    preload.promises = [
      (preload.defs.images = $q.defer()).promise
    ];

    // Start SI ActivityIndicator;
    siAi.start();

    // Pass image list to preloadService
    // with 'preload.defs.images.resolve' as callback.
    preloader.bind(
      CONFIG.preload.images,
      {
        'complete': preload.defs.images.resolve
      }
    );
    
    // When all preload promises are resolved
    $q.all(preload.promises)
      .then(function() {
        // Tracking only load for GA 
        // in EA we dont track it as Origin
        // takes care of that
        trackGAEvents.record('[Load]');
        siAi.stop();
        // Do something else...
      });

    vm.undo = function(){
      vm.version--;
    };
    vm.clear = function(){
      vm.version = 0;
    };
  }
})();
