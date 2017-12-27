angular.module('AttendanceCtrl', [])
.controller('AttendanceController', ['$scope', '$routeParams', function ($scope, $q, $timeout, AService) {
    var vm = this;
    vm.api = {
        project: 'mp',
        all_device_count: 1000,
        latest_sensor_reading_count: 1000
    }


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

    initController();
    function initController(){
        vm.data = {};

        generateDataForInit();
    }

    function generateDataForInit(){
        $scope.names = [
            {
              "id": "1",
              "name": "Alexander Hamilton",
              "email": "ahamil@example.com",
              "phone": "5555555555",
              "status": "APPLIED",
              "created": "2016-07-07 09:16:32",
              "unix": "1467640600000"
            },
        ];
    }

    /******************
        WEB SERVICE 
    ******************/
    function getAllDevices (project_prefix, page_size) { //url, _defer, overall
        var _defer = $q.defer();
        AService.getAllDevices(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        
        return _defer.promise;
    }
}])