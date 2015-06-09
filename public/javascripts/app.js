(function() {
	angular.module("interviewTracker", ["ui.router", "project.controller", "candidate.controller", "candidate.detail.controller"])
	.config(function($stateProvider, $urlRouterProvider) {
	  
	  $stateProvider
	    .state('projects', {
	      url: '/projects',
	      templateUrl: '/javascripts/partials/projects.html',
	      controller: 'projectController',
	      controllerAs: 'projectCtrl'
	    })
	    .state('projects.project', {
	      url: '/project/:id',
	      templateUrl: '/javascripts/partials/project.html',
	      controller: 'candidateController',
	      controllerAs: 'candidateCtrl'
	    })
	    .state('projects.project.candidatedetail', {
	      url: '/candidate/:candidateId',
	      templateUrl: '/javascripts/partials/candidate-detail.html',
	      controller: 'candidateDetailController',
	      controllerAs: 'candidateDetCtrl'
	    });
	    $urlRouterProvider.otherwise('/projects');
	})
	.run(function($rootScope) {
		$rootScope.constants = {
			serverAddress : 'https://interviewtracker.herokuapp.com'
		}
	})
	.controller('appController', ['$scope', function($scope) {
		
		
	}])

})();

// https://interviewtracker.herokuapp.com
// http://localhost:3000