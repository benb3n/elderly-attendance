angular.module('LoginCtrl', [])
.controller('LoginController', ['$scope', '$routeParams', function ($scope, $routeParams, $location) {
    document.getElementById("navbar").style.visibility = "hidden";
    document.getElementById("body_content").setAttribute('class', 'login');

    $(document).ready(function() {
           
    });

    var vm = this;
    vm.test = "HELLO WORLD"
    vm.login = login;

    function login() {
        console.log("TESTTING")
        vm.loading = true;
        document.getElementById("body_content").setAttribute('class', '');
        $location.path('/home');
        /*loginService.Login(loginSelf.username, loginSelf.password, function (result) {
            if (result === true) {
                $location.path('/campaigns-report');
            } else {
                vm.error = 'Username or password is incorrect';
                loginSelf.loading = false;
            }
        });*/
    }

}])