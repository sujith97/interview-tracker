(function() {

	angular.module("candidate.detail.controller", ["candidate.detail.service"])
	.controller("candidateDetailController", CandidateDetailCtrl);

	CandidateDetailCtrl.$inject = ["$stateParams", "candidateDetailService", "$timeout", "$state", "$scope", "$log"];
	function CandidateDetailCtrl($stateParams, candidateDetailService, $timeout, $state, $scope, $log) {
		var vm = this;
		vm.projectId = $stateParams.id;
		vm.candidateId = $stateParams.candidateId;
		vm.edit = true;

		$timeout(function() {
			angular.element("#interviewers").dropdown({
		    transition: 'drop'
		  });
		  angular.element("#interviewdate").datetimepicker({inline:true});
		}, 200);

		vm.members = capcoGlob.members;

		candidateDetailService.getCandidateData(vm.projectId, vm.candidateId).then(function(data) {
			initializeCandidate(data);
		});

		vm.saveCandidateChanges = function() {
			vm.candidate.candidateInterviews = vm.interviews;
			candidateDetailService.saveCandidate(vm.projectId, vm.candidateId, vm.candidate).then(function(data) {
				initializeCandidate(data);
			});
		}

		function initializeCandidate(data) {
			vm.edit = true;
			vm.candidate = data;
			vm.interviews = data.candidateInterviews;
			$timeout(function() {
			  angular.element('.feedback').accordion();
			}, 100);
		}

		vm.removeCandidate = function() {
			candidateDetailService.removeCandidate(vm.projectId, vm.candidateId).then(function() {
				$timeout(function() {
					$state.go("^");
				}, 1);
				
			});
		};
		
		vm.saveInterviewerFeedback = function(interviewerId) {
			candidateDetailService.updateInterviews(vm.projectId, vm.candidateId, interviewerId, vm.interviews, true).then(function() {
				angular.element('#feedback-modal').modal('show');
			});
		}

		vm.removeInterviewer = function(interviewerId, index) {
			vm.interviews.splice(index, 1);
			candidateDetailService.updateInterviews(vm.projectId, vm.candidateId, interviewerId, vm.interviews, false).then(function() {
				angular.element('#feedback-modal').modal('show');
			});
		}

		vm.addInterview = function() {
			var newInterview = {
				interviewerId: vm.interviewerId,
				interviewDate: new Date(vm.interviewDate),
				interviewerStatus: 'Active'
			};
			candidateDetailService.setupInterview(vm.projectId, vm.candidateId, newInterview).then(function(data) {
				vm.interviews = data;
			});
		};

	};

})();
