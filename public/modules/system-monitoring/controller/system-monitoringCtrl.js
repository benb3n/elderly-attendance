angular.module('SystemMonitoringCtrl', [])
.controller('SystemMonitoringController', ['$scope', '$routeParams', function ($scope, $routeParams) {
    $(document).ready(function() {
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
        $('.modal').modal({
     dismissible: true, // Modal can be dismissed by clicking outside of the modal
     opacity: .5, // Opacity of modal background
     inDuration: 300, // Transition in duration
     outDuration: 200, // Transition out duration
     startingTop: '4%', // Starting top style attribute
     endingTop: '10%', // Ending top style attribute
     ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

     },
     complete: function() {} // Callback for Modal close
   }
 );

    });
    var vm = this;
}])
