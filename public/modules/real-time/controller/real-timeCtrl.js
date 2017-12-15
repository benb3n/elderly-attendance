angular.module('RealTimeCtrl', [])
.controller('RealTimeController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $(document).ready(function() {
        // TABS
        $('ul.tabs').tabs();
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );
        $('select').material_select();
    });
    var vm = this;

}])