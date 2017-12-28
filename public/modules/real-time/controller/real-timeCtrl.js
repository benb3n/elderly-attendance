angular.module('RealTimeCtrl', [])
.controller('RealTimeController', function ($scope, $q, $timeout, RTService) { 
    var vm = this;
    vm.api = {
        project: 'mp',
        all_device_count: 1000,
        latest_sensor_reading_count: 1000
    }


    $(document).ready(function() {
        // TABS
        $('ul.tabs').tabs();
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            });

        $('select').material_select();
    });

    /*************** 
        WATCHERS
    ****************/
    $scope.$watch(function() {
        return vm.selectedCenter;
    },function(newCenter, oldCenter) {
        if(newCenter != oldCenter) {
            //console.log(newCenter)
            vm.selectedCenter = newCenter;
            generateRealTimeData();
        }
    });
    $scope.$watch(function() {
        return vm.selectedStatus;
    },function(newStatus, oldStatus) {
        if(newStatus != oldStatus) {
            applyFilters();    
        }
    });
    $scope.getkeys = function(event){
        applyFilters();    
    }

    /********************* 
        SEARCH FILTERS
    **********************/
    function applyFilters(){
        var result = []
        if(vm.display.elderly_attendance_backup.length > 0){
            if(typeof vm.searchname == 'undefined' ){
                result = angular.copy(vm.display.elderly_attendance_backup);
            }else{
                result = applySearchFilter();
            }   
            result = angular.copy(applyEventTypeFilter(result));
        }
        vm.display.elderly_attendance = angular.copy(result);
    }
    function applySearchFilter(data){
        if(vm.searchname == ""){
            return vm.display.elderly_attendance_backup;
        }else{
            return filterByAttr("name", vm.searchname, vm.display.elderly_attendance_backup);
        }
    }
    function applyEventTypeFilter(data){
        var result = [];
        vm.selectedStatus.forEach(function(value, index) {
            result = result.concat(filterByAttr("status", value, data));
        });
        return result;
      }
    function filterByAttr(attr, value, data) {
        var value = value.toLowerCase();
        return $.grep(data, function(n, i) {
          return n[attr].toLowerCase().indexOf(value) != -1;
        });
    }
    


    
    initController();
    function initController(){
        vm.loading = true;
        vm.data = {};
        vm.display = {
            elderly_attendance: [],
            elderly_attendance_backup: [],
            status: [{name:"Present", value:"Present"}, {name:"Absent", value:"NA"}]
        };
        vm.status = {
            no_data:false
        };

        vm.selectedStatus = ['Present', 'NA']
        vm.searchname = "";
        
        
        generateDataForInit();
    }

  
    function generateDataForInit () {
        $q.when()
        .then(function(){
            return getAllDevices(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            vm.data.all_devices = result;
            vm.data.all_devices_pairs = {};
            result.results.forEach(function(value, index){
                if(value.device_id.indexOf("-") != -1 && value.device_type == "Beacon"){
                    var index = value.device_id.indexOf("-") + 1;
                    var id = value.device_id.substring(index)
                    vm.data.all_devices_pairs[id] = value;
                }
            })
            
            vm.display.centers = [
                {name:"6901", value:6901},
                {name:"6902", value:6902},
                {name:"6903", value:6903}
            ]
            vm.display.courses = [
                {name:"Mon Phyiscal Activites", start_time:"09:30", end_time:"10:30", value:1},
                {name:"Tue Phyiscal Activites", start_time:"09:30", end_time:"10:30", value:2},
                {name:"Wed Phyiscal Activites", start_time:"13:30", end_time:"14:30", value:3},
                {name:"Thu Phyiscal Activites", start_time:"09:30", end_time:"10:30", value:4},
                {name:"Fri Phyiscal Activites", start_time:"09:30", end_time:"10:30", value:5},

                {name:"Mon Language Lessons", start_time:"10:30", end_time:"12:30", value:6},
                {name:"Tue Language Lessons", start_time:"10:30", end_time:"12:30", value:7},
                {name:"Thu Language Lessons", start_time:"14:00", end_time:"15:30", value:8},
                {name:"Fri Language Lessons", start_time:"109:30", end_time:"12:30", value:9},

                {name:"Wed Art & Music", start_time:"09:30", end_time:"10:30", value:10},
                {name:"Fri Art & Music", start_time:"15:30", end_time:"16:30", value:11},

                {name:"Mon Bingo", start_time:"14:30", end_time:"16:00", value:12},

                {name:"Tue Karaoke", start_time:"14:30", end_time:"16:00", value:13},
                {name:"Thu Karaoke", start_time:"13:00", end_time:"16:30", value:14},
                {name:"Wed TCM", start_time:"14:30", end_time:"17:00", value:15},
                {name:"Fri Movie", start_time:"14:30", end_time:"15:30", value:16}
            ]

            vm.selectedCenter = "6901";
            $timeout(function () {
                $('select').material_select()
            });



            return generateRealTimeData();  
        })  
        .then(function(){
            vm.loading = false;
        })

        
    }

    function generateRealTimeData(){
        $q.when()
        .then(function(){
            var end_datetime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            var start_datetime = moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            return getSensorReadings(vm.selectedCenter, start_datetime, end_datetime, vm.api.latest_sensor_reading_count);
        })
        .then(function(result){
            console.log(result)
            
            if(result.results.length == 0){
                vm.status.no_data = true;
            }else{
                vm.status.no_data = false;
                vm.display.elderly_attendance = [];
                vm.display.elderly_attendance_backup = [];
                result.results.forEach(function(value, index){
                    if(value.reading_type == "beacon"){
                        var index = value.device_id.indexOf("-") + 1;
                        var id = value.device_id.substring(index);
                        vm.display.elderly_attendance.push({
                            resident_id: vm.data.all_devices_pairs[id].id,
                            name: vm.data.all_devices_pairs[id].resident_list,
                            image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg",
                            status: "Present"
                        })
                    }
                })
                vm.display.elderly_attendance_backup = angular.copy(vm.display.elderly_attendance);
            
            }

            

        })
        
    }
    

    
    /******************** 
        WEB SERVICES
    *********************/
    vm.allDevice = [];
    function getAllDevices (project_prefix, page_size) { //url, _defer, overall
        var _defer = $q.defer();
        /*if(typeof _defer == 'undefined'){
            var _defer = $q.defer();
            var overall = [];
        }*/
        RTService.getAllDevices(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
                /*if(result.next != null){
                    overall = overall.concat(result.results)
                    getAllDevices(project_prefix, result.next, _defer, overall) 
                }else{
                    overall = overall.concat(result.results)
                    _defer.resolve(overall);
                }*/
            } else {
                _defer.reject();
            }
        });
        
        return _defer.promise;
    }
    function getSensorReadings (gw_device, start_datetime, end_datetime, page_size) {
        var _defer = $q.defer();
        RTService.getSensorReadings(gw_device, start_datetime, end_datetime, page_size, function (result) {
            if (result) {
                _defer.resolve(result);
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    /******************** 
        HELPERS METHOD
    *********************/

})