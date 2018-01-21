angular.module('HistoricalCtrl', [])
.controller('HistoricalController', function ($scope, $q, $timeout, HService) {
    var vm = this;
    vm.api = {
        project: 'mp',
        center_code_name : 'gl15',
        all_activity_count: 5000,
        all_device_count: 3000,
        latest_sensor_reading_count: 1000
    }

    $(document).ready(function() {
       $('ul.tabs').tabs();
      $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
      });
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
      end_date_courses.set('min', newStartDate);
      //end_date_courses.start();
      //console.log("start date changed!");
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

    //testing data
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
    vm.barData = [
        {
            key: "Cumulative Return",
            values: [
                {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
        }
      ]; //end data

    //vm.selectedCenter = 6901;

    //vm.selectedEndDate_courses = new Date('29 October 2017');
    //vm.selectedStartDate_courses = new Date('5 November 2017');

    //callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
    //callSensorReadings(vm.selectedCenter,vm.selectedStartDate_courses,vm.selectedEndDate_courses);

    vm.data = {
      all_residents:[],
      all_residents_by_resident_index: {},
      all_centers: [],
      all_centers_by_center_code: {},
      all_centers_activity: [],
      all_centers_activity_by_id:{},
      real_time_activity_reading: [],
      real_time_activity_reading_hash: {},
      real_time_activity_reading_by_device_id: {},
      real_time_activity_reading_by_activity: {},
      text_display_wdiget: {},
      calendarheatmap: null,
      popular_days: [],
      top_active_resident: [],
      top_active_resident_xaxis: [],
      top_active_resident_count: [],
      top_active_resident_count_xaxis: [],
      bottom_active_resident: [],
      bottom_active_resident_xaxis: [],
      bottom_active_resident_count: [],
      bottom_active_resident_count_xaxis: [],
      top_popular_activities: [],
      top_popular_activities_xaxis: [],
      top_popular_activities_count: [],
      top_popular_activities_count_xaxis: [],
      bottom_popular_activities: [],
      bottom_popular_activities_xaxis: [],
      bottom_popular_activities_count: [],
      bottom_popular_activities_count_xaxis: []
    }
    vm.display = {
      centers:[],
      residents: [],
      activity: []
    }

    generateDataForInit();

  }//end initController

  function generateDataForInit(){
    $q.when()
    .then(function(){
      return getAllResidents(vm.api.project, vm.api.all_device_count)
    })
    .then(function(result){
      vm.data.all_residents = result;
      console.log("resident", result)
      result.results.forEach(function(value, index){
        vm.data.all_residents_by_resident_index[value.resident_index] = value;
        vm.display.residents.push({name: value.display_name, value: value.resident_index})
      })

      return getAllCenters(vm.api.project, vm.api.all_device_count)
    })
    .then(function(result){
      vm.data.all_centers = result;
      console.log("centers", result)
      vm.selectedCenter = result.results[0].code_name
      vm.selectedGwDevice = result.results[0].device_list.split("; ")
      result.results.forEach(function(value, index){
        vm.data.all_centers_by_center_code[value.code_name] = value;
        vm.display.centers.push({name: value.code_name, value: value.code_name})
      })

      callSensorReadings(vm.selectedCenter, '2017-12-01', '2018-01-14') //'2017-12-01'
    })

  }

  function callSensorReadings (center, start_date_time, end_date_time){
    var start_datetime =moment(start_date_time).format('YYYY-MM-DD') + 'T00:00:00'
    var end_datetime =moment(end_date_time).format('YYYY-MM-DD') + 'T23:59:59'
    var start_date = moment(start_date_time).subtract(10, "minutes").format("YYYY-MM-DD")  //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DD")
    var end_date =  moment(new Date()).format("YYYY-MM-DD") //2017-06-01T10:00:00 //moment(new Date()).format("YYYY-MM-DD")

    console.log("start date " + start_datetime + " end date" + end_datetime)
    $q.when()
    .then(function(){
      return getCenterActivities(vm.api.project, vm.api.center_code_name, start_date, end_date);
    })
    .then(function(result){
      result.results.forEach(function(value, index){
        var start_index = value.repeat_params.indexOf("[") + 1;
        var end_index = value.repeat_params.indexOf("]");
        value.repeat_days_of_week = value.repeat_params.substring(start_index, end_index)
        value.start_hour = value.start_time.substring(0,2)
        value.start_minute = value.start_time.substring(3,5)
        value.end_hour = value.end_time.substring(0,2)
        value.end_minute = value.end_time.substring(3,5)
        vm.data.all_centers_activity.push(value)
        vm.data.all_centers_activity_by_id[value.id] = value;
        vm.display.activity.push({name: value.activity_desc, value: value.id})
      })
      console.log("activity" , vm.data.all_centers_activity)

      return getAllCenterAttendanceInterval(vm.api.project, vm.api.center_code_name, start_datetime, end_datetime );
    })
    .then(function(result){

      var arr = [];
      var total_time_spent_in_sec = 0;
      result.data.forEach(function(value, index){
        if(value.time_spent_min >= 5){
          vm.data.real_time_activity_reading_hash[value.resident_index] = value;
          value.year = moment(value.start_timestamp).format('YYYY');
          value.month = moment(value.start_timestamp).format('M');
          value.day = moment(value.start_timestamp).format('D');
          value.day_of_the_week = moment(value.start_timestamp).isoWeekday();
          value.hour = moment(value.start_timestamp).format('HH');
          value.minute = moment(value.start_timestamp).format('mm');
          value.date = moment(value.start_timestamp).format('YYYY-MM-DD');
          total_time_spent_in_sec += value.time_spent_sec
          var counter = 0 ;
          vm.data.all_centers_activity.forEach(function(activity, index){
            var range = moment.range(moment(activity.start_date, 'YYYY-MM-DD') , moment(activity.end_date,'YYYY-MM-DD') );
            if(range.contains(moment(value.start_timestamp)) && activity.repeat_days_of_week.indexOf(value.day_of_the_week) != -1
            && parseInt(activity.start_hour + activity.start_minute) <= parseInt(value.hour + value.minute)
            && parseInt(activity.end_hour + activity.end_minute) >= parseInt(value.hour + value.minute) && counter == 0){
              value.activity_desc = activity.activity_desc;
              vm.data.real_time_activity_reading.push(value);
              counter = 1;
            }
          })

        }
      })
      console.log("readings" , vm.data.real_time_activity_reading)
      console.log("total seconds " + total_time_spent_in_sec)

      vm.data.real_time_activity_reading_by_device_id = vm.data.real_time_activity_reading.reduce(function (r, a) {
        r[a.resident_display_name + " -" + a.device_id] = r[a.resident_display_name + " -" + a.device_id] || [];
        r[a.resident_display_name + " -" + a.device_id].push(a);
        return r;
      }, Object.create(null));

      vm.data.real_time_activity_reading_by_activity = vm.data.real_time_activity_reading.reduce(function (r, a) {
        r[a.resident_display_name + " -" + a.device_id] = r[a.resident_display_name + " -" + a.device_id] || [];
        r[a.resident_display_name + " -" + a.device_id].push(a);
        return r;
      }, Object.create(null));

      vm.data.real_time_activity_reading_by_activity_name = vm.data.real_time_activity_reading.reduce(function (r, a) {
        r[a.activity_desc] = r[a.activity_desc] || [];
        r[a.activity_desc].push(a);
        return r;
      }, Object.create(null));

      console.log("readings by activity", vm.data.real_time_activity_reading_by_activity_name);

      //OVERVIEW TAB
      calendar_heatmap_widget();
      top_bottom_active_resident_widget();
      top_bottom_count_popular_activities_widget();

      //COURSES TAB
      //day_of_week_widget();
      box_heatmap_widget();

      //PERSON TAB


    })//end when.then
    .then(function(){
      $timeout(function () {
        $('select').material_select()
      });
    })
  }//end callSensorReadings

  /***********************
     CHARTS - OVERVIEW
  ***********************/
  function calendar_heatmap_widget(){
    var real_time_activity_reading_by_date = vm.data.real_time_activity_reading.reduce(function (r, a) {
      r[a.date] = r[a.date] || [];
      r[a.date].push(a);
      return r;
    }, Object.create(null));

    var data = []
    Array.prototype.sum = function (prop) {
      var total = 0
      for ( var i = 0, _len = this.length; i < _len; i++ ) {
          total += this[i][prop]
      }
      return total
    }
    Object.values(real_time_activity_reading_by_date).forEach(function(value, index){
      var total_time_in_sec = value.sum("time_spent_sec");
      var cal_event = {};
      value.forEach(function(reading, readingIndex){
        if(readingIndex == 0){
          cal_event.date = reading.date;
          cal_event.total = total_time_in_sec;
          cal_event.details = []
        }
        cal_event.details.push({
          'name': reading.resident_display_name,
          'date': reading.start_timestamp.replace("T", " "),
          'value': reading.time_spent_sec
        })
      })
      data.push(cal_event)
    })
    data.sort(function(a,b){
      return new Date(a.date) - new Date(b.date);
    });

    vm.data.calendarheatmap = angular.copy(data)
  }

  // TOP/BOTTOM ACTIVITIES
  function top_bottom_count_popular_activities_widget(){

    var format=d3.format(".1f");
    var activity_attendance = [];
    Object.keys(vm.data.real_time_activity_reading_by_activity_name).forEach(function(key){
      var num_instances = vm.data.real_time_activity_reading_by_activity_name[key].length;
      var obj = {};
      obj.name = key;
      obj.value = format((getInstancesTotalTime(vm.data.real_time_activity_reading_by_activity_name[key])/(60*60))/num_instances); //average time per instance
      obj.count = num_instances;
      activity_attendance.push(obj);
    })//end for each macID

    //sorting
    var activity_attendance_by_hour = angular.copy(activity_attendance.sort(compareValue))
    var activity_attendance__by_count = angular.copy(activity_attendance.sort(compareCount))
    console.log(activity_attendance_by_hour)
    console.log(activity_attendance__by_count)
    //time spent
    var top_5_activities = (activity_attendance_by_hour.length >= 5) ? activity_attendance_by_hour.slice(0,5) : activity_attendance_by_hour.slice(0, activity_attendance_by_hour.length);
    var bottom_5_activities = (activity_attendance_by_hour.length >= 5) ? activity_attendance_by_hour.slice(Math.max(activity_attendance_by_hour.length - 5, 1)) : activity_attendance_by_hour.slice(Math.max(activity_attendance_by_hour.length, 1))
    //count
    var top_5_activities_count = (activity_attendance__by_count.length >= 5) ? activity_attendance__by_count.slice(0,5) : activity_attendance__by_count.slice(0, activity_attendance__by_count.length);;
    var bottom_5_activities_count = (activity_attendance__by_count.length >= 5) ? activity_attendance__by_count.slice(Math.max(activity_attendance__by_count.length - 5, 1)) : activity_attendance__by_count.slice(Math.max(activity_attendance__by_count.length, 1))

    //time spent
    vm.data.top_popular_activities_xaxis = angular.copy(top_5_activities.map(a => a.name))
    vm.data.top_popular_activities = ["Hours"].concat(angular.copy(top_5_activities.map(a => a.value)))
    vm.data.bottom_popular_activities_xaxis = angular.copy(bottom_5_activities.map(a => a.name))
    vm.data.bottom_popular_activities = ["Hours"].concat(angular.copy(bottom_5_activities.map(a => a.value)))
    //count
    vm.data.top_popular_activities_count_xaxis = angular.copy(top_5_activities_count.map(a => a.name))
    vm.data.top_popular_activities_count = ["Unique Visit"].concat(angular.copy(top_5_activities_count.map(a => a.count)))
    vm.data.bottom_popular_activities_count_xaxis = angular.copy(bottom_5_activities_count.map(a => a.name))
    vm.data.bottom_popular_activities_count = ["Unique Visit"].concat(angular.copy(bottom_5_activities_count.map(a => a.count)))


  }//end top_bottom_popular_activities_widget

  // TOP/BOTTOM RESIDENTS
  function top_bottom_active_resident_widget(){
    var format=d3.format(".1f");
    var resident_time_spent_by_device_id = []
    Object.keys(vm.data.real_time_activity_reading_by_device_id).forEach(function(key){
      var obj = {};
      obj.name = key;
      obj.value = format(getInstancesTotalTime(vm.data.real_time_activity_reading_by_device_id[key])/(60*60));
      obj.count = vm.data.real_time_activity_reading_by_device_id[key].length;
      resident_time_spent_by_device_id.push(obj);
    })//end for each macID

    //sorting
    var resident_time_spent_by_hour = angular.copy(resident_time_spent_by_device_id.sort(compareValue));
    var resident_time_spent_by_count = angular.copy(resident_time_spent_by_device_id.sort(compareCount));

    //time spent
    var top_5_resident = (resident_time_spent_by_device_id.length >= 5) ? resident_time_spent_by_hour.slice(0,5) : resident_time_spent_by_hour.slice(0, resident_time_spent_by_hour.length);
    var bottom_5_resident = (resident_time_spent_by_device_id.length >= 5) ? resident_time_spent_by_hour.slice(Math.max(resident_time_spent_by_hour.length - 5, 1)) : resident_time_spent_by_hour.slice(Math.max(resident_time_spent_by_hour.length, 1))
    //count
    var top_5_resident_count = (resident_time_spent_by_device_id.length >= 5) ? resident_time_spent_by_count.slice(0,5) : resident_time_spent_by_count.slice(0, resident_time_spent_by_count.length);
    var bottom_5_resident_count = (resident_time_spent_by_device_id.length >= 5) ? resident_time_spent_by_count.slice(Math.max(resident_time_spent_by_count.length - 5, 1))  :  resident_time_spent_by_count.slice(Math.max(resident_time_spent_by_count.length, 1))

    //time spent
    vm.data.top_active_resident_xaxis = angular.copy(top_5_resident.map(a => a.name.split(" -")[0]))
    vm.data.top_active_resident = ["Hours"].concat(angular.copy(top_5_resident.map(a => a.value)))
    vm.data.bottom_active_resident_xaxis = angular.copy(bottom_5_resident.map(a => a.name.split(" -")[0]))
    vm.data.bottom_active_resident = ["Hours"].concat(angular.copy(bottom_5_resident.map(a => a.value)))
    //count
    vm.data.top_active_resident_count_xaxis = angular.copy(top_5_resident_count.map(a => a.name.split(" -")[0]))
    vm.data.top_active_resident_count = ["Unique Visit"].concat(angular.copy(top_5_resident_count.map(a => a.count)))
    vm.data.bottom_active_resident_count_xaxis = angular.copy(bottom_5_resident_count.map(a => a.name.split(" -")[0]))
    vm.data.bottom_active_resident_count = ["Unique Visit"].concat(angular.copy(bottom_5_resident_count.map(a => a.count)))


  }//end top_bottom_active_resident_widget

  /***********************
     CHARTS - ACTIVITY
  ***********************/
  function day_of_week_widget(){

    var popular_days = []
    Object.keys(vm.data.real_time_activity_reading_by_activity_name).forEach(function(key, index){
      var result = vm.data.real_time_activity_reading_by_activity_name[key].reduce(function (r, a) {
        r[a.day_of_the_week] = r[a.day_of_the_week] || [];
        r[a.day_of_the_week].push(a);
        return r;
      }, Object.create(null));

      popular_days.push(key)
      for(var i = 0; i < 7; i++){
        popular_days.push( (result[i]) ? result[i].length : 0)
      }

      vm.data.popular_days.push(popular_days);
      popular_days = [];
    })
  }

  function box_heatmap_widget(){

    temp_arr = insArr_to_dateInsArr(vm.data.real_time_activity_reading);
    var date_ins_array = temp_arr[1];
    var date_list = temp_arr[0];

    var week_arr = [];
    for(i=0; i<7; i++){
      var hour_arr  = new Array(21);
      hour_arr.fill(0);
      week_arr.push(hour_arr);
    }

    var week_instances_count = new Array(7); //counts number of weeks the chosen dataset has of each day
    week_instances_count.fill(0);
    date_ins_array.forEach(function(date_value,date_index) {
      //check date
      var this_date = moment(date_list[date_index]);
      var day_index = moment(this_date).weekday(); //weekday returns 0-6 where 0 is Monday
      var time_arr = generate_time_array(this_date,8,20);

      date_value.forEach(function(instance_value){
        var time_index;
        var this_start = moment(instance_value.start_timestamp);
        var this_end = moment(instance_value.end_timestamp);
        //console.log(instance_value);
        //console.log(moment(this_start).format('HH:mm:ss')+ " -- " + moment(this_end).format('HH:mm:ss'));
        for (i = 0; i < time_arr.length-1; i++) {
          if(!(time_arr[i+1].isBefore(this_start) || this_end.isBefore(time_arr[i]))){
            //console.log("falls between: "+i+"= " +time_arr[i].format('HH:mm') + "--"+time_arr[i+1].format('HH:mm'));
            week_arr[day_index][i] += 1;
          };//end if
        };//end for loop
      })//end forEach instance

    })//end for each date

    //add data
    weekly_activity_data = [];
    week_arr.forEach(function(day_value,day_index){
      day_value.forEach(function(value,index){
        weekly_activity_data.push({
          "day": day_index+1,
          "hour":	index+1,
          "value": value
        })
      })//end for each hour
    })//end for each day

    vm.dayHourBoxHeatmapData=angular.copy(weekly_activity_data);

  }//end box_heatmap_widget



  /***********************
     CHARTS - PERSON
  ***********************/
  function person_box_heatmap_widget(String resident_name){
    //TODO: cut out the data for that resident
    //vm.data.real_time_activity_reading
    //var resident_activity_reading

    temp_arr = insArr_to_dateInsArr(resident_activity_reading);
    var date_ins_array = temp_arr[1];
    var date_list = temp_arr[0];

    var week_arr = [];
    for(i=0; i<7; i++){
      var hour_arr  = new Array(21);
      hour_arr.fill(0);
      week_arr.push(hour_arr);
    }

    var week_instances_count = new Array(7); //counts number of weeks the chosen dataset has of each day
    week_instances_count.fill(0);

    date_ins_array.forEach(function(date_value,date_index) {
      //check date
      var this_date = moment(date_list[date_index]);
      var day_index = moment(this_date).weekday(); //weekday returns 0-6 where 0 is Monday
      var time_arr = generate_time_array(this_date,8,20);

      date_value.forEach(function(instance_value){
        var time_index;
        var this_start = moment(instance_value.start_timestamp);
        var this_end = moment(instance_value.end_timestamp);
        //console.log(instance_value);
        //console.log(moment(this_start).format('HH:mm:ss')+ " -- " + moment(this_end).format('HH:mm:ss'));
        for (i = 0; i < time_arr.length-1; i++) {
          if(!(time_arr[i+1].isBefore(this_start) || this_end.isBefore(time_arr[i]))){
            //console.log("falls between: "+i+"= " +time_arr[i].format('HH:mm') + "--"+time_arr[i+1].format('HH:mm'));
            week_arr[day_index][i] += 1;
          };//end if
        };//end for loop
      })//end forEach instance
    })//end for each date

    //add data
    weekly_activity_data = [];
    week_arr.forEach(function(day_value,day_index){
      day_value.forEach(function(value,index){
        weekly_activity_data.push({
          "day": day_index+1,
          "hour":	index+1,
          "value": value
        })
      })//end for each hour
    })//end for each day

    vm.dayHourBoxHeatmapData=angular.copy(weekly_activity_data);

  }//end person_box_heatmap_widget




  vm.tab2 = tab2;
  function tab2(){
    console.log("TAB");

    day_of_week_widget();
  }

  function update_most_active_chart(result){
    if (result.results.length == 0){
      document.getElementById("active_error").style.visibility='visible';
    }else{
      document.getElementById("active_error").style.visibility='hidden';
    }

      //sort the data by mac ID
      var temp_arr = insArr_to_macInsArr(result.results);
      var mac_id_list = temp_arr[0];//array that stores all the unique ID
      var mac_ins_array = temp_arr[1];//array that stores arrays of instances, each array contains all instances of a particular mac id

      //var mac_time_list = [];//array that stores total time per corresponding mac id
      var time_data = [];

      //get timings of each mac_id and store in object
      mac_ins_array.forEach(function(value,index){
        var id_time = getInstancesTotalTime(value) /(60*60);
        time_data.push({
            "category": ""+ mac_id_list[index],
            "num": id_time
        });
      });
      //sort objects by timing
      time_data.sort(compare_time_data);

      vm.mostActiveData = angular.copy(time_data);
  }//end update_most_active_chart function

  function update_activity_month_chart(attendance, center_activities, course_type, start_date, end_date){
    //get data related to course
    center_activities = {
        "count": 3,
        "next": null,
        "previous": null,
        "results": [
          {
              "id": 15,
              "project_prefix": "MP",
              "project_desc": "Marine Parade",
              "center_id": 2,
              "center_code_name": "gl52",
              "activity_desc": "activity desc",
              "activity_type_list": "music; sports",
              "start_date": "2017-11-01",
              "end_date": "2017-11-01",
              "start_time": "10:00:00",
              "end_time": "11:00:00",
              "repeat_params": {
                  "days_of_week": [1, 2, 3]
                }
          },{
              "id": 20,
              "project_prefix": "MP",
              "project_desc": "Marine Parade",
              "center_id": 2,
              "center_code_name": "gl52",
              "activity_desc": "Hokkien",
              "activity_type_list": "language",
              "start_date": "2017-10-30",
              "end_date": "2017-11-03",
              "start_time": "10:00:00",
              "end_time": "11:00:00",
              "repeat_params": {
                  "days_of_week": [2,3,4]
                }
          },{
              "id": 30,
              "project_prefix": "MP",
              "project_desc": "Marine Parade",
              "center_id": 2,
              "center_code_name": "gl52",
              "activity_desc": "English",
              "activity_type_list": "language",
              "start_date": "2017-11-01",
              "end_date": "2017-11-30",
              "start_time": "12:00:00",
              "end_time": "14:00:00",
              "repeat_params": {
                  "days_of_week": [1,3,5]
                }
          }
        ]
      }//end obj

    var temp_arr = courseObj_to_courseArr(center_activities.results,course_type,start_date,end_date);
    var courses_date_array = temp_arr[1]; // arr[date[course,course],date[course]..]
    var courses_date_list = temp_arr[0];
    /*courses_array.sort(function(a,b){
      a_date = moment(a[0]);
      b_date = moment(b[0]);
      if(a_date.isBefore(b_date)){
        return -1;
      } else{
        return 1;
      }
    });
    */
    var courses_date_instances = Array(courses_date_list.length);
    //arr[date[course[ins],course[ins,ins]],date[course[ins,ins]]...]
    temp_arr = insArr_to_dateInsArr(attendance);
    var date_ins_array = temp_arr[1];
    var date_list = temp_arr[0];

    date_ins_array.forEach(function(date_value,date_index){
      var course_date_index = courses_date_list.indexOf(date_list[date_index]);
      if(course_date_index==-1) return; //no courses that date
      var focus_courses = courses_date_array[course_date_index];//courses in a specific date
      courses_date_instances[course_date_index] = insArray_to_coursesInsArr(date_value,focus_courses);
    })//end for each day

    /*
    todo: average out the activity?
    */
    var month_list = [];

    var curr_month = moment(courses_date_list[0]).set('date', 1);
    var end_month = moment(courses_date_list[courses_date_list.length-1]).set('date', 1);
    while(curr_month.isSameOrBefore(end_month)){
      month_list.push(moment(curr_month).format('YYYY-MM'));
      curr_month = moment(curr_month).add(1, 'month');
    }//end while

    var month_count = Array(month_list.length);
    month_count.fill(0);
    courses_date_instances.forEach(function(date_value,date_index){
      var this_month = moment(courses_date_list[date_index]).format('YYYY-MM');
      if (month_list.indexOf(this_month) == -1){
        console.log("error in update_activity_month_chart");
      };//end if
      date_value.forEach(function(course_value){
        month_count[month_list.indexOf(this_month)] += uniqueId_from_instanceArr(course_value).length;
      })//for each course
    })//for each date

    var activity_month_data = [];
    month_list.forEach(function(value,index){
      activity_month_data.push({
        "date": '' + value,
        "num": month_count[index]
      })//end obj
    })//end for each month in month list
    activity_month_data.push({
      "date": '2017-12',
      "num": 2
    })//end obj
    /*
    activity_month_data.push({
      "date": '2018-01',
      "num": 3
    })//end obj*/
    activityMonthData = [];
    test_dates = ['2017-10','2017-11','2017-12','2018-01','2018-02','2018-03','2018-04','2018-05','2018-06'];
    test_values = [1,3,2,5,6,7,4,6,2];
    test_dates.forEach(function(value,index){
      activityMonthData.push({
        "date": value,
        "num": test_values[index]
      })//end obj
    });
    //vm.activityMonthData=angular.copy(activityMonthData);
    vm.activityMonthData=angular.copy(activity_month_data);

    //{"date": '2011-03', "num" : 9}
  }// end func update_activity_month_chart

  function update_course_time_chart(result){
    //TODO:
  }// end func update_course_time_chart

  /********************
    REUSEABLE FUNCTIONS
  *********************/

  function compareValue (a, b) {
    // DESCENDING ORDER
    if (parseFloat(a.value) > parseFloat(b.value)) return -1;
    if (parseFloat(a.value) < parseFloat(b.value)) return 1;
    return 0;
  }

  function compareCount (a, b) {
    // DESCENDING ORDER
    if (parseFloat(a.count) > parseFloat(b.count)) return -1;
    if (parseFloat(a.count) < parseFloat(b.count)) return 1;
    return 0;
  }

  function getInstancesTotalTime(instances_array){
    /*instance = {
          activity_desc:"Karaoke"
          date:"2018-01-02"
          day:"2"
          day_of_the_week:2
          device_id:"cf67c80cf6e8"
          end_timestamp:"2018-01-02T14:56:55"
          hour:"14"
          minute:"26"
          month:"1"
          resident_display_name:"Annie HO Pei Ling"
          resident_index:"MP0014"
          resident_profile_picture:null
          start_timestamp:"2018-01-02T14:26:56"
          time_spent_min:29
          time_spent_sec:1799
          year:"2018"
    */
    var total_time = 0; // seconds

    instances_array.forEach(function(value){
      total_time += value.time_spent_sec;
    })

    return total_time;

  }//end of getInstancesTotalTime

  function getInstancesForDateRange(instances_array,start_datetime, end_datetime){
    //returns array of instances that are within start & end date specified
    var focused_instances_array = [];

    instances_array.forEach(function(value){
      var this_start = moment(value.start_timestamp);
      var this_end =  moment(value.end_timestamp);
      if(!(moment(end_datetime).isBefore(this_start) || this_end.isBefore(moment(start_datetime)))){
        focused_instances_array.push(value);
      }//end if statement
    })//end for each

    return focused_instances_array;
  }//end getInstancesForDateRange

  /*
  function getCoursesForDateRange(courses_array,start_datetime, end_datetime){
    //returns array of instances that are within start & end date specified
    var focused_courses_array = [];

    courses_array.forEach(function(value){
      var this_start = moment(value.start_date).format('YYYY-MM-DD')+;
      var this_end =  moment(value.end_timestamp);
      if(!(moment(end_datetime).isBefore(this_start) || this_end.isBefore(moment(start_datetime)))){
        focused_instances_array.push(value);
      }//end if statement
    })//end for each

    return focused_instances_array;
  }//end getCoursesForDateRange
  */
  function generate_time_array(date,start_hour,end_hour){
    //create array of time with 30 min intervals for specific date
    var time_arr = [];
    var current = start_hour;
    var this_date = moment(date);
    while(current <= end_hour){
      time_arr.push(this_date.clone().hour(current).minute(0).second(0));
      time_arr.push(this_date.clone().hour(current).minute(30).second(0));
      current += 1;
    }//end while loop
    return time_arr
  }//end func generate_time_array

  function compare_time_data(a,b){
    //helps sorting by decending order
    aTime = a.num;
    bTime = b.num;

    let comparison = 0;
    if (aTime > bTime) {
      comparison = 1;
    } else if (aTime < bTime) {
      comparison = -1;
    }
    return comparison;
  }

  function objArr_to_dateObjArr(object_array){
    //retire
    //takes an array of result objects and returns array[date_list,day_obj_array];
    //date_list is an array where each index is a specific date
    //date_obj_array an array where each index stores an array of all objects for the corresponding date
    var date_obj_array = [];
    var date_list = [];

    var curr_date = moment(object_array.gw_timestamp).format("YYYY-MM-DD");
    date_list.push(curr_date);
    date_obj_array.push([]);

    object_array.forEach(function(value){
      var this_date = moment(value.gw_timestamp).format("YYYY-MM-DD");
      //if day of this object is different from curr_date, create new array
      if(this_date != curr_date){
        date_obj_array.push([]);
        date_list.push(this_date);
        curr_date = this_date;
      }//end if
      date_obj_array[date_obj_array.length -1].push(value);
    })//end forEach loop

    return[date_list,date_obj_array]
  }//end func objArr_to_dateObjArr

  function insArr_to_dateInsArr(instances_array){
    //takes an array of result objects and returns array[date_list,day_ins_array];
    //date_list is an array where each index is a specific date
    //date_ins_array an array where each index stores an array of all instances for the corresponding date
    /*instance = {
      device_id:"c074ab8a97a5"
      end_timestamp:"2017-11-28T13:48:19"
      resident_display_name: "Ali bin HUSSAIN"
      resident_index: "MP0012"
      resident_profile_picture: null
      start_timestamp: "2017-11-28T13:47:34"
      time_spent_min: 0
      time_spent_sec: 45
    */
    var date_ins_array = [];
    var date_list = [];

    var curr_date = moment(instances_array[0].start_timestamp).format("YYYY-MM-DD");

    instances_array.forEach(function(value){
      var this_date = moment(value.start_timestamp).format("YYYY-MM-DD");
      if(date_list.indexOf(this_date) == -1){
        date_ins_array.push([]);
        date_list.push(this_date);
      }//end if
      date_ins_array[date_list.indexOf(this_date)].push(value);
    })//end forEach loop

    return[date_list,date_ins_array]
  }//end func insArr_to_dateInsArr

  function objArr_to_macObjArr(object_array){
    //retire
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

  function insArr_to_macInsArr(instances_array){
    //returns [mac_id_list,mac_obj_array]
    //mac_id_list, each index contains one mac id(String)
    //mac_obj_array, each index contains all instances of the corresponding mac id
    /*instance = {
      device_id:"c074ab8a97a5"
      end_timestamp:"2017-11-28T13:48:19"
      resident_display_name: "Ali bin HUSSAIN"
      resident_index: "MP0012"
      resident_profile_picture: null
      start_timestamp: "2017-11-28T13:47:34"
      time_spent_min: 0
      time_spent_sec: 45
    */
    mac_id_list = [];
    mac_ins_array = [];
    instances_array.forEach(function(value){
      var id = value.device_id;
      //check if that mac ID already has an array in mac_ins_array by checking if ID exist in mac_id_list
      //if not, then add ID into mac_id_list AND create the array for that ID in mac_ins_array
      if(mac_id_list.indexOf(id) == -1){ //does not exist in mac_id_list
        //add into mac_id_list
        mac_id_list.push(id);
        //create array for that ID in mac_ins_array
        mac_ins_array.push([]);
      }//end if
      //add object into the corresponding array
      mac_ins_array[mac_id_list.indexOf(id)].push(value);
    })//end of forEach loop

    return [mac_id_list,mac_ins_array];
  }//end of insArr_to_macInsArr

  function objArr_to_instances(object_array){
    //retire
    //takes an array of result objects and returns array of 2 arrays [array_total_time,instances_array];
    //array_total_time is the accumulated time of all valid instances captured by objects
    //instances_array an array of instances that stores mac_id,start time of instance and time spent for that instance
    //method assumes that if there is only one data point, the beacon was merely passing by the area

    var instances_array = []; //array of instances
    //instance = [mac_id,instance_start_date_time,time_spent]
    var min_time_spent_seconds = 600 //minimum 10 mins to count that instance
    var buffer_time = 600 //time added to end of one instance
    var array_total_time = 0;

    var time_spent = 0;
    var next_date_time = moment(object_array[0].gw_timestamp).format("YYYY-MM-DD HH:mm:ss");

    object_array.forEach(function(value){
      var this_datetime = moment(value.gw_timestamp).format("YYYY-MM-DD HH:mm:ss");
      var time_diff = moment(next_date_time).diff(moment(this_datetime),"seconds");
      if ( time_diff == 0){
        //do nothing
      }else if( time_diff > min_time_spent_seconds){//new instance
        //check if current instance has more than one pointer-events, if not, considered invalid
        if(time_spent>0){
          time_spent = time_spent + buffer_time;
          instances_array.push([value.device_id.substring(value.device_id.indexOf("-")+1),next_date_time,time_spent]); //[mac_id,instance_start_date_time,time_spent]
          array_total_time = array_total_time + time_spent;
        }
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
    if(time_spent>0){
      time_spent = time_spent + buffer_time;
      var last_obj = object_array[object_array.length -1];
      var last_mac_id = last_obj.device_id;
      instances_array.push([last_mac_id.substring(last_mac_id.indexOf("-")+1),next_date_time,time_spent]);
      array_total_time = array_total_time + time_spent;
    }

    return[array_total_time,instances_array];
  }//end func objArr_to_instances

  function courseObj_to_courseArr(courseList_obj, course_type, start_date, end_date){
    //returns [courses_date_list,courses_array]
    //to format courselistobject to array of courses
    //course[curr_start_datetime,curr_end_datetime,duration_seconds,activity_type_list,days_of_week]
    //courses_array[date[course[],course[]],date[course[],course[]]...]
    //if course_type, courses_array only contains courses[] of that course type

    var courses_date_list = [];
    var courses_array = [];

    courseList_obj.forEach(function(value){

      var activity_type_list =  value.activity_type_list.split(";");
      if (typeof course_type != "undefined"){
        if(!activity_type_list.includes(course_type)){
          return;
        }//end if
      }

      [sHours, sMinutes,sSeconds] = value.start_time.split(':');
      [eHours, eMinutes,eSeconds] = value.end_time.split(':');

      var start_date_time = moment(value.start_date).hour(sHours).minute(sMinutes).second(sSeconds);
      var end_date_time = moment(value.end_date).hour(eHours).minute(eMinutes).second(eSeconds);
      var duration_seconds = moment(start_date_time).diff(end_date_time)/1000 // since .diff() returns in milliseconds

      var days_of_week = value.repeat_params.days_of_week;
      //console.log(moment(start_date_time).format('DD/MM/YY HH:mm:ss') + "--" + moment(end_date_time).format('DD/MM/YY HH:mm:ss') + " | " + days_of_week);

      var curr_date = value.start_date;
      while(moment(curr_date).isSameOrBefore(value.end_date)){
        //check if date is in days_of_week
        if (days_of_week.includes(moment(curr_date).isoWeekday())) {
          var curr_start_datetime = moment(curr_date).hour(sHours).minute(sMinutes).second(sSeconds).format("YYYY-MM-DDThh:mm:ss");
          var curr_end_datetime = moment(curr_date).hour(eHours).minute(eMinutes).second(eSeconds).format("YYYY-MM-DDThh:mm:ss");

          var date_index  = courses_date_list.indexOf(moment(curr_date).format("YYYY-MM-DD"));
          if (date_index == -1){
            courses_date_list.push(moment(curr_date).format("YYYY-MM-DD"));
            courses_array.push([]);
            date_index = courses_date_list.length -1;
          }
          courses_array[date_index].push([curr_start_datetime,curr_end_datetime,duration_seconds,activity_type_list,days_of_week]);
        }//end if
          curr_date = moment(curr_date).add(1, 'days');
      }//end while
    })//end for each object

    return [courses_date_list,courses_array];
  }//end courseObj_to_courseArr

  function instancesArray_to_coursesInstancesArrOLD(instances_array,courses_array){
    //retire
    var course_instance_array = Array(courses_array.length); // arr[course_instances[ins,ins],course_instances[ins]...]
    course_instance_array.fill([]);

    instances_array.forEach(function(value,index) {
      //instance = [mac_id,instance_start_date_time,time_spent]
      var time_index;
      var this_start = moment(value[1]);
      var this_end = this_start.clone().add(value[2], 'seconds');

      courses_array.forEach(function(course,course_index){
        //course[start_datetime,end_datetime,duration_seconds,activity_type_arr,days_of_week]

        var course_start = moment(course[0]);
        var course_end = moment(course[1]);
        if(!(course_end.isBefore(this_start) || this_end.isBefore(course_start))){
          course_instance_array[course_index].push(value);
        }//end if
      })//end for each course
    })//end forEach instance
    return course_instance_array;
  }//end func instancesArray_to_coursesInstancesArrOLD

  function insArray_to_coursesInsArr(instances_array,courses_array){
    /*instance = {
      device_id:"c074ab8a97a5"
      end_timestamp:"2017-11-28T13:48:19"
      resident_display_name: "Ali bin HUSSAIN"
      resident_index: "MP0012"
      resident_profile_picture: null
      start_timestamp: "2017-11-28T13:47:34"
      time_spent_min: 0
      time_spent_sec: 45
    */
    var course_ins_array = Array(courses_array.length); // arr[course_instances[ins,ins],course_instances[ins]...]
    course_ins_array.fill([]);

    instances_array.forEach(function(value,index) {
      var time_index;
      var this_start = moment(value.start_timestamp);
      var this_end = moment(value.end_timestamp);

      courses_array.forEach(function(course,course_index){
        //course[start_datetime,end_datetime,duration_seconds,activity_type_arr,days_of_week]

        var course_start = moment(course[0]);
        var course_end = moment(course[1]);
        if(!(course_end.isBefore(this_start) || this_end.isBefore(course_start))){
          course_ins_array[course_index].push(value);
        }//end if
      })//end for each course
    })//end forEach instance

    return course_ins_array;

  }///insArray_to_coursesInsArr

  function uniqueId_from_instanceArrOLD(instances_array){
    //retire
    var unique_id_list = [];
    //instance = [mac_id,instance_start_date_time,time_spent]

    instances_array.forEach(function(value){
      var curr_id =  value[0];
      if(unique_id_list.indexOf(curr_id)==-1){
        unique_id_list.push(curr_id);
      }//end if
    })//for each instance
    return unique_id_list;
  }//end func uniqueId_from_instanceArrOLD

  function uniqueId_from_instanceArr(instances_array){
    var unique_id_list = [];
    /*instance = {
      device_id:"c074ab8a97a5"
      end_timestamp:"2017-11-28T13:48:19"
      resident_display_name: "Ali bin HUSSAIN"
      resident_index: "MP0012"
      resident_profile_picture: null
      start_timestamp: "2017-11-28T13:47:34"
      time_spent_min: 0
      time_spent_sec: 45
    */

    instances_array.forEach(function(value){
      var curr_id =  value.device_id;
      if(unique_id_list.indexOf(curr_id)==-1){
        unique_id_list.push(curr_id);
      }//end if
    })//for each instance
    return unique_id_list;
  }//end func uniqueId_from_instanceArr

  /********************
    BUTTON FUNCTIONS
  *********************/
  vm.generateDataPerson = generateDataPerson;
  vm.generateDataCourses = generateDataCourses;

  function generateDataPerson(){
    //console.log(vm.selectedCenter +"\n"+ vm.selectedStartDate_person +"\n"+ vm.selectedEndDate_person);
    callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
    //console.log("updating person data");
    //console.log("disabled for now");
  }

  function generateDataCourses(){
    //console.log("updating courses data");
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

  function getAllCenterAttendanceInterval (project_prefix, center_code_name, start_datetime, end_datetime) {
    var _defer = $q.defer();
    HService.getAllCenterAttendanceInterval(project_prefix, center_code_name, start_datetime, end_datetime, function (result) {
      if (result) {
        _defer.resolve(result);
      } else {
        _defer.reject();
      }
    });
    return _defer.promise;
  }

  function getCenterActivities (project_prefix, center_code_name, start_date, end_date) {
    var _defer = $q.defer();
    HService.getCenterActivities(project_prefix, center_code_name, start_date, end_date, function (result) {
      if (result) {
        _defer.resolve(result);
      } else {
        _defer.reject();
      }
    });
    return _defer.promise;
  }

  function getAllCenters (project_prefix, page_size) {
    var _defer = $q.defer();
    HService.getAllCenters(project_prefix, page_size, function (result) {
      if (result) {
        _defer.resolve(result)
      } else {
        _defer.reject();
      }
    });
        return _defer.promise;
  }
  function getAllResidents (project_prefix, page_size) {
    var _defer = $q.defer();
    HService.getAllResidents(project_prefix, page_size, function (result) {
        if (result) {
            _defer.resolve(result)
        } else {
            _defer.reject();
        }
    });
    return _defer.promise;
  }

  /***********************
        OVERVIEW PAGE
  ***********************/

  vm.time_treshold = 600;

  function generateDataForOverview (json_result){
    //console.log(vm.display.courses)
    if(json_result.results.length > 0){
      json_result.results.forEach(function(value, index){
        var index = value.device_id.indexOf("-") + 1
        value.resident_device = value.device_id.substring(index);
        value.gw_date = moment(value.gw_timestamp).format("YYYY-MM-DD")
        value.gw_time = moment(value.gw_timestamp).format("HH-mm-ss")
        value.timestamp = new Date(value.gw_timestamp);
        return value;
      })

      var group_by_result = groupBy(json_result.results, function(item){ return [item.resident_device, item.gw_date] });
      //console.log(group_by_result)

      var results = [], g=[], d=0;
      group_by_result.forEach(function(arr, index){
        arr.sort(compareDates);

        var current_threshold = moment(arr[0].timestamp).add(10, 'minutes')
        for(arr_length = arr.length, i = 0; i < arr_length; i++){
          var current_timestamp = moment(arr[i].timestamp);
          if(current_timestamp.isAfter(current_threshold)){
            g[0].duration = (g.length == 1) ? vm.time_treshold :  moment(g[g.length-1].timestamp).diff(moment(g[0].timestamp), "seconds", true ) + vm.time_treshold;
            g[0].counts = g.length;
            results.push(g[0]);
            g = [];
          }
          g.push(arr[i]);
          current_threshold = moment(arr[i].timestamp).add(10, 'minutes')
        }

        g[0].duration = (g.length == 1) ? vm.time_treshold :  moment(g[g.length-1].timestamp).diff(moment(g[0].timestamp), "seconds", true ) + vm.time_treshold;
        g[0].counts = g.length;
        results.push(g[0]);  // include last group otherwise unpushed
        g = [];
      });

      //console.log(results)
      var ndx = crossfilter(results)

    }
  }

  function compareDates(a,b){ return (+a.timestamp)-(+b.timestamp); }
  function groupBy( array , f ){
    var groups = {};
    array.forEach( function( o ){
      var group = JSON.stringify( f(o) );
      groups[group] = groups[group] || [];
      groups[group].push( o );
    });
    return Object.keys(groups).map( function( group ){
      return groups[group];
    })
  }

  /********************************
       END OF  OVERVIEW PAGE
  ********************************/

})//end controller


//seperate data by day

  /*vm.dayHourHeatmapData = [
{
  "day": 1,
  "hour":	1,
  "value": 16
},
{
  "day": 1,
  "hour": 2,
  "value": 20
},
{
  "day": 1,
  "hour": 3,
  "value": 0
},
{
  "day": 1,
  "hour": 4,
  "value": 0
},
{
  "day": 1,
  "hour": 5,
  "value": 0
},
{
  "day": 1,
  "hour": 6,
  "value": 2
},
{
  "day": 1,
  "hour": 7,
  "value": 0
},
{
  "day": 1,
  "hour": 8,
  "value": 9
},
{
  "day": 1,
  "hour": 9,
  "value": 25
},
{
  "day": 1,
  "hour": 10,
  "value": 9
},
{
  "day": 1,
  "hour": 11,
  "value": 25
},
{
  "day": 1,
  "hour": 12,
  "value": 25
},
{
  "day": 1,
  "hour": 13,
  "value": 25
},
{
  "day": 1,
  "hour": 14,
  "value": 5
},
{
  "day": 1,
  "hour": 15,
  "value": 2
},
{
  "day": 1,
  "hour": 16,
  "value": 13
},
{
  "day": 1,
  "hour": 17,
  "value": 2
},
{
  "day": 1,
  "hour": 18,
  "value": 2
},
{
  "day": 1,
  "hour": 19,
  "value": 18
},
{
  "day": 1,
  "hour": 20,
  "value": 12
},
{
  "day": 1,
  "hour": 21,
  "value": 2
},
{
  "day": 1,
  "hour": 22,
  "value": 8
},
{
  "day": 1,
  "hour": 23,
  "value": 18
},
{
  "day": 1,
  "hour": 24,
  "value": 18
},
{
  "day": 1,
  "hour": 25,
  "value": 10
},
{
  "day": 2,
  "hour":	1,
  "value": 16
},
{
  "day": 2,
  "hour": 2,
  "value": 20
},
{
  "day": 2,
  "hour": 3,
  "value": 0
},
{
  "day": 2,
  "hour": 4,
  "value": 0
},
{
  "day": 2,
  "hour": 5,
  "value": 0
},
{
  "day": 2,
  "hour": 6,
  "value": 2
},
{
  "day": 2,
  "hour": 7,
  "value": 0
},
{
  "day": 2,
  "hour": 8,
  "value": 9
},
{
  "day": 2,
  "hour": 9,
  "value": 25
},
{
  "day": 2,
  "hour": 10,
  "value": 9
},
{
  "day": 2,
  "hour": 11,
  "value": 25
},
{
  "day": 2,
  "hour": 12,
  "value": 25
},
{
  "day": 2,
  "hour": 13,
  "value": 25
},
{
  "day": 2,
  "hour": 14,
  "value": 5
},
{
  "day": 2,
  "hour": 15,
  "value": 2
},
{
  "day": 2,
  "hour": 16,
  "value": 13
},
{
  "day": 2,
  "hour": 17,
  "value": 2
},
{
  "day": 2,
  "hour": 18,
  "value": 2
},
{
  "day": 2,
  "hour": 19,
  "value": 18
},
{
  "day": 2,
  "hour": 20,
  "value": 12
},
{
  "day": 2,
  "hour": 21,
  "value": 2
},
{
  "day": 2,
  "hour": 22,
  "value": 8
},
{
  "day": 2,
  "hour": 23,
  "value": 18
},
{
  "day": 2,
  "hour": 24,
  "value": 18
},
{
  "day": 2,
  "hour": 25,
  "value": 10
},
{
  "day": 3,
  "hour":	1,
  "value": 16
},
{
  "day": 3,
  "hour": 2,
  "value": 20
},
{
  "day": 3,
  "hour": 3,
  "value": 0
},
{
  "day": 3,
  "hour": 4,
  "value": 0
},
{
  "day": 3,
  "hour": 5,
  "value": 0
},
{
  "day": 3,
  "hour": 6,
  "value": 2
},
{
  "day": 3,
  "hour": 7,
  "value": 0
},
{
  "day": 3,
  "hour": 8,
  "value": 9
},
{
  "day": 3,
  "hour": 9,
  "value": 25
},
{
  "day": 3,
  "hour": 10,
  "value": 9
},
{
  "day": 3,
  "hour": 11,
  "value": 25
},
{
  "day": 3,
  "hour": 12,
  "value": 25
},
{
  "day": 3,
  "hour": 13,
  "value": 25
},
{
  "day": 3,
  "hour": 14,
  "value": 5
},
{
  "day": 3,
  "hour": 15,
  "value": 2
},
{
  "day": 3,
  "hour": 16,
  "value": 13
},
{
  "day": 3,
  "hour": 17,
  "value": 2
},
{
  "day": 3,
  "hour": 18,
  "value": 2
},
{
  "day": 3,
  "hour": 19,
  "value": 18
},
{
  "day": 3,
  "hour": 20,
  "value": 12
},
{
  "day": 3,
  "hour": 21,
  "value": 2
},
{
  "day": 3,
  "hour": 22,
  "value": 8
},
{
  "day": 3,
  "hour": 23,
  "value": 18
},
{
  "day": 3,
  "hour": 24,
  "value": 18
},
{
  "day": 3,
  "hour": 25,
  "value": 10
},
{
  "day": 4,
  "hour":	1,
  "value": 16
},
{
  "day": 4,
  "hour": 2,
  "value": 20
},
{
  "day": 4,
  "hour": 3,
  "value": 0
},
{
  "day": 4,
  "hour": 4,
  "value": 0
},
{
  "day": 4,
  "hour": 5,
  "value": 0
},
{
  "day": 4,
  "hour": 6,
  "value": 2
},
{
  "day": 4,
  "hour": 7,
  "value": 0
},
{
  "day": 4,
  "hour": 8,
  "value": 9
},
{
  "day": 4,
  "hour": 9,
  "value": 25
},
{
  "day": 4,
  "hour": 10,
  "value": 9
},
{
  "day": 4,
  "hour": 11,
  "value": 25
},
{
  "day": 4,
  "hour": 12,
  "value": 25
},
{
  "day": 4,
  "hour": 13,
  "value": 25
},
{
  "day": 4,
  "hour": 14,
  "value": 5
},
{
  "day": 4,
  "hour": 15,
  "value": 2
},
{
  "day": 4,
  "hour": 16,
  "value": 13
},
{
  "day": 4,
  "hour": 17,
  "value": 2
},
{
  "day": 4,
  "hour": 18,
  "value": 2
},
{
  "day": 4,
  "hour": 19,
  "value": 18
},
{
  "day": 4,
  "hour": 20,
  "value": 12
},
{
  "day": 4,
  "hour": 21,
  "value": 2
},
{
  "day": 4,
  "hour": 22,
  "value": 8
},
{
  "day": 4,
  "hour": 23,
  "value": 18
},
{
  "day": 4,
  "hour": 24,
  "value": 18
},
{
  "day": 4,
  "hour": 25,
  "value": 10
},
{
  "day": 5,
  "hour":	1,
  "value": 16
},
{
  "day": 5,
  "hour": 2,
  "value": 20
},
{
  "day": 5,
  "hour": 3,
  "value": 0
},
{
  "day": 5,
  "hour": 4,
  "value": 0
},
{
  "day": 5,
  "hour": 5,
  "value": 0
},
{
  "day": 5,
  "hour": 6,
  "value": 2
},
{
  "day": 5,
  "hour": 7,
  "value": 0
},
{
  "day": 5,
  "hour": 8,
  "value": 9
},
{
  "day": 5,
  "hour": 9,
  "value": 25
},
{
  "day": 5,
  "hour": 10,
  "value": 9
},
{
  "day": 5,
  "hour": 11,
  "value": 25
},
{
  "day": 5,
  "hour": 12,
  "value": 25
},
{
  "day": 5,
  "hour": 13,
  "value": 25
},
{
  "day": 5,
  "hour": 14,
  "value": 5
},
{
  "day": 5,
  "hour": 15,
  "value": 2
},
{
  "day": 5,
  "hour": 16,
  "value": 13
},
{
  "day": 5,
  "hour": 17,
  "value": 2
},
{
  "day": 5,
  "hour": 18,
  "value": 2
},
{
  "day": 5,
  "hour": 19,
  "value": 18
},
{
  "day": 5,
  "hour": 20,
  "value": 12
},
{
  "day": 5,
  "hour": 21,
  "value": 2
},
{
  "day": 5,
  "hour": 22,
  "value": 8
},
{
  "day": 5,
  "hour": 23,
  "value": 18
},
{
  "day": 5,
  "hour": 24,
  "value": 18
},
{
  "day": 5,
  "hour": 25,
  "value": 10
},
{
  "day": 6,
  "hour":	1,
  "value": 16
},
{
  "day": 6,
  "hour": 2,
  "value": 20
},
{
  "day": 6,
  "hour": 3,
  "value": 0
},
{
  "day": 6,
  "hour": 4,
  "value": 0
},
{
  "day": 6,
  "hour": 5,
  "value": 0
},
{
  "day": 6,
  "hour": 6,
  "value": 2
},
{
  "day": 6,
  "hour": 7,
  "value": 0
},
{
  "day": 6,
  "hour": 8,
  "value": 9
},
{
  "day": 6,
  "hour": 9,
  "value": 25
},
{
  "day": 6,
  "hour": 10,
  "value": 9
},
{
  "day": 6,
  "hour": 11,
  "value": 25
},
{
  "day": 6,
  "hour": 12,
  "value": 25
},
{
  "day": 6,
  "hour": 13,
  "value": 25
},
{
  "day": 6,
  "hour": 14,
  "value": 5
},
{
  "day": 6,
  "hour": 15,
  "value": 2
},
{
  "day": 6,
  "hour": 16,
  "value": 13
},
{
  "day": 6,
  "hour": 17,
  "value": 2
},
{
  "day": 6,
  "hour": 18,
  "value": 2
},
{
  "day": 6,
  "hour": 19,
  "value": 18
},
{
  "day": 6,
  "hour": 20,
  "value": 12
},
{
  "day": 6,
  "hour": 21,
  "value": 2
},
{
  "day": 6,
  "hour": 22,
  "value": 8
},
{
  "day": 6,
  "hour": 23,
  "value": 18
},
{
  "day": 6,
  "hour": 24,
  "value": 18
},
{
  "day": 6,
  "hour": 25,
  "value": 10
},
{
  "day": 7,
  "hour":	1,
  "value": 16
},
{
  "day": 7,
  "hour": 2,
  "value": 20
},
{
  "day": 7,
  "hour": 3,
  "value": 0
},
{
  "day": 7,
  "hour": 4,
  "value": 0
},
{
  "day": 7,
  "hour": 5,
  "value": 0
},
{
  "day": 7,
  "hour": 6,
  "value": 2
},
{
  "day": 7,
  "hour": 7,
  "value": 0
},
{
  "day": 7,
  "hour": 8,
  "value": 9
},
{
  "day": 7,
  "hour": 9,
  "value": 25
},
{
  "day": 7,
  "hour": 10,
  "value": 9
},
{
  "day": 7,
  "hour": 11,
  "value": 25
},
{
  "day": 7,
  "hour": 12,
  "value": 25
},
{
  "day": 7,
  "hour": 13,
  "value": 25
},
{
  "day": 7,
  "hour": 14,
  "value": 5
},
{
  "day": 7,
  "hour": 15,
  "value": 2
},
{
  "day": 7,
  "hour": 16,
  "value": 13
},
{
  "day": 7,
  "hour": 17,
  "value": 2
},
{
  "day": 7,
  "hour": 18,
  "value": 2
},
{
  "day": 7,
  "hour": 19,
  "value": 18
},
{
  "day": 7,
  "hour": 20,
  "value": 12
},
{
  "day": 7,
  "hour": 21,
  "value": 2
},
{
  "day": 7,
  "hour": 22,
  "value": 8
},
{
  "day": 7,
  "hour": 23,
  "value": 18
},
{
  "day": 7,
  "hour": 24,
  "value": 18
},
{
  "day": 7,
  "hour": 25,
  "value": 10
}
];
/*
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

  /*vm.responsiveHorizontalBarData = [
    {
      "category":"Cadas1",
      "num": 20
    },{
      "category":"Cat2",
      "num": 23
    },{
      "category":"Cat3",
      "num": 19
    },{
      "category":"Cat4",
      "num": 7
    },{
      "category":"Cat5",
      "num": 35
    }
  ]
*/
