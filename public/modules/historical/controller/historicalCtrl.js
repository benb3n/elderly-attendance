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
      callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
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
      console.log("start date changed!");
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
    //COURSE DETAILS
    vm.display = {
      courses: [
      {date:"2017-11-20", day:"Monday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"1"},
      {date:"2017-11-20", day:"Monday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"2"},
      {date:"2017-11-20", day:"Monday",course_type:"Bingo", course_name:"bingo", start_time:"2:30pm", end_time:"4:00pm", value:"3"},
      {date:"2017-11-21", day:"Tuesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"4"},
      {date:"2017-11-21", day:"Tuesday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"5"},
      {date:"2017-11-21", day:"Tuesday",course_type:"Karaoke", course_name:"Karaoke", start_time:"2:30pm", end_time:"4:00pm", value:"6"},
      {date:"2017-11-22", day:"Wednesday",course_type:"Arts & Music", course_name:"jazz", start_time:"9:30am", end_time:"10:30am", value:"7"},
      {date:"2017-11-22", day:"Wednesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"1:30pm", end_time:"2:30pm", value:"8"},
      {date:"2017-11-22", day:"Wednesday",course_type:"TCM", course_name:"tcm", start_time:"2:30pm", end_time:"5:00pm", value:"9"},
      {date:"2017-11-23", day:"Thursday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"10"},
      {date:"2017-11-23", day:"Thursday",course_type:"Language Lessons", course_name:"english", start_time:"2:00pm", end_time:"3:30pm", value:"11"},
      {date:"2017-11-23", day:"Thursday",course_type:"Karaoke", course_name:"Karaoke", start_time:"1:00pm", end_time:"4:30pm", value:"12"},
      {date:"2017-11-24", day:"Friday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"13"},
      {date:"2017-11-24", day:"Friday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"14"},
      {date:"2017-11-24", day:"Friday",course_type:"Movie", course_name:"movie", start_time:"2:30pm", end_time:"3:30pm", value:"15"},
      {date:"2017-11-24", day:"Friday",course_type:"Arts & Music", course_name:"jazz", start_time:"3:30pm", end_time:"4:30pm", value:"16"},
      {date:"2017-11-27", day:"Monday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"17"},
      {date:"2017-11-27", day:"Monday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"18"},
      {date:"2017-11-27", day:"Monday",course_type:"Bingo", course_name:"bingo", start_time:"2:30pm", end_time:"4:00pm", value:"19"},
      {date:"2017-11-28", day:"Tuesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"20"},
      {date:"2017-11-28", day:"Tuesday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"21"},
      {date:"2017-11-28", day:"Tuesday",course_type:"Karaoke", course_name:"Karaoke", start_time:"2:30pm", end_time:"4:00pm", value:"22"},
      {date:"2017-11-29", day:"Wednesday",course_type:"Arts & Music", course_name:"jazz", start_time:"9:30am", end_time:"10:30am", value:"23"},
      {date:"2017-11-29", day:"Wednesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"1:30pm", end_time:"2:30pm", value:"24"},
      {date:"2017-11-29", day:"Wednesday",course_type:"TCM", course_name:"tcm", start_time:"2:30pm", end_time:"5:00pm", value:"25"},
      {date:"2017-11-30", day:"Thursday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"26"},
      {date:"2017-11-30", day:"Thursday",course_type:"Language Lessons", course_name:"english", start_time:"2:00pm", end_time:"3:30pm", value:"27"},
      {date:"2017-11-30", day:"Thursday",course_type:"Karaoke", course_name:"Karaoke", start_time:"1:00pm", end_time:"4:30pm", value:"28"},
      {date:"2017-12-01", day:"Friday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"29"},
      {date:"2017-12-01", day:"Friday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"30"},
      {date:"2017-12-01", day:"Friday",course_type:"Movie", course_name:"movie", start_time:"2:30pm", end_time:"3:30pm", value:"31"},
      {date:"2017-12-01", day:"Friday",course_type:"Arts & Music", course_name:"jazz", start_time:"3:30pm", end_time:"4:30pm", value:"32"},
      {date:"2017-12-04", day:"Monday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"33"},
      {date:"2017-12-04", day:"Monday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"34"},
      {date:"2017-12-04", day:"Monday",course_type:"Bingo", course_name:"bingo", start_time:"2:30pm", end_time:"4:00pm", value:"35"},
      {date:"2017-12-05", day:"Tuesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"36"},
      {date:"2017-12-05", day:"Tuesday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"37"},
      {date:"2017-12-05", day:"Tuesday",course_type:"Karaoke", course_name:"Karaoke", start_time:"2:30pm", end_time:"4:00pm", value:"38"},
      {date:"2017-12-06", day:"Wednesday",course_type:"Arts & Music", course_name:"jazz", start_time:"9:30am", end_time:"10:30am", value:"39"},
      {date:"2017-12-06", day:"Wednesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"1:30pm", end_time:"2:30pm", value:"40"},
      {date:"2017-12-06", day:"Wednesday",course_type:"TCM", course_name:"tcm", start_time:"2:30pm", end_time:"5:00pm", value:"41"},
      {date:"2017-12-07", day:"Thursday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"42"},
      {date:"2017-12-07", day:"Thursday",course_type:"Language Lessons", course_name:"english", start_time:"2:00pm", end_time:"3:30pm", value:"43"},
      {date:"2017-12-07", day:"Thursday",course_type:"Karaoke", course_name:"Karaoke", start_time:"1:00pm", end_time:"4:30pm", value:"44"},
      {date:"2017-12-08", day:"Friday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"45"},
      {date:"2017-12-08", day:"Friday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"46"},
      {date:"2017-12-08", day:"Friday",course_type:"Movie", course_name:"movie", start_time:"2:30pm", end_time:"3:30pm", value:"47"},
      {date:"2017-12-08", day:"Friday",course_type:"Arts & Music", course_name:"jazz", start_time:"3:30pm", end_time:"4:30pm", value:"48"},
      {date:"2017-12-11", day:"Monday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"49"},
      {date:"2017-12-11", day:"Monday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"50"},
      {date:"2017-12-11", day:"Monday",course_type:"Bingo", course_name:"bingo", start_time:"2:30pm", end_time:"4:00pm", value:"51"},
      {date:"2017-12-12", day:"Tuesday",course_type:"Physical Exercise", course_name:"tai chi", start_time:"9:30am", end_time:"10:30am", value:"52"},
      {date:"2017-12-12", day:"Tuesday",course_type:"Language Lessons", course_name:"english", start_time:"10:30am", end_time:"12:30pm", value:"53"},
      {date:"2017-12-12", day:"Tuesday",course_type:"Karaoke", course_name:"Karaoke", start_time:"2:30pm", end_time:"4:00pm", value:"54"}
    ]}

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
    vm.barData = [
        {
            key: "Cumulative Return",
            values: [
                {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
        }
      ]; //end data
    vm.responsiveLineChartData = [
      {"date": '2008-11', "num" : 7.8},
{"date": '2008-12', "num" : 8.3},
{"date": '2009-01', "num" : 8.7},
{"date": '2009-02', "num" : 8.9},
{"date": '2009-03', "num" : 9.4},
{"date": '2009-04', "num" : 9.5},
{"date": '2009-05', "num" : 9.5},
{"date": '2009-06', "num" : 9.6},
{"date": '2009-07', "num" : 9.8},
{"date": '2009-08', "num" : 10},
{"date": '2009-09', "num" : 9.9},
{"date": '2009-10', "num" : 9.9},
{"date": '2009-11', "num" : 9.7},
{"date": '2009-12', "num" : 9.8},
{"date": '2010-01', "num" : 9.8},
{"date": '2010-02', "num" : 9.9},
{"date": '2010-03', "num" : 9.6},
{"date": '2010-04', "num" : 9.4},
{"date": '2010-05', "num" : 9.5},
{"date": '2010-06', "num" : 9.6},
{"date": '2010-07', "num" : 9.5},
{"date": '2010-08', "num" : 9.5},
{"date": '2010-09', "num" : 9.8},
{"date": '2010-10', "num" : 9.4},
{"date": '2010-11', "num" : 9.1},
{"date": '2010-12', "num" : 9},
{"date": '2011-01', "num" : 8.9},
{"date": '2011-02', "num" : 9},
{"date": '2011-03', "num" : 9}

    ];

    vm.selectedCenter = 6901;
    vm.selectedEndDate_courses = new Date('30 November 2017');
    vm.selectedStartDate_courses = new Date('1 November 2017');

    callSensorReadings(vm.selectedCenter,vm.selectedStartDate_person,vm.selectedEndDate_person);
    callSensorReadings(vm.selectedCenter,vm.selectedStartDate_courses,vm.selectedEndDate_courses);
  }//end initController

  function callSensorReadings (center, start_date_time, end_date_time){
    start_date_time =moment(start_date_time).format('YYYY-MM-DD') + 'T00:00:00'
    end_date_time =moment(end_date_time).format('YYYY-MM-DD') + 'T00:00:00'

    $q.when()
      .then(function(){
        //console.log(center +"\n"+ start_date_time +"\n"+ end_date_time);
          return getSensorReadings(center, start_date_time, end_date_time, 500 );
      })
      .then(function(result){
          //update_heatmap_chart(result)
          console.log(result);
          //update_most_active_chart(result);
          //update_avg_week_heatmap_chart(result);
          update_course_month_chart(result,"language");
      })//end when.then
  }//end callSensorReadings

  /********************
        CHARTS
  *********************/
  function update_heatmap_chart(result){
    if (result.results.length == 0){
      document.getElementById("calendar_error").style.visibility='visible';
    }else{
      document.getElementById("calendar_error").style.visibility='hidden';

      var temp_arr = objArr_to_dateObjArr(result.results);
      var date_list = temp_arr[0];//array that stores all the unique dates
      var date_obj_array = temp_arr[1];//array that stores arrays of obj, each array contains all objects of a particular date

      //split date obj by mac_id
      var date_mac_obj_array = []; //array of mac_id[obj,obj..] for corresponding date
      date_obj_array.forEach(function(value){
        if (value.length==0){
          date_mac_obj_array.push([]);
        }else {
          date_mac_obj_array.push(objArr_to_macObjArr(value)[1]);
        };
      })//end of for each

      //get instances for each date
      var date_time_array = []; //[date_total_time, date_total_time...]
      var date_instances_array = []; // [date[instance,instance,instance],date[instance,instance]...]

      date_mac_obj_array.forEach(function(date_value,date_index){
        var instances_array = [];//instances for that date
        var total_time = 0; //total time for that date
        date_value.forEach(function(id_value){
          temp_arr = objArr_to_instances(id_value); //[total_time,instances_array]
          total_time += temp_arr[0]; //adding hours from that mac_id to total hours for that date
          instances_array = instances_array.concat(temp_arr[1]); //adding array of instances for that mac_id into instances_array
        })//end for each id
        date_time_array.push(total_time);
        date_instances_array.push(instances_array);
      })//end for each date

      //pushing into data
      var calendar_data = [];
      for(var i = 0 ; i<date_instances_array.length ; i++){
        calendar_data.push({
          "date": ""+ date_list[i],
          "total": date_time_array[i],
          "details": []//end details
        })//end push to calendar_data
      }//end for loop

      date_instances_array.forEach(function(date_value,date_index){
        date_value.forEach(function(value,index){
          calendar_data[date_index].details.push({
            "name": ""+ value[0],
            "date": ""+ value[1],
            "value": parseInt(value[2])
          })//end calendar_data push
        })//end forEach
      })//end forEach day_value
      vm.calendarheatmapdata=angular.copy(calendar_data);
    }//end else
  }//end func update_heatmap_chart

  function update_avg_week_heatmap_chart(result){

    var temp_arr = objArr_to_dateObjArr(result.results);
    var date_list = temp_arr[0];//array that stores all the unique dates
    var date_obj_array = temp_arr[1];//array that stores arrays of obj, each array contains all objects of a particular date

    //get instances of each day, instance[id,instance_start_date_time,time_spent]
    var date_instances_array = []; //array of instances for corresponding date
    date_obj_array.forEach(function(value){
      if (value.length==0){
        date_instances_array.push([]);
      }else {
        date_instances_array.push(objArr_to_instances(value)[1]);
      };
    })//end of for each

    //week_arr[7*hour_arr], contains hour_arr for that day of the week
    //hour_arr[25], counts number of unique mac_ids during in that slot
    var week_arr = [];
    for(i=0; i<7; i++){
      var hour_arr  = new Array(25);
      hour_arr.fill(0);
      week_arr.push(hour_arr);
    }

    //TODO: count number of each day of the week for chosen date range
    //ask if can use vm.selectedEndDate_courses etc
    var week_instances_count = new Array(7); //counts number of weeks the chosen dataset has of each day
    week_instances_count.fill(0);
    //vm.selectedStartDate_courses
    //console.log(vm.selectedEndDate_courses);

    //TODO:
    var time_comparison_arr = []; //to compare the number of people attending classes that start at specific times

    date_instances_array.forEach(function(value,index) {
      //check date
      var this_date = moment(date_list[index]);
      var day_index = moment(this_date).weekday(); //weekday returns 0-6 where 0 is Monday
      var time_arr = generate_time_array(this_date,8,20);

      value.forEach(function(instance_value){
        //instance = [mac_id,instance_start_date_time,time_spent]
        var time_index;
        var this_start = moment(instance_value[1]);
        var this_end = this_start.clone().add(instance_value[2], 'seconds');
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
          "value": value // /week_instances_count[day_index] //TODO
        })
      })//end for each hour
    })//end for each day

    vm.dayHourHeatmapData=angular.copy(weekly_activity_data);
    /*
    {
        key: "not averaged yet",
        values: [
            {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
    }*/
  }//end func update_avg_week_heatmap_chart

  function update_most_active_chart(result){
    if (result.results.length == 0){
      document.getElementById("active_error").style.visibility='visible';
    }else{
      document.getElementById("active_error").style.visibility='hidden';
    }

      //sort the data by mac ID
      var temp_arr = objArr_to_macObjArr(result.results);
      var mac_id_list = temp_arr[0];//array that stores all the unique ID
      var mac_obj_array = temp_arr[1];//array that stores arrays of obj, each array contains all objects of a particular mac id

      //var mac_time_list = [];//array that stores total time per corresponding mac id
      var time_data = [];

      //get timings of each mac_id and store in object
      mac_obj_array.forEach(function(value,index){
        var id_time = objArr_to_instances(value)[0] /(60*60);
        time_data.push({
            "category": ""+ mac_id_list[index],
            "num": id_time
        });
      });
      //sort objects by timing
      time_data.sort(compare_time_data);

      vm.mostActiveData = angular.copy(time_data);
      vm.responsiveHorizontalBarData = angular.copy(time_data);
  }//end update_most_active_chart function

  function update_course_month_chart(result,course_type){
    //get data related to course
    var course_result = {
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
            "activity_desc": "activity desc",
            "activity_type_list": "language",
            "start_date": "2017-10-30",
            "end_date": "2017-11-03",
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "repeat_params": {
                "days_of_week": [2,3,4]
              }
        }
      ]
    }//end obj

    var temp_arr = courseObj_to_courseArr(course_result.results,course_type);
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
    //arr[date[course[ins]],date[course[ins,ins]]...]

    temp_arr = objArr_to_dateObjArr(result.results);
    var date_obj_array = temp_arr[1];
    var date_list = temp_arr[0];
    console.log(result.results);
    console.log(courses_date_instances);
    console.log(date_obj_array);

    date_obj_array.forEach(function(date_value,date_index){
      var course_date_index = courses_date_list.indexOf(date_list[date_index]);
      if(course_date_index==-1) return; //no courses that date
      var focus_courses = courses_array[course_date_index];//courses in a specific date
      var instances_array = objArr_to_instances(date_value);//get instances for that date
      //course[curr_start_datetime,curr_end_datetime,duration_seconds,activity_type_list,days_of_week]

      courses_date_instances[course_date_index] = instancesArray_to_coursesInstancesArr(instances_array,focus_courses);
      console.log(courses_date_instances);

    })//end for each day
  /*
  todo: average out the activity?
  */
    var month_list = [];

    var curr_month = moment(courses_date_list[0]);
    var end_month = moment(courses_date_list[courses_date_list.length-1]);
    while(curr_month.isSameOrBefore(end_month)){
      month_list.push(moment(curr_month).format('YYYY-MM'));
      curr_month = moment(curr_month).add(1, 'month');
    }//end while


    var month_count = [month_list.length];
    month_count.fill(0);
    console.log(month_list);
    console.log(month_count);

    courses_date_instances.forEach(function(date_value,date_index){
      var this_month = moment(courses_date_list[date_index]).format('YYYY-MM');
      if (month_list.indexOf(this_month) == -1){
        console.log("error in update_course_month_chart");
      };//end if
      date_value.forEach(function(course_value){
        month_count[month_list.indexOf(this_month)] += uniqueId_from_instanceArr(course_value).length;
      })//for each course
    })//for each date

    //{"date": '2011-03', "num" : 9}
  }// end func update_course_month_chart

  function update_course_time_chart(result){
    //TODO:
  }// end func update_course_time_chart

  /********************
    REUSEABLE FUNCTIONS
  *********************/
  function generate_time_array(date,start_hour,end_hour){
    //create array of time with 30 min intervals for specific date
    var time_arr = [];
    var current = start_hour;
    var this_date = moment(date);
    while(current <= end_hour){
      time_arr.push(this_date.clone().hour(current).minute(0).second(0));
      time_arr.push(this_date.clone().hour(current).minute(30).second(0));
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

  function courseObj_to_courseArr(courseList_obj,course_type){
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

  function instancesArray_to_coursesInstancesArr(instances_array,courses_array){
    var course_instance_array = Array(courses_array.length); // arr[course_instances[ins,ins],course_instances[ins]...]
    course_instance_array.fill([]);

    instances_array.forEach(function(value,index) {
      //instance = [mac_id,instance_start_date_time,time_spent]
      var time_index;
      var this_start = moment(value[1]);
      var this_end = this_start.clone().add(value[2], 'seconds');

      courses_array.forEach(function(course,course_index){
        //course[start_datetime,end_datetime,duration_seconds,activity_type_arr,days_of_week]

        var course_start = course[0];
        var course_end = course[1];
        if(!(course_end.isBefore(this_start) || this_end.isBefore(course_start))){
          course_instance_array[course_index].push(value);
        }//end if
      })//end for each course
    })//end forEach instance
    return course_instance_array;
  }//end func instancesArray_to_coursesInstancesArr

  function uniqueId_from_instanceArr(instances_array){
    var unique_id_list = [];
    //instance = [mac_id,instance_start_date_time,time_spent]

    instances_array.forEach(function(value){
      var curr_id =  value[0];
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
    console.log("updating person data");
    //console.log("disabled for now");
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

})//end controller


/********************
    data formats
*********************/
  /*vm.calendarheatmapdata = [
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

  /*activity_array = [
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
    ["2:30pm","5:00pm","TCM"]
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
