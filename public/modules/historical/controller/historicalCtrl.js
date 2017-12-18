angular.module('HistoricalCtrl', [])
.controller('HistoricalController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $(document).ready(function() {
        $('ul.tabs').tabs();
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });
    });

    var vm = this;
    vm.data = [
        {
            key: "Cumulative Return",
            values: [
                {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
        }
      ];
    vm.line_data = [
{
key:"workload",
values:[
[1, 5],
[2, 5],
[3, 5],
[4, 5],
[5, 7],
[6, 6],
[7, 0],
],
},{
key:"check speed",
values:[
[1, 3],
[2, 5],
[3, 2],
[4, 15],
[5, 9],
[6, 13],
[7, 3],
],
}
]
}])
