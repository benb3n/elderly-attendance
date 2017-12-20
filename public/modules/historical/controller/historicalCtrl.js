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
      callSensorReadings(newCenter,vm.selectedStartDate,vm.selectedEndDate);
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

    var selectedStartDate = '2017-10-18T10:00:00'

    var selectedEndDate = '2017-11-18T10:00:00'

    callSensorReadings ("6901",selectedStartDate,selectedEndDate);
  }//end initController

function callSensorReadings (center, start_date_time, end_date_time){
  $q.when()
    .then(function(){
        return getSensorReadings(center, start_date_time, end_date_time);
    })
    .then(function(result){
        console.log(result)
        update_heatmap_chart(result)
    })//end when.then
}//end callSensorReadings


function update_heatmap_chart(result){
  var day_obj_array = [];

  //Method 1
  /*
    day_list: an array to keep track of the indexes of objects for the day in day_obj_array
    e.g day_list[0] == 2017-05-31 then day_obj_array[0] contains the array of objects for 31st May 2017
  */
  /*
  var day_list = [];
  result.results.forEach(function(value){
    var day = moment(value.gw_timestamp).format("YYYY-MM-DD");
    //check if day already has an array in day_obj_array by checking if day exist in day_list
    //if not, then add day into day_list AND create the array for that day in day_obj_array
    if(day_list.indexOf(day)== -1){ //does not exist in day_list
      //add into day_list
      day_list.push(day);
      //create array for that day in day_obj_array
      day_obj_array.push([]);
    }//end if
    //add object into the array
    day_obj_array[day_list.indexOf(day)].push(value);
  })//end of forEach loop of result
  // end Method 1
  */
  //Method 2
  var curr_day = moment(result.results[0].gw_timestamp).format("YYYY-MM-DD");
  var day_list = [curr_day];
  day_obj_array.push([]);
  result.results.forEach(function(value){
    this_day = moment(value.gw_timestamp).format("YYYY-MM-DD");
    //if day of this object is different from curr_day, create new array
    if(this_day != curr_day){
      day_obj_array.push([]);
      day_list.push(this_day);
      curr_day = this_day;
    }//end if
    day_obj_array[day_obj_array.length -1].push(value);
  })//end forEach loop
  //end Method 2
  //day_obj_array[day[],day[],day[]...]
  //day[obj,obj,obj...]

  var day_mac_obj_array =  [];
  //sorting the objects in day array by mac id
  day_obj_array.forEach(function(day_value){
    var mac_id_list = [];//array that stores all the unique ID's for a day
    var mac_obj_array = [];//array that stores arrays of obj, each array contains all objects of a particular mac id for that day
    day_value.forEach(function(value){
      //var id = value.device_id.substring(5);//assumes the center id is always 4 chars long followed by a "-"
      var id = value.device_id.substring(value.device_id.indexOf("-")+1); //assumes there will only be one "-" in device_id, and it seperates center ID from mac ID

      //check if that mac ID already has an array in mac_obj_array by checking if ID exist in mac_id_list
      //if not, then add ID into mac_id_list AND create the array for that day in mac_obj_array
      if(mac_id_list.indexOf(id) == -1){ //does not exist in mac_id_list
        //add into mac_id_list
        mac_id_list.push(id);
        //create array for that ID in mac_obj_array
        mac_obj_array.push([]);
      }//end if
      //add object into the corresponding array
      mac_obj_array[mac_id_list.indexOf(id)].push(value);
    })//end of forEach loop of day_value
    day_mac_obj_array.push(mac_obj_array);
  })//end of forEach loop of day_obj_array
  //day_obj_array[day[],day[],day[]...]
  //day[mac_id[],mac_id[]...]
  //mac_id[obj,obj...]

  var day_ins_array = [];
  day_time_array = [];
  //prepping data for chart
  day_mac_obj_array.forEach(function(day_value){

    var day_instances_array = [];
    var min_time_spent_seconds = 600 //minimum 10 mins to count that instance
    var day_total_time = 0;

    day_value.forEach(function(id_value){
      var time_spent = 0;
      var next_date_time = moment(id_value[0].gw_timestamp).format("YYYY-MM-DD HH:mm:ss");
      id_value.forEach(function(value){
          var this_datetime = moment(value.gw_timestamp).format("YYYY-MM-DD HH:mm:ss");
          var time_diff = moment(next_date_time).diff(moment(this_datetime),"seconds");
          if ( time_diff == 0){
            //do nothing
          }else if( time_diff > min_time_spent_seconds){
            //new instance
            time_spent = time_spent + (10*60);//add 10mins after last scan
            day_instances_array.push([value.device_id.substring(value.device_id.indexOf("-")+1),next_date_time,time_spent]);
            day_total_time = day_total_time + time_spent;
            //move on to next instance, reset time_spent etc
            time_spent = 0;
            start_date_time = this_datetime;
          }else{
            //current instance, add to time and update next_date_time
            time_spent = time_spent + time_diff;
          }//end if else statement
          next_date_time = this_datetime;
        })//end of forEach loop of id_value
        //add last entry
        time_spent = time_spent + (10*60);//add 10mins after last scan
        day_instances_array.push([id_value[0].device_id.substring(id_value[0].device_id.indexOf("-")+1),next_date_time,time_spent]);
        day_total_time = day_total_time + time_spent;

    })//end of forEach loop of day_value

    day_time_array.push(day_total_time);
    day_ins_array.push(day_instances_array);
  })//end of forEach loop of day_obj_array
  //day_obj_array[day[],day[],day[]...]
  //day[instance[],instance[],instance[]...]
  //instance[mac_id,start_date_time,time_spent]

  //pushing into data
  var calendar_data = [];
  for(var i = 0 ; i<day_ins_array.length ; i++){
    calendar_data.push({
      "date": ""+ day_list[i],
      "total": day_time_array[i],
      "details": []//end details
    })//end push to calendar_data
  }//end for loop

  day_ins_array.forEach(function(day_value,day_index){
    day_value.forEach(function(value,index){
      calendar_data[day_index].details.push({
        "name": ""+ value[0],
        "date": ""+ value[1],
        "value": parseInt(value[2])
      })//end calendar_data push
    })//end forEach
  })//end forEach day_value
  console.log(calendar_data);
  vm.calendarheatmapdata=angular.copy(calendar_data);
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
    /*
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
      },//"date": "2016-01-01",
      {
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
      }//date": "2017-01-01

    ]//end heatmapdata
*/

})
