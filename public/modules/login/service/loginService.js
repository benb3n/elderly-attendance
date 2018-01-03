angular.module('LoginService', [])

.factory('LService', function($http, starlightAPI, APIToken) {
    var service = {};
    service.login = login;
    service.getUserRole = getUserRole;


    return service;
    
    function login(params, callback){
        $http.post(starlightAPI.url + "/api-token-auth/", params)
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        )
        
    }

    function getUserRole( callback){
        $http.get(starlightAPI.url + "/api/v1/manifest_user/user_role/", )
        .then(
            function(result){ 
                callback(result.data) },
            function(){ callback(false) }
        );
    }

    

})
  
