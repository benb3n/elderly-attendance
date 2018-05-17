angular.module('RealTimeCtrl', [])
.controller('RealTimeController', function ($scope, $q, $timeout, $rootScope, RTService) {
    var vm = this;
    vm.api = {
        project: 3,
        project_prefix: 'SMU',
        center_code_name : 'smu-4048',
        all_activity_count: 5000,
        all_device_count: 3000,
        latest_sensor_reading_count: 1000,
        time_limit_threshold : 20
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
        $('.modal').modal();

    });

    /***************
        WATCHERS
    ****************/
    $scope.$watch(function() {
        return vm.selectedCenter;
    },function(newCenter, oldCenter) {
        if(newCenter != oldCenter) {
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
            result = applyEventTypeFilter(result);
        }
        result = Array.from(new Set(result));
        result.sort(compareCount);
        vm.display.elderly_attendance = angular.copy(result);
    }
    function applySearchFilter(data){
        if(vm.searchname == ""){
            return vm.display.elderly_attendance_backup;
        }else{
            return filterByAttr("display_name", vm.searchname, vm.display.elderly_attendance_backup);
        }
    }
    function applyEventTypeFilter(data){
        var result = [];
        vm.selectedStatus.forEach(function(value, index) {
            result = result.concat(filterByAttr("recent", value, data));
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
        vm.data = {
            all_residents: [],
            all_residents_by_resident_index: {},
            all_centers: [],
            all_centers_by_center_code: {},
            all_centers_activity: [],
            all_centers_activity_by_id: {},
            real_time_activity_reading: [],
            real_time_activity_reading_hash: {},
            elderly_attendance_hash: {}
        };
        vm.display = {
            centers: [],
            activity: [],
            elderly_attendance: [],
            elderly_attendance_backup: [],
            status: [{name:"Absent", value:"2"}, {name:"Present", value:"1"}, {name:"Present And Left", value:"0"}],
            update_modal:{}
        };
        vm.status = {
            no_data:false
        };
        vm.update = {};

        vm.selectedStatus = ['0', '1', '2']
        vm.searchname = "";


        generateDataForInit();
    }


    function generateDataForInit () {
        $q.when()
        .then(function(){
            return getAllResidents(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_residents = result;
            console.log("resident", result)
            result.results.forEach(function(value, index){
                vm.data.all_residents_by_resident_index[value.project_prefix + value.raw_index] = value;
            })
            return getAllCenters(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_centers = result;
            result.results.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.code_name] = value;
            })

            var project_prefix = JSON.parse(localStorage["projectprefix"]);
            vm.data.access_list_centers = project_prefix[0].code_name
            console.log("centers", vm.data.all_centers)
            vm.selectedCenter = vm.data.access_list_centers[0]
            vm.data.access_list_centers.forEach(function(value, index){
                vm.display.centers.push({name: value, value: value})
            })

            /*vm.selectedCenter = vm.data.all_centers[0]
            vm.data.all_centers.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.code_name] = value;
                vm.display.centers.push({name: value.code_name, value: value.code_name})
            })*/

            generateRealTimeData();
        })
        /*.then(function(result){
            return getAllDevices(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            console.log('devices' , result)
            vm.data.all_devices = result;
            vm.data.all_devices_pairs = {};
            result.results.forEach(function(value, index){
                if(value.device_id.indexOf("-") != -1 && value.device_type == "Beacon"){
                    var index = value.device_id.indexOf("-") + 1;
                    var id = value.device_id.substring(index)
                    vm.data.all_devices_pairs[id] = value;
                }
            })



        })
        .then(function(){

        })*/
    }
    function generateRealTimeData(){
        var end_datetime =  moment(new Date()).format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
        var start_datetime = moment(new Date()).subtract(vm.api.time_limit_threshold, "minutes").format("YYYY-MM-DDTHH:mm:ss") //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
        var start_date = moment(new Date()).subtract(vm.api.time_limit_threshold, "minutes").format("YYYY-MM-DD")  //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DD")
        var end_date =  moment(new Date()).format("YYYY-MM-DD") //2017-06-01T10:00:00 //moment(new Date()).format("YYYY-MM-DD")

        $q.when()
        .then(function(){
            
            return getAllCentersActivity(vm.api.project_prefix, vm.selectedCenter, start_date, end_date)
        })
        .then(function(result){
            vm.display.activity = []
            vm.data.all_centers_activity = result 
            //console.log("activity" , result)
            result.results.forEach(function(value, index){
                vm.data.all_centers_activity_by_id[value.id] = value;
                vm.display.activity.push({name: value.desc, value: value.id})
            })

            return getCurrentAttendees(vm.api.project_prefix, vm.selectedCenter, start_datetime, end_datetime, vm.api.time_limit_threshold);
        })
        .then(function(result){
            //console.log('readings' , result)

            if(result.length == 0){
                vm.status.no_data = true;
                vm.loading = false;
            }else{
                vm.data.real_time_activity_reading = result
                vm.status.no_data = false;
                vm.display.elderly_attendance = [];
                vm.display.elderly_attendance_backup = [];

                result.forEach(function(value, index){
                    vm.data.real_time_activity_reading_hash[value.index] = value;
                })

                vm.data.all_residents.results.forEach(function(value, index){
                    var index = value.project_prefix + value.raw_index;
                    var obj = {
                        //resident_index: value.display_name,
                        id: vm.data.all_residents_by_resident_index[index].id,
                        gender: vm.data.all_residents_by_resident_index[index].gender,
                        display_name: value.display_name,
                        device_id: (vm.data.real_time_activity_reading_hash[index]) ? vm.data.real_time_activity_reading_hash[index].device_id : "",
                        image: (value.profile_picture!= null) ? value.profile_picture : "https://openclipart.org/download/247319/abstract-user-flat-3.svg",
                        status: (vm.data.real_time_activity_reading_hash[index]) ? ((vm.data.real_time_activity_reading_hash[index].recent == 0) ? "Present And Left" : "Present") : "Absent",
                        recent: (vm.data.real_time_activity_reading_hash[index]) ? ((vm.data.real_time_activity_reading_hash[index].recent == 0) ? ""+vm.data.real_time_activity_reading_hash[index].recent : ""+vm.data.real_time_activity_reading_hash[index].recent) : "2"
                    }
                    vm.data.elderly_attendance_hash[value.id] = obj
                    vm.display.elderly_attendance.push(obj)
                })

                vm.display.elderly_attendance.sort(compareCount);
                vm.display.elderly_attendance_backup = angular.copy(vm.display.elderly_attendance);
            }
        })
        .then(function(){
            $timeout(function () {
                $('select').material_select()
            });
            vm.loading = false;
        })

    }

    /**********************
        BUTTON FUNCTION
    **********************/
    vm.updateAttendance = updateAttendance;
    vm.refresh = refresh;

    function refresh(resident_index){
        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true // Close upon selecting a date,
        });

        var $input = $('.datepicker').pickadate()
        var picker = $input.pickadate('picker')
        picker.set('select', new Date())

        vm.display.update_modal.id = resident_index;
        vm.display.update_modal.resident_name = vm.data.elderly_attendance_hash[resident_index].display_name

        vm.update.update_check = false
        $q.when()
        .then(function(){
            var current_date = moment(new Date()).format("YYYY-MM-DD")
            return viewAttendance(vm.api.project_prefix, vm.api.center_code_name, current_date, current_date)
        })
        .then(function(result){
            console.log(result)
            if(result.results.length > 0){
                result.results.forEach(function(value, index){
                    if(value.participant == resident_index){
                        vm.update.update_id = value.id
                        var timing = value.timing_list.substring(1, value.timing_list.length - 1)
                        timing = timing.replace(/\s/g,'')
                        timing = timing.split(",")
                        vm.update.status = timing
                        vm.update.update_check = true
                    }
                })
            }
            
            //$('.modal').modal();
            //$('#updateModal').modal('open');

            $timeout(function(){
                $('select').material_select();
                Materialize.updateTextFields();
           })
        })

        
    }
    function updateAttendance(){
        console.log(vm.update.update_check)
        if(vm.update.update_check){
            var updated_date = moment($('#update_date').val()).format("YYYY-MM-DD")
            $q.when()
            .then(function(){
                return editAttendance(vm.data.all_centers_by_center_code[vm.selectedCenter].id , vm.display.update_modal.id , updated_date, vm.update.status, vm.update.update_id)
            })
            .then(function(result){
                console.log(result)
                vm.update.update_check = false
                $('#updateModal').modal('close')
            })
        }else{
            var created_date = moment($('#update_date').val()).format("YYYY-MM-DD")
            $q.when()
            .then(function(){
                return createAttendance(vm.data.all_centers_by_center_code[vm.selectedCenter].id, vm.display.update_modal.id , created_date, vm.update.status)
            })
            .then(function(result){
                console.log(result)
                $('#updateModal').modal('close');
            })
        }
        

        
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

    function getAllResidents (project_prefix) {
        var _defer = $q.defer();
        RTService.getAllResidents(project_prefix, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getAllCentersActivity (project_prefix, center_code_name, start_date, end_date) {
        var _defer = $q.defer();
        RTService.getAllCentersActivity(project_prefix, center_code_name, start_date, end_date, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getAllCenters (project_prefix) {
        var _defer = $q.defer();
        RTService.getAllCenters(project_prefix, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getCurrentAttendees (project_prefix, center_code_name, start_datetime, end_datetime, recent_threshold_min) {
        var _defer = $q.defer();
        RTService.getCurrentAttendees(project_prefix, center_code_name, start_datetime, end_datetime, recent_threshold_min, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function createAttendance(center, participant, attendance_date, timing_list){
        var _defer = $q.defer();
        var params = {
            center: center,
            participant: participant,
            attendance_date: attendance_date,
            timing_list:  JSON.stringify(timing_list).replace(/["']/g, "")
        }
        console.log(params)
        RTService.createAttendance(params, function(result){
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        })
        return _defer.promise;
    }

    function editAttendance(center, participant, attendance_date, timing_list, id){
        var _defer = $q.defer();
        var params = {
            center: center,
            participant: participant,
            attendance_date: attendance_date,
            timing_list: JSON.stringify(timing_list).replace(/["']/g, "")
        }
        console.log(params)
        RTService.editAttendance(id, params, function(result){
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        })
        return _defer.promise;
    }

    function viewAttendance(project_prefix, center_code_name, start_date, end_date){
        var _defer = $q.defer();
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name,
            start_date: start_date,
            end_date: end_date
        }
        console.log(params)
        RTService.viewAttendance(params, function(result){
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        })
        return _defer.promise;
    }

    function getSensorReadings (gw_device, start_datetime, end_datetime, page_size) {
        var _defer = $q.defer();
        console.log(gw_device + " , " + start_datetime + " , " + end_datetime + " , " + page_size)
        if(gw_device.length > 1){
            var results = [];
            gw_device.forEach(function(device, index){
                RTService.getSensorReadings(device, start_datetime, end_datetime, page_size, function (result) {
                    if (result) {
                        results = results.concat(result.results)
                        if(index == (gw_device.length-1) ){
                            _defer.resolve(results);
                        }
                    } else {
                        _defer.reject();
                    }
                });
            })
        }else{
            RTService.getSensorReadings(gw_device, start_datetime, end_datetime, page_size, function (result) {
                if (result) {
                    _defer.resolve(result);
                } else {
                    _defer.reject();
                }
            });
        }
        return _defer.promise;
    }

    /********************
        HELPERS METHOD
    *********************/
    function compareCount (a, b) {
        // ASCENDING ORDER
        if (a.recent_status > b.recent_status) return 1;
        if (a.recent_status < b.recent_status) return -1;
        return 0;
    }
})
