d2gApp.directive("d2gHeader", function () {
	return {
		restrict: "E",
		templateUrl: "directives/header/header.html",
		replace: true,
		scope: {},
		bindToController: true,
		controllerAs: "header",
		controller: function ($scope, loginService, $auth) {
			var vm = this;
			var loginSvc = loginService;

			$scope.$watch(loginSvc.getUser, function (user) {
				vm.user = user;
			})			

			vm.showLogin = function () {
				  loginSvc.showLoginModal();
			}

			vm.showRegister = function () {
				loginSvc.showRegisterModal();
			}

			vm.logout = function () {
				$auth.logout().then(function () {
					console.log("Logged out");
					loginSvc.user = null;
				})
			}

			vm.register = function () {
				loginSvc.register();
			}
		}
	}
});