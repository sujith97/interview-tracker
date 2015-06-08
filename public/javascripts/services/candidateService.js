(function() {
	angular.module("candidate.service", [])
	.factory("candidateService", CandidateService);

	CandidateService.$inject = ["$http", "$rootScope"];
	function CandidateService($http, $rootScope) {
		var service = {
			getAllCandidates: allCandidates,
			saveNewCandidate: saveCandidate,
			saveNewMember: saveMember,
			removeMember: removeMember
		};
		return service;
		function allCandidates(projectId) {
			return $http.get($rootScope.constants.serverAddress + "/project/" + projectId + "/candidates").then(function(data) {
				return data.data;
			});
		};

		function saveCandidate(projectId, newCandidate) {
			return $http.post($rootScope.constants.serverAddress + "/project/" + projectId + "/candidate", newCandidate).then(function() {
				return allCandidates(projectId);
			});
		};

		function allMembers(projectId) {
			return $http.get($rootScope.constants.serverAddress + "/project/" + projectId + "/members").then(function(data) {
				return data.data;
			});
		};

		function saveMember(projectId, newMember) {
			return $http.post($rootScope.constants.serverAddress + "/project/" + projectId + "/member", newMember).then(function() {
				return allMembers(projectId);
			});
		};

		function removeMember(projectId, memberId) {
			return $http.delete($rootScope.constants.serverAddress + "/project/" + projectId + "/member/" + memberId).then(function() {
				return allMembers(projectId);
			});
		};

	};

})();