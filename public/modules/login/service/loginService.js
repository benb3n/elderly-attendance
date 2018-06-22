angular.module('LoginService', [])

.factory('LService', function($http, digitalOceanAPI, APIToken) {
    var service = {};
    service.login = login;
    service.logout = logout;
    service.getUserRole = getUserRole;
    service.getCenterAccessList = getCenterAccessList;

    return service;
    
    

    function login(params, callback){
        $http.post(digitalOceanAPI.url + "/api-token-auth/", params)
        .then(
            function(result){ 
                console.log(result)
                callback(result.data) },
            function(error){ 
                console.log(error)
                callback(false) }
        )
    }

    function logout(){
        localStorage.clear();
    }

    function getUserRole( callback){
        $http.get(digitalOceanAPI.url + "/api/v1/manifest_user/user_profile/", )
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        );
    }

    function getCenterAccessList(callback){
        $http.get(digitalOceanAPI.url + "/api/v1/manifest_center/center/access/", )
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        );

    }    

})
  
