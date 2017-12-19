angular.module('RealTimeCtrl', [])
.controller('RealTimeController', function ($scope, $q, RTService) { 
    var vm = this;

    $(document).ready(function() {
        // TABS
        $('ul.tabs').tabs();
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            });

        $('select').material_select();
    });

    // Watchers
    $scope.$watch(function() {
        return vm.selectedCenter;
    },function(newCenter, oldCenter) {
        if(newCenter != oldCenter) {
            
        }
    });

    
    
    initController();
    function initController(){
        vm.centers = [
            {name:"6901", value:6901},
            {name:"6902", value:6902},
            {name:"6903", value:6903}
        ]
    
        vm.elderly_present = [
            {name: "John Tan Wei Jie" , image:"https://gravatar.com/avatar/961997eb7fd5c22b3e12fb3c8ca14e11?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png"},
            {name: "Amos Tan Wei Jie" , image:"https://gravatar.com/avatar/961997eb7fd5c22b3e12fb3c8ca14e11?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png"},
            {name: "Nam Hyunsuk" , image:"https://gravatar.com/avatar/961997eb7fd5c22b3e12fb3c8ca14e11?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png"},
            {name: "Jane Ng as as" , image:"https://gravatar.com/avatar/961997eb7fd5c22b3e12fb3c8ca14e11?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png"},
            {name: "P5" , image:"https://gravatar.com/avatar/961997eb7fd5c22b3e12fb3c8ca14e11?s=80&d=https://codepen.io/assets/avatars/user-avatar-80x80-bdcd44a3bfb9a5fd01eb8b86f9e033fa1a9897c3a15b33adfc2649a002dab1b6.png"}
        ]

        generateDataForInit ();
    }

    function generateDataForInit () {
        $q.when()
        .then(function(){
            return getSensorReadings(6901);
        })
        .then(function(result){
            console.log(result)
        })
        
    }
    
    function getSensorReadings (gw_device) {
        var _defer = $q.defer();
        RTService.getSensorReadings(gw_device, function (result) {
            if (result) {
                _defer.resolve(result);
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

})