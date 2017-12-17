angular.module('AttendanceCtrl', [])
.controller('AttendanceController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $(document).ready(function() {
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );

    });

    var vm = this;

}])