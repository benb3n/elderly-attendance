angular.module('HistoricalCtrl', [])
.controller('HistoricalController', function ($scope, $q, HService) {
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

  /*************** 
      WATCHERS
  ****************/
  $scope.$watch(function() {
    return vm.selectedCenter;
  },function(newCenter, oldCenter) {
    if(newCenter != oldCenter) {
      
    }
  });

  $scope.$watch(function() {
    return vm.selectedStartDate;
  },function(newStartDate, oldStartDate) {
    if(newStartDate != oldStartDate) {
    }
  });

  $scope.$watch(function() {
    return vm.selectedEndDate;
  },function(newEndDate, oldEndate) {
    if(newEndDate != oldEndate) {
    }
  });
  

  initController();
  function initController(){
    vm.centers = [
      {name:"6901", value:6901},
      {name:"6902", value:6902},
      {name:"6903", value:6903}
    ]

    $q.when()
      .then(function(){
          return getSensorReadings(6901, '2017-10-18T10:00:00', '2017-11-18T10:00:00');
      })
      .then(function(result){
          console.log(result)
      })      
  }

  /******************** 
      WEB SERVICES
  *********************/
  function getSensorReadings (gw_device, start_date, end_date) {
    var _defer = $q.defer();
    HService.getSensorReadings(gw_device, start_date, end_date, function (result) {
      if (result) {
        _defer.resolve(result);
      } else {
        _defer.reject();
      }
    });
    return _defer.promise;
  }

    vm.data = [
        {
            key: "Cumulative Return",
            values: [
                {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
        }
      ]; //end data
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
            ]
      },
      {
            key:"check speed",
            values:[
              [1, 3],
              [2, 5],
              [3, 2],
              [4, 15],
              [5, 9],
              [6, 13],
              [7, 3],
              ]
      }
    ]; //end line_data

  vm.calendarheatmapdata = [
    {
      "date": "2016-01-01",
      "total": 17164,
      "details": [{
        "name": "Project 1",
        "date": "2016-01-01 12:30:45",
        "value": 9192
      }, {
        "name": "Project 2",
        "date": "2016-01-01 13:37:00",
        "value": 6753
      },
      {
        "name": "Project N",
        "date": "2016-01-01 17:52:41",
        "value": 1219
      }]
  },{
    "date": "2017-01-01",
    "total": 17164,
    "details": [{
      "name": "Project 1",
      "date": "2017-01-01 12:30:45",
      "value": 9192
    }, {
      "name": "Project 2",
      "date": "2017-01-01 13:37:00",
      "value": 6753
    },
    {
      "name": "Project N",
      "date": "2017-01-01 17:52:41",
      "value": 1219
    }]
}

]


})
