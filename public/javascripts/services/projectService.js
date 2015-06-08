var projectsData = [
	{
		id: 1,
		projectName: "Pershing",
		projectUrl: "http://www.courfinancial.com/sites/default/files/users/ToddCour/pershing.jpg",
		projectDate: "2015",
		projectPartner: "Ranjit Palkar",
		members: [
			{
				memberId: "M1",
				memberName: "",
				memberEmail: ""
			}
		],
		candidates: [
			{
				id: "",
				candidateName: "Alice",
				candidateResume: "",
				status: "SELECTED",
				interviews: [
					{
						interviewerId: "M1",
						interviewDate: "",
						interviewerComments: "",
						interviewerStatus: "SELECTED"
					}
				]
			}

		]
	}
];

(function() {
	angular.module("project.service", [])
	.factory("projectService", ProjectService);

	ProjectService.$inject = ["$http", "$rootScope"];
	function ProjectService($http, $rootScope) {
		var service = {
			getAllProjects: allProjects,
			saveNewProject: saveProject
		};
		return service;
		function allProjects() {
			return $http.get($rootScope.constants.serverAddress + "/projects").then(function(data) {
				return data.data;
			});
		};

		function saveProject(newProject) {
			return $http.post($rootScope.constants.serverAddress + "/project", newProject).then(function() {
				return allProjects();
			});
		}
	};

})();