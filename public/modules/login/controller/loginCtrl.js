angular.module('LoginCtrl', [])
.controller('LoginController', function ($scope, $location, $q, $http, $timeout, $rootScope, LService) {
    document.getElementById("navbar").style.visibility = "hidden";
    document.getElementById("body_content").setAttribute('class', 'login');

    $(document).ready(function() {
        Materialize.updateTextFields();
    });
    
    var vm = this;
    vm.login = login;

    //Director
    //vm.username = "benedict"
    //vm.password = "qwerty123456"
    //CM
    vm.username = "benedict"
    vm.password = "qwerty123456"

    initController();
    function initController(){
        $timeout(function () {
            Materialize.updateTextFields();
        })
        LService.logout();

    }

    function login() {
        vm.loading = true;

        //$location.path("/home");
        var params = {
            username: vm.username,
            password: vm.password
        }

        LService.login(params, function (result) {
            if (result.token) {
                $http.defaults.headers.common.Authorization = 'Token ' + result.token;
                LService.getUserRole(function (role) {
                    if(role){
                        LService.getCenterAccessList(function(center_access_list){
                            var output = new Array();

                            center_access_list.results.forEach(function(value, indrx){
                                var project = {project_prefix: value.project_prefix, code_name: value.code_name}
                                var existing = output.filter(function(v, i) {
                                    return v.project_prefix == project.project_prefix;
                                  });
                                  if (existing.length) {
                                    var existingIndex = output.indexOf(existing[0]);
                                    output[existingIndex].value = output[existingIndex].value.concat(project.code_name);
                                  } else {
                                    if (typeof project.code_name == 'string')
                                      project.code_name = [project.code_name];
                                    output.push(project);
                                  }
                            })

                            document.getElementById("body_content").setAttribute('class', '');
                            document.getElementById("navbar").style.visibility = "visible";
                            localStorage.currentUserToken = 'Token ' + result.token;
                            localStorage.currentUser =  vm.username,
                            localStorage.currentCenterCode = 'SMU',
                            localStorage.currentRole = role;
                            localStorage["projectprefix"] = JSON.stringify(output);

                            //console.log(role)
                            //console.log(localStorage.currentUser + " , " + localStorage.currentUserToken + " , " +
                            //localStorage.currentCenterCode + " , " + localStorage.currentRole)

                            Materialize.toast('Welcome back ' + vm.username + '!!', 3000, 'rounded green');
                            $location.path('/home');
                        })
                    }
                    
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
