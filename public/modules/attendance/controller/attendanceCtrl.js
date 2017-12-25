angular.module('AttendanceCtrl', [])
.controller('AttendanceController', ['$scope', '$routeParams', function ($scope, $routeParams) {
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

}])