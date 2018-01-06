angular.module('LoginCtrl', [])
.controller('LoginController', function ($scope, $location, $q, $http, LService) {
    document.getElementById("navbar").style.visibility = "hidden";
    document.getElementById("body_content").setAttribute('class', 'login');

    var vm = this;

    vm.login = login;
    
    //Director
    //vm.username = "benedict"
    //vm.password = "qwerty123456"
    //CM
    vm.username = "hxtest"
    vm.password = "qwerty123456"

    initController();
    function initController(){
        LService.logout();

        
    }

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
                    
                    localStorage.currentUserToken = 'Token ' + result.token;
                    localStorage.currentUser =  vm.username,
                    localStorage.currentCenterCode = 'gl15',
                    localStorage.currentRole = role;
       
                    //console.log(localStorage.currentUser + " , " + localStorage.currentUserToken + " , " + 
                    //localStorage.currentCenterCode + " , " + localStorage.currentRole)
                    
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