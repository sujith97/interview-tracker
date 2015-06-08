(function() {
	angular.module("candidate.detail.service", [])
	.factory("candidateDetailService", CandidateDetailService);

	CandidateDetailService.$inject = ["$http", "$rootScope"];
	function CandidateDetailService($http, $rootScope) {
		var service = {
			removeCandidate: deleteCandidate,
			setupInterview: saveInterview,
			getCandidateData: getCandidate,
			saveCandidate: saveCandidate,
			updateInterviews: updateInterviews
		};
		return service;

		function deleteCandidate(projectId, candidateId) {
			return $http.delete($rootScope.constants.serverAddress + "/project/" + projectId 
								+ "/candidate/" + candidateId).then(function(data) {
				return data;
			})
		};

		function saveInterview(projectId, candidateId, interviewContent) {
			return $http.post($rootScope.constants.serverAddress + "/project/" + projectId 
								+ "/candidate/" + candidateId + "/interview", interviewContent).then(function(data) {
				return data.data;
			})
		};

		function updateInterviews(projectId, candidateId, interviewerId, interviewContent, added) {
			return $http.put($rootScope.constants.serverAddress + "/project/" + projectId 
								+ "/candidate/" + candidateId + "/interviews/" + interviewerId + "/" + added, interviewContent).then(function(data) {
				return data.data;
			})
		};

		function getCandidate(projectId, candidateId) {
			return $http.get($rootScope.constants.serverAddress + "/project/" + projectId 
								+ "/candidate/" + candidateId).then(function(data) {
				return data.data;
			});
		};

		function saveCandidate(projectId, candidateId, candidate) {
			return $http.put($rootScope.constants.serverAddress + "/project/" + projectId + "/candidate/" + candidateId, candidate).then(function() {
				return getCandidate(projectId, candidateId);
			});
		};

	};

})();