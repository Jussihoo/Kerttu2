(function() {

	'use strict';

	angular
    .module('kerttuApp')
		.component('facebookComponent', {
            templateUrl: 'modules/facebookComponent/facebookComponent.html',
            controller: facebookComponentController,
            controllerAs: 'vm'
        });
    
        // Manual Dependency injection
	   facebookComponentController.$inject = ['constants'];
    
        function facebookComponentController(constants) {
            var vm = this;
            vm.fbPageUrl = constants.FB_PAGE_URL;
            vm.fbAppId = constants.FB_APP_ID;
        }
        
}());