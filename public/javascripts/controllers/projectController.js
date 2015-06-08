(function() {
	angular.module("project.controller", ["project.service"])
	.controller("projectController", ProjectController);

	ProjectController.$inject = ["$state", "projectService"];
	function ProjectController($state, projectService) {
		var vm = this;
		projectService.getAllProjects().then(function(data) {
			vm.projects = data;
		});
		vm.navigateTo = function(projectId) {
			$state.go("projects.project", {id: projectId});
		};

		vm.addNewProject = function() {
			angular.element("#addNewProject").modal("show");
		}

		vm.addProject = function() {
			var newProject = {
				projectName: vm.newProjectName,
				projectUrl: vm.newProjectLogoUrl,
				projectDate: vm.newProjectYear,
				projectPartner: vm.newProjectPartner
			};
			projectService.saveNewProject(newProject).then(function(data) {
				vm.projects = data;
			});
		}
	};

})();