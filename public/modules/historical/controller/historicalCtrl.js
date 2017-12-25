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
        vm.selectedCenter=6901;
        vm.selectedStartDate_person = new Date(); //moment(new Date()).format("DD MMM, YYYY"); //'9 November, 2017'
        vm.selectedStartDate_courses = new Date();

        vm.selectedEndDate_person = new Date();
        vm.selectedEndDate_courses = new Date();

        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year
            closeOnSelect: true,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
        });
        $('#start_date_courses').pickadate('picker').set('select', new Date())
        $('#end_date_courses').pickadate('picker').set('select', new Date())



$('#center_courses option[value='+vm.selectedCenter+']').attr('selected', true);
$('select').material_select();
Materialize.updateTextFields();

    });

  var vm = this;

  /***************
      WATCHERS
  ****************/
  $scope.$watch(function() {
    return vm.selectedCenter;
  },function(newCenter, oldCenter) {
    if(newCenter != oldCenter) {
      vm.selectedCenter = newCenter;
    }
  });

  $scope.$watch(function() {
    return vm.selectedStartDate_person;
  },function(newStartDate, oldStartDate) {
    if(newStartDate != oldStartDate) {
      vm.selectedStartDate_person = newStartDate;
      var end_date_courses = $('#end_date_person').pickadate('picker');
      end_date_courses.set('disable', true);
      end_date_courses.set('enable', true);
      end_date_courses.set('min', newStartDate)
    }
  });

  $scope.$watch(function() {
    return vm.selectedStartDate_courses;
  },function(newStartDate, oldStartDate) {
    if(newStartDate != oldStartDate) {
      vm.selectedStartDate_courses = newStartDate;
      var end_date_courses = $('#end_date_courses').pickadate('picker');
      end_date_courses.set('disable', true);
      end_date_courses.set('enable', true);
      end_date_courses.set('min', newStartDate)
      //end_date_courses.start();
    }
  });

  $scope.$watch(function() {
    return vm.selectedEndDate_person;
  },function(newEndDate, oldEndate) {
    if(newEndDate != oldEndate) {
      vm.selectedEndDate_person = newEndDate;
    }
  });

  $scope.$watch(function() {
    return vm.selectedEndDate_courses;
  },function(newEndDate, oldEndate) {
    if(newEndDate != oldEndate) {
      vm.selectedEndDate_courses = newEndDate;
    }
  });


  initController();
  function initController(){
    document.getElementById("calendar_error").style.visibility='hidden';
    vm.centers = [
      {name:"6901", value:6901},
      {name:"6902", value:6902},
      {name:"6903", value:6903}
    ]
    vm.unique_visitors_data= [
      {
            key:"language lesson",
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
            key:"physical exercise",
            values:[
              [1, 7],
              [2, 6],
              [3, 6],
              [4, 5],
              [5, 7],
              [6, 7],
              [7, 6],
            ]
      },
      {
            key:"bingo",
            values:[
              [1, 4],
              [2, 20],
              [3, 12],
              [4, 10],
              [5, 1],
              [6, 3],
              [7, 1],
            ]
      },
      {
            key:"karaoke",
            values:[
              [1, 19],
              [2, 0],
              [3, 10],
              [4, 4],
              [5, 6],
              [6, 7],
              [7, 9],
            ]
      }
      ]; //end unique_visitors_data
    vm.center_attendance_data = [
      {
            key:"6901",
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
            key:"6902",
            values:[
              [1, 6],
              [2, 5],
              [3, 2],
              [4, 15],
              [5, 9],
              [6, 13],
              [7, 3],
              ]
      },
      {
            key:"6903",
            values:[
              [1, 3],
              [2, 5],
              [3, 6],
              [4, 8],
              [5, 10],
              [6, 20],
              [7, 2],
              ]
      }
    ]; //end line_data
    vm.activity_comparison_data =[
      {
        key: 'language lesson',
        values: [
          {x: 0,y: 3},
          {x: 1,y: 7},
          {x: 2,y: 7},
          {x: 3,y: 8},
          {x: 4,y: 11},
          {x: 5,y: 17}
        ]
      },
      {
        key: 'physical exercise',
        values: [
          {x: 0,y: 9},
          {x: 1,y: 5},
          {x: 2,y: 10},
          {x: 3,y: 15},
          {x: 4,y: 3},
          {x: 5,y: 8}
        ]
      }];

    //testing data
    vm.myData = [
      {
        "date": "2015-10-01",
        "trendingValue": "244"
      },
      {
          "date": "2015-07-01",
          "trendingValue": "0"
      },
      {
          "date": "2015-06-01",
          "trendingValue": "117"
      },
      {
          "date": "2015-05-01",
          "trendingValue": "5353"
      },
      {
          "date": "2015-04-01",
          "trendingValue": "11159"
      },
      {
          "date": "2015-03-01",
          "trendingValue": "7511"
      },
      {
          "date": "2015-02-01",
          "trendingValue": "6906"
      },
      {
          "date": "2015-01-01",
          "trendingValue": "10816"
      },
      {
          "date": "2014-12-01",
          "trendingValue": "3481"
      },
      {
          "date": "2014-11-01",
          "trendingValue": "1619"
      },
      {
          "date": "2014-10-01",
          "trendingValue": "4084"
      },
      {
          "date": "2014-09-01",
          "trendingValue": "1114"
      }
    ];
    vm.thisData = [{
        key: 'language lesson',
        values: [
          {x: 0,y: 3},
          {x: 1,y: 7},
          {x: 2,y: 7},
          {x: 3,y: 8},
          {x: 4,y: 11},
          {x: 5,y: 17}
        ]
      },
      {
        key: 'physical exercise',
        values: [
          {x: 0,y: 9},
          {x: 1,y: 5},
          {x: 2,y: 10},
          {x: 3,y: 15},
          {x: 4,y: 3},
          {x: 5,y: 8}
        ]
    }];
    vm.data = [
        {
            key: "Cumulative Return",
            values: [
                {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
        }
      ]; //end data

    vm.selectedCenter = 6901;
    vm.selectedEndDate_courses = new Date('30 November 2017');
    vm.selectedStartDate_courses = new Date('1 November 2017');

    //callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
    callSensorReadings(vm.selectedCenter,vm.selectedStartDate_courses,vm.selectedEndDate_courses);


    }//end initController



  /********************
    Calendar Heatmap
  *********************/
function callSensorReadings (center, start_date_time, end_date_time){
  start_date_time =moment(start_date_time).format('YYYY-MM-DD') + 'T00:00:00'
  end_date_time =moment(end_date_time).format('YYYY-MM-DD') + 'T00:00:00'

  $q.when()
    .then(function(){
      console.log(center +"\n"+ start_date_time +"\n"+ end_date_time);
        return getSensorReadings(center, start_date_time, end_date_time, 500 );
    })
    .then(function(result){
        //update_heatmap_chart(result)
        console.log(result);
        update_most_active_chart(result)
    })//end when.then
}//end callSensorReadings

function update_heatmap_chart(result){
  console.log(result);
  if (result.results.length == 0){
    document.getElementById("calendar_error").style.visibility='visible';
  }else{
    document.getElementById("calendar_error").style.visibility='hidden';

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
  }//end else
}//end func

function update_activity_comparison_chart(result){
  //todo
  activity_array = [
    ["Monday","9:30am","10:30am","Physical Exercise"],
    ["Monday","10:30am","12:30pm","Language Lessons"],
    ["Monday","2:30pm","4:00pm","Bingo"],
    ["Tuesday","9:30am","10:30am","Physical Exercise"],
    ["Tuesday","10:30am","12:30pm","Language Lessons"],
    ["Tuesday","2:30pm","4:00pm","Karaoke"],
    ["Wednesday","9:30am","10:30am","Arts & Music"],
    ["Wednesday","1:30pm","2:30pm","Physical Exercise"],
    ["Wednesday","2:20pm","5:00pm","TCM"],
    ["Thursday","9:30am","10:30am","Physical Exercise"],
    ["Thursday","2:00pm","3:30pm","Language Lessons"],
    ["Thursday","1:00pm","4:30pm","Karaoke"],
    ["Friday","9:30am","10:30am","Physical Exercise"],
    ["Friday","10:30am","12:30pm","Language Lessons"],
    ["Friday","2:30pm","3:30pm","Movie"],
    ["Friday","3:30pm","4:30pm","Arts & Music"]
  ]
  /*
  activity_array = [
    [
      ["9:30am","10:30am","Physical Exercise"],
      ["10:30am","12:30pm","Language Lessons"],
      ["2:30pm","4:00pm","Bingo"]
    ],//monday
    [
      ["9:30am","10:30am","Physical Exercise"],
      ["10:30am","12:30pm","Language Lessons"],
      ["2:30pm","4:00pm","Karaoke"]
    ],//tueday
    [
      ["9:30am","10:30am","Arts & Music"],
      ["1:30pm","2:30pm","Physical Exercise"],
      ["2:20pm","5:00pm","TCM"]
    ],//wednesday
    [
      ["9:30am","10:30am","Physical Exercise"],
      ["2:00pm","3:30pm","Language Lessons"],
      ["1:00pm","4:30pm","Karaoke"]
    ],//thursday
    [
      ["9:30am","10:30am","Physical Exercise"],
      ["10:30am","12:30pm","Language Lessons"],
      ["2:30pm","3:30pm","Movie"],
      ["3:30pm","4:30pm","Arts & Music"]
    ]//friday
  ]
  */
  //seperate data by activity then day

  var activity_day_array = [];




  //seperate data by day
  var day_obj_array = [];
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



  //add data TODO

  console.log(center_attendance_data);
  vm.center_attendance_data=angular.copy(center_attendance_data);

}

function update_most_active_chart(result){
  if (result.results.length == 0){
    document.getElementById("active_error").style.visibility='visible';
  }else{
    document.getElementById("active_error").style.visibility='hidden';
  }

    //sort the data by mac ID
    var temp_arr = objArr_to_macObjArr(result.results);
    console.log(temp_arr);
    var mac_id_list = temp_arr[0];//array that stores all the unique ID
    var mac_obj_array = temp_arr[1];//array that stores arrays of obj, each array contains all objects of a particular mac id

    //var mac_time_list = [];//array that stores total time per corresponding mac id
    var time_data = [];
    time_data.push({
      "key": "Time Spent (Hrs)",
      "color": "#d67777",
      "values": []
    });

    //get timings of each mac_id and store in object
    mac_obj_array.forEach(function(value,index){
      var id_time = objArr_to_instances(value)[0] /(60*60);
        time_data[0].values.push({
          "label": ""+ mac_id_list[index],
          "value": id_time
        });
        //mac_time_list.push(objArr_to_instances(value));
    });
    //sort objects by timing
    time_data[0].values.sort(compare_time_data);


    vm.active_time_Data = angular.copy(time_data);
    console.log(time_data);

    /*vm.active_time_Data = [
        {
          "key": "Series 1",
          "color": "#d67777",
          "values": [
            {
              "label" : "Group A" ,
              "value" : -1.8746444827653
            } ,
            {
              "label" : "Group B" ,
              "value" : -8.0961543492239
            } ,
            {
              "label" : "Group C" ,
              "value" : -0.57072943117674
            } ,
            {
              "label" : "Group D" ,
              "value" : -2.4174010336624
            } ,
            {
              "label" : "Group E" ,
              "value" : -0.72009071426284
            } ,
            {
              "label" : "Group F" ,
              "value" : -0.77154485523777
            } ,
            {
              "label" : "Group G" ,
              "value" : -0.90152097798131
            } ,
            {
              "label" : "Group H" ,
              "value" : -0.91445417330854
            } ,
            {
              "label" : "Group I" ,
              "value" : -0.055746319141851
            }
          ]
        },
        {
          "key": "Series 2",
          "color": "#4f99b4",
          "values": [
            {
              "label" : "Group A" ,
              "value" : 25.307646510375
            } ,
            {
              "label" : "Group B" ,
              "value" : 16.756779544553
            } ,
            {
              "label" : "Group C" ,
              "value" : 18.451534877007
            } ,
            {
              "label" : "Group D" ,
              "value" : 8.6142352811805
            } ,
            {
              "label" : "Group E" ,
              "value" : 7.8082472075876
            } ,
            {
              "label" : "Group F" ,
              "value" : 5.259101026956
            } ,
            {
              "label" : "Group G" ,
              "value" : 0.30947953487127
            } ,
            {
              "label" : "Group H" ,
              "value" : 0
            } ,
            {
              "label" : "Group I" ,
              "value" : 0
            }
          ]
        }
      ]
      */


}//end update_most_active_chart function
    /********************
      REUSEABLE FUNCTIONS
    *********************/
function compare_time_data(a,b){
  //helps sorting by decending order
  aTime = a.value;
  bTime = b.value;

  let comparison = 0;
  if (aTime > bTime) {
    comparison = -1;
  } else if (aTime < bTime) {
    comparison = 1;
  }
  return comparison;
}

function objArr_to_macObjArr(object_array){
  //takes an array of result objects and returns array of 2 arrays [mac_id_list,mac_obj_array]
  //mac_id_list, each index contains one mac id(String)
  //mac_obj_array, each index contains all objects of the corresponding mac id

  mac_id_list = [];
  mac_obj_array = [];
  object_array.forEach(function(value){
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
  })//end of forEach loop

  return [mac_id_list,mac_obj_array];
}

function objArr_to_instances(object_array){
  //takes an array of result objects and returns array of 2 arrays [array_total_time,instances_array];
  //array_total_time is the accumulated time of all valid instances captured by objects
  //instances_array an array of instances that stores mac_id,start time of instance and time spent for that instance

  var instances_array = []; //array of instances
  //instance = [mac_id,instance_start_date_time,time_spent]
  var min_time_spent_seconds = 600 //minimum 10 mins to count that instance
  var array_total_time = 0;

  var time_spent = 0;
  var next_date_time = moment(object_array[0].gw_timestamp).format("YYYY-MM-DD HH:mm:ss");

  object_array.forEach(function(value){
    var this_datetime = moment(value.gw_timestamp).format("YYYY-MM-DD HH:mm:ss");
    var time_diff = moment(next_date_time).diff(moment(this_datetime),"seconds");
    if ( time_diff == 0){
      //do nothing
    }else if( time_diff > min_time_spent_seconds){
      //new instance
      time_spent = time_spent + (10*60);//add 10mins after last scan
      instances_array.push([value.device_id.substring(value.device_id.indexOf("-")+1),next_date_time,time_spent]); //[mac_id,instance_start_date_time,time_spent]
      array_total_time = array_total_time + time_spent;
      //move on to next instance, reset time_spent etc
      time_spent = 0;
      start_date_time = this_datetime;
    }else{
      //current instance, add to time and update next_date_time
      time_spent = time_spent + time_diff;
    }//end if else statement
    next_date_time = this_datetime;
  })//end of forEach loop

  //add last entry
  time_spent = time_spent + (10*60);//add 10mins after last scan
  var last_obj = object_array[object_array.length -1];
  var last_mac_id = last_obj.device_id;
  instances_array.push([last_mac_id.substring(last_mac_id.indexOf("-")+1),next_date_time,time_spent]);
  array_total_time = array_total_time + time_spent;

  return[array_total_time,instances_array];
}//end func objArr_to_instances

  /********************
    BUTTON FUNCTIONS
  *********************/

  vm.generateDataPerson = generateDataPerson;
  vm.generateDataCourses = generateDataCourses;

  function generateDataPerson(){
    console.log(vm.selectedCenter +"\n"+ vm.selectedStartDate_person +"\n"+ vm.selectedEndDate_person);
    //callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
    console.log("disabled for now");
  }
  function generateDataCourses(){
    console.log("updating courses data");
    callSensorReadings(vm.selectedCenter,vm.selectedStartDate_courses,vm.selectedEndDate_courses);
  }

  /********************
      WEB SERVICES
  *********************/
  function getSensorReadings (gw_device, start_date, end_date, page_size) {
    var _defer = $q.defer();
    HService.getSensorReadings(gw_device, start_date, end_date, page_size, function (result) {
      if (result) {
        _defer.resolve(result);
      } else {
        _defer.reject();
      }
    });
    return _defer.promise;
  }

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
