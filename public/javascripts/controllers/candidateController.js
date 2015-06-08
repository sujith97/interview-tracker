var capcoGlob = {
	members: {}
};

(function() {
	angular.module("candidate.controller", ["candidate.service"])
	.controller("candidateController", CandidateController);

	CandidateController.$inject = ["$stateParams", "candidateService", "$state"];
	function CandidateController($stateParams, candidateService, $state) {
		var vm = this;
		vm.projectId = $stateParams.id;

		vm.refreshCandidates = refresh;

		refresh();

		function refresh() {
			candidateService.getAllCandidates(vm.projectId).then(function(data) {
				vm.candidates = data.projectCandidates;
				vm.members = data.projectMembers;
				angular.forEach(vm.members, function(value) {
				  capcoGlob.members[value._id] = value;
				});

			});
		}

		vm.navigateTo = function(candidateId) {
			$state.go("projects.project.candidatedetail", {candidateId: candidateId});
		};

		vm.addNewCandidate = function() {
			angular.element("#addCandidate").modal("show");
		};

		vm.addMember = function() {
			var newMember = {
				memberName: vm.newMemberName,
				memberEmail: vm.newMemberEmail
			};
			candidateService.saveNewMember(vm.projectId, newMember).then(function(data) {
				vm.members = data.projectMembers;
			});
		};

		vm.removeMember = function(memberId) {
			candidateService.removeMember(vm.projectId, memberId).then(function(data) {
				vm.members = data.projectMembers;
			});
		};

		vm.addCandidate = function() {
			var newCandidate = {
				candidateName: vm.newCandidateName,
				candidateResume: vm.newCandidateResumeUrl,
				candidateDescription: vm.newCandidateDescription,
				candidateStatus: "Active"
			};
			candidateService.saveNewCandidate(vm.projectId, newCandidate).then(function(data) {
				vm.candidates = data.projectCandidates;
				vm.members = data.projectMembers;
			});
		}
	};

})();