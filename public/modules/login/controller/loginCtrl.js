angular.module('LoginCtrl', [])
.controller('LoginController', function ($scope, $location, $q, $http, LService) {
    document.getElementById("navbar").style.visibility = "hidden";
    document.getElementById("body_content").setAttribute('class', 'login');

    $(document).ready(function() {
           
    });

    var vm = this;

    vm.login = login;
    
    //Director
    //vm.username = "benedict"
    //vm.password = "qwerty123456"
    //CM
    vm.username = "hxtest"
    vm.password = "qwerty123456"

    function login() {
        vm.loading = true;
        
        //$location.path("/home");
        var params = {
            username: vm.username,
            password: vm.password
        }
        console.log(params)
        LService.login(params, function (result) {
            console.log(result)
            if (result.token) {
                $http.defaults.headers.common.Authorization = 'Token ' + result.token;
                LService.getUserRole(function (role) {
                    document.getElementById("body_content").setAttribute('class', '');
                    document.getElementById("navbar").style.visibility = "visible";

                    localStorage.setItem("user", {
                        user: vm.username,
                        token: result.token,
                        center_code_name: "gl15",
                        role: role
                    });

                    Materialize.toast('Login Successful', 3000, 'rounded green');
                    $location.path('/home');
                })
            } else {
                console.log("ERROR")
                document.getElementById('error').textContent = 'Invalid User Credentials';
                Materialize.toast('Invalid User Credentials', 3000, 'rounded red');
                vm.loading = false;
            }
        });
    }



    
})