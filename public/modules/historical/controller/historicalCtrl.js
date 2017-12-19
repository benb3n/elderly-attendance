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
/*
    vm.calendarheatmapdata = [
    {
      2017:{
            "date": "2017-04-01",
            "total": 17164,
            "details": [{
              "name": "Project 1",
              "date": "2017-04-01 12:30:45",
              "value": 9192
            }, {
              "name": "Project 2",
              "date": "2017-04-01 13:37:00",
              "value": 6753
            },
            {
              "name": "Project N",
              "date": "2017-04-01 17:52:41",
              "value": 1219
            }]
          },{
          "date": "2017-12-19",
          "total": 17164,
          "details": [{
            "name": "Project 1",
            "date": "2017-12-19 12:30:45",
            "value": 9192
          }, {
            "name": "Project 2",
            "date": "2017-12-19 13:37:00",
            "value": 6753
          },
          {
            "name": "Project N",
            "date": "2017-12-19 17:52:41",
            "value": 1219
          }]
        }
      }//end 2017
      {
        2016:
          {"date": "2016-03-19",
          "total": 17164,
          "details": [{
            "name": "Project 1",
            "date": "2016-03-19 12:30:45",
            "value": 9192
          }, {
            "name": "Project 2",
            "date": "2016-03-19 13:37:00",
            "value": 6753
          },
          {
            "name": "Project N",
            "date": "2016-03-19 17:52:41",
            "value": 1219
          }]
        }
      }//end 2016
    ]//end of heatmap data
*/
/*
    // Initialize random data for the demo
        var now = moment().endOf('day').toDate();
        var time_ago = moment().startOf('day').subtract(10, 'year').toDate();
        vm.calendarheatmapdata = d3.time.days(time_ago, now).map(function (dateElement, index) {
          return {
            date: dateElement,
            details: Array.apply(null, new Array(Math.round(Math.random() * 15))).map(function(e, i, arr) {
              return {
                'name': 'Project ' + Math.ceil(Math.random() * 10),
                'date': function () {
                  var projectDate = new Date(dateElement.getTime());
                  projectDate.setHours(Math.floor(Math.random() * 24))
                  projectDate.setMinutes(Math.floor(Math.random() * 60));
                  return projectDate;
                }(),
                'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600) * Math.round(Math.random() * (index / 365))
              }
            }),
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
          }.init();
        });
        console.log(  vm.calendarheatmapdata )
  */

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


}])
