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
            
            vm.loadFBPlugin = function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (window.FB) {
                  return;
                }
                js = d.createElement(s); js.id = id;
                js.src = 'https://connect.facebook.net/fi_FI/sdk.js#xfbml=1&version=v3.2&appId={{ vm.fbAppId }}';
                fjs.parentNode.insertBefore(js, fjs);
            };
            
            vm.loadFBPlugin(document, 'script', 'facebook-jssdk');
            
            angular.element(document).ready(function () {
                if (window.FB) {
                    window.FB.XFBML.parse();
                }
            });
        }
        
}());