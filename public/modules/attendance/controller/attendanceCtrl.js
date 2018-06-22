angular.module('AttendanceCtrl', [])
.controller('AttendanceController', function ($scope, $q, $timeout, AService) {
    var vm = this;
    vm.api = {
        role: localStorage["role"],
        project: 3,
        project_prefix: localStorage["project"] ,
        center_code_name : localStorage["center"] ,
        //center_code_name : 'smu-office',
        all_activity_count: 5000,
        all_device_count: 3000,
        latest_sensor_reading_count: 1000
    }

    document.getElementById("username").innerHTML = localStorage["user"]

    if(vm.api.role == 'staff' || vm.api.role == 'volunteer'){
        vm.edit_resident_status = true
    }

    
    $(document).ready(function() {
        
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
        return vm.selectedDays;
    },function(newDays, oldDays) {
        if(newDays != oldDays) {
            vm.selectedDays = newDays;
            
        }
    });

    initController();
    function initController(){
        vm.data = {
            all_residents: [],
            all_residents_by_resident_index: {},
            all_centers: [],
            all_projects:[],
            all_centers_by_center_code: {},
            all_centers_activity: [],
            all_centers_activity_by_id: {}
        };
        vm.update = {
            activity: {},
            resident: {}
        };
        vm.add = {
            activity: {},
            resident:{}
        }
        vm.delete = {};

        vm.alertLoading = false;
        vm.loading = true;
        vm.selectedDays = 3;

        generateDataForInit();
    }

    function generateDataForInit(){
        $q.when()
        .then(function(){
            return getAllProjects();
        })
        .then(function(result){
            console.log("projects", result)
            vm.data.all_projects = result.results;
            
            return getAllResidents(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_residents = result;
            console.log("resident", result)
            result.results.forEach(function(value, index){
                vm.data.all_residents_by_resident_index[value.id] = value;
            })
            
            $('#resident_table').DataTable({
                "destroy": true,
                "responsive": true,
                "bAutoWidth": false,
                "data": vm.data.all_residents.results,
                "columns": [
                    { title: "ID" ,data: "id" },
                    //{ title: "Resident Index" ,data: "resident_index" },
                    //{ title: "Display Name", data: "display_name" },
                    { title: "First Name", data: "name_first" },
                    { title: "Last Name", data: "name_last" },
                    { title: "Gender", data: "gender" },
                    { title: "Ethnicity", data: "ethnicity" },
                    //{ title: "Date of Birth", data: "dob" },
                    { title: "Contact No", data: "contact_mobile" },
                    { title: "Contact Other", data: "contact_other" },
                    { title: "Address Blk", data: "address_blk" },
                    { title: "Address Street", data: "address_street" },
                    { title: "Address Floor", data: "address_floor" },
                    { title: "Address Unit", data: "address_unit"},
                    //{ title: "Language", data: "language_list"},
                    //{ title: "Active", data: "active"},
                    {
                        title: "Edit",
                        data: null,
                        className: "center",
                        defaultContent: 
                            '<a class="btn-floating waves-effect waves-light btn modal-trigger" data-target="updateResidentModal" ><i class="material-icons">edit</i></a>' //+
                            //<button  class="btn-floating btn-small waves-effect waves-light" id="edit_btn"><i class="material-icons">edit</i></button>   
                            //'&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "language": {
                    "emptyTable": "No Data Available"
                }
               
            })
            var resident_table = $('#resident_table').DataTable();
            //Edit Button
            $('#resident_table tbody').on( 'click', 'a', function (e) {

                var data = resident_table.row( $(this).parents('tr') ).data();
              
                vm.update.id = data.id
                vm.update.resident.name_first = data.name_first;
                vm.update.resident.name_last = data.name_last;
                vm.update.resident.display_name = data.display_name;
                vm.update.resident.address_blk = data.address_blk 
                vm.update.resident.address_street = data.address_street
                vm.update.resident.address_floor = data.address_floor
                vm.update.resident.address_unit = data.address_unit
                vm.update.resident.gender_desc = data.gender
                vm.update.resident.ethnicity_desc = data.ethnicity
                vm.update.resident.contact_mobile = data.contact_mobile
                vm.update.resident.contact_other = data.contact_other
                vm.update.resident.join_date = data.join_date
                
                console.log(vm.update.resident)
                refresh();
                $('#updateResidentModal').modal();
                $('#updateResidentModal').modal('open');
                refresh();
            });


            return getAllCenters(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_centers = angular.copy(result.results);
            console.log("centers", result)
            vm.selectedCenter = result.results[0].code_name
            //vm.selectedGwDevice = result.results[0].device_list.split("; ")
            result.results.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.code_name] = value;
            })
            /*$('#center_table').DataTable({
                "destroy": true,
                "responsive": true,
                "bAutoWidth": false,
                "data": vm.data.all_centers.results,
                "columns": [
                    { title: "ID" ,data: "id" },
                    { title: "Project Prefix" ,data: "project_prefix" },
                    { title: "Device List", data: "device_list" },
                    { title: "Center Code Name", data: "code_name" },
                    { title: "Project Description", data: "project_desc" },
                    {
                        title: "Edit / Delete",
                        data: null,
                        className: "center",
                        defaultContent: '<button  class="btn-floating btn-small waves-effect waves-light" id="edit_btn"><i class="material-icons">edit</i></button>  ' +
                            '&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "bLengthChange": true,
                "language": {
                    "emptyTable": "No Data Available"
                }
            });

            var center_table = $('#center_table').DataTable();
            //Edit Button
            $('#center_table tbody').on( 'click', 'button', function () {
                var data = center_table.row( $(this).parents('tr') ).data();
                console.log(data)
                Materialize.updateTextFields();
                $('select').material_select();
                $('#updateCenterModal').modal();
                $('#updateCenterModal').modal('open');

            } );*/

            var end_datetime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            var start_datetime = moment('2017-12-20').subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            var start_date = moment('2017-11-01').subtract(10, "minutes").format("YYYY-MM-DD")  //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DD") 
            var end_date =  moment(new Date()).format("YYYY-MM-DD") //2017-06-01T10:00:00 //moment(new Date()).format("YYYY-MM-DD") 

            return getAllCentersActivity(vm.api.project_prefix, vm.selectedCenter, start_date, end_date, vm.api.all_activity_count)
        })
        .then(function(result){
            vm.data.all_centers_activity = result
            console.log("activity" , result)
            $('#activity_table').DataTable({
                "destroy": true,
                "responsive": true,
                "data": vm.data.all_centers_activity.results,
                "columns": [
                    { title: "ID" ,data: "id" },
                    { title: "Name" ,data: "desc" },
                    { title: "Center", data: "center" },
                    { title: "Start Date", data: "start_date" },
                    { title: "Start Time", data: "start_time" },
                    { title: "End Date", data: "end_date" },
                    { title: "End Time", data: "end_time" },
                    { title: "Day of Week", data: "repeat_params.days_of_week" },
                    {title: "Activity Type", data: "activity_type_list"},
                    {
                        title: "Edit / Delete",
                        data: null,
                        className: "center",
                        defaultContent: '<a class="btn-floating waves-effect waves-light btn modal-trigger" data-target="updateActivityModal" ><i class="material-icons">edit</i></a>' //+
                            //'&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "language": {
                    "emptyTable": "No Data Available"
                }
            });

            var activity_table = $('#activity_table').DataTable();
            //Edit Button
            $('#activity_table tbody').on( 'click', 'a', function () {
                var data = activity_table.row( $(this).parents('tr') ).data();
                //console.log(data)

                vm.update.id = data.id
                vm.update.activity.center = ""+data.center
                vm.update.activity.desc = data.desc
                vm.update.activity.start_date = new Date(data.start_date)
                vm.update.activity.end_date = new Date(data.end_date)
                vm.update.activity.start_time = data.start_time.substring(0,5)
                vm.update.activity.end_time = data.end_time.substring(0,5)
                vm.update.activity.repeat_params = [] //data.repeat_params.days_of_week
                data.repeat_params.days_of_week.toString().split(",").map(function(item) {
                    vm.update.activity.repeat_params.push(item);
                });
                vm.update.activity.activity_type_desc_list = [data.activity_type_list]
                
                console.log(data.activity_type_desc_list)

                refresh();
                $('#updateActivityModal').modal();
                $('#updateActivityModal').modal('open');
                refresh();
            } );
            

            //return getAllDevices(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            /*console.log(result)
            vm.data.all_devices = [];
            vm.data.all_devices_pairs = {};
            result.results.forEach(function(value, index){
                if(value.device_id.indexOf("-") != -1 && value.device_type == "Beacon"){
                    var index = value.device_id.indexOf("-") + 1;
                    var id = value.device_id.substring(index)
                    value.beacon_id = id;
                    vm.data.all_devices.push(value);
                    vm.data.all_devices_pairs[id] = value;
                }
            })
            
            $('#attendance_table').DataTable({
                "destroy": true,
                "responsive": true,
                "data": vm.data.all_devices,
                "columns": [
                    { title: "ID" ,data: "id" },
                    { title: "Resident Name", data: "resident_list" },
                    { title: "Resident Index", data: "resident_index_list" },
                    { title: "Device ID", data: "beacon_id" },
                    {
                        title: "Edit",
                        data: null,
                        className: "center",
                        defaultContent: '<button  class="btn-floating btn-small waves-effect waves-light" id="edit_btn"><i class="material-icons">edit</i></button>  ' +
                            '&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "bLengthChange": true,
                "language": {
                    "emptyTable": "No Data Available"
                }
            });

            //vm.update.resident.address = ""
            //vm.update.name = "Test";
            vm.update.status = "Present";
            
            $('select').material_select();
            

        

            // Delete record
            $('#delete_btn').on('click', function (e) {
                e.preventDefault();
                $('#deleteModal').modal();
                $('#deleteModal').modal('open');

            } );*/
         
            
            vm.display = {
                /*centers: [
                    {name:"6901", value:6901},
                    {name:"6902", value:6902},
                    {name:"6903", value:6903}
                ],*/
                status:[
                    {name: "Present", value: "Present"},
                    {name: "Absent", value: "Absent"}
                ]
            }
            var start_date = '2018-04-21'
            var end_date= '2018-05-01'

            return getAllResidentsAlerts(vm.api.project_prefix, vm.selectedCenter, start_date, end_date)
        })
        .then(function(result){
            console.log("alerts", result)

            vm.display.attendance_alert = []

            result.results.forEach(function(value , index){
                vm.display.attendance_alert.push({
                    name: vm.data.all_residents_by_resident_index[value.participant].name_first,
                    image: "https://openclipart.org/download/247319/abstract-user-flat-3.svg",
                    //course: "Physical Activities",
                    last_seen: moment(new Date()).diff(moment(value.modified_timestamp), 'days') + "days" ,
                    value: moment(new Date()).diff(moment(value.modified_timestamp), 'days') 
                })
            })
            

            vm.display.attendance_alert.sort(compareCount)

            vm.alertLoading = false;
            vm.loading = false;
        })
        .then(function(){
            $timeout(function(){
                $('select').material_select();
                Materialize.updateTextFields();
           })
        });


    }

    /**********************
        BUTTON FUNCTION 
    **********************/
    vm.deleteAttendance = deleteAttendance;
    vm.updateResidentDetails = updateResidentDetails;
    vm.addResidentDetails = addResidentDetails;
    vm.addActivityDetails = addActivityDetails;
    vm.updateActivityDetails = updateActivityDetails;
    vm.refresh = refresh;

    function refresh(){  
        console.log("R")
        Materialize.updateTextFields(); 
        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true // Close upon selecting a date,
          });
        $('.timepicker').pickatime({
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Clear', // text for clear-button
            canceltext: 'Cancel', // Text for cancel-button
            autoclose: true, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
            aftershow: function(){} //Function for after opening timepicker
          });
        
        $timeout(function(){
             $('select').material_select();
             Materialize.updateTextFields();
        })
    }

    function addActivityDetails(e){
        e.originalEvent.stopPropagation();
        
        $q.when()
        .then(function(){
            var activity = angular.copy(vm.add.activity)
            activity.center = parseInt(activity.center)
            activity.start_time += ":00"
            activity.end_time += ":00"
            var repeat_params = activity.repeat_params;
            activity.repeat_params = []
            if(activity.length == 1){
                repeat_params.map(function(item) {
                    activity.repeat_params.push(parseInt(item));
                });
            }else{
                repeat_params.toString().split(",").map(function(item) {
                    activity.repeat_params.push(parseInt(item));
                });
            }
            activity.repeat_params = {"days_of_week":activity.repeat_params}
            activity.start_date = $('#add_activity_start_date').val() //moment(new Date($('#add_activity_start_date').val()) ).format("YYYY-MM-DD");
            activity.end_date = $('#add_activity_end_date').val() //moment( new Date($('#add_activity_end_date').val()) ).format("YYYY-MM-DD");
            activity.activity_type_desc_list = vm.add.activity.activity_type_desc_list.toString();

            //console.log(activity)
            return addActivity(activity)
        })
        .then(function(result){
            location.reload(); 
            //console.log(result)
        })
    }
    function updateActivityDetails(e){
        e.originalEvent.stopPropagation();
        $q.when()
        .then(function(){
            var activity = angular.copy(vm.update.activity)
            activity.center = parseInt(activity.center)
            activity.start_time += ":00"
            activity.end_time += ":00"
            var repeat_params = activity.repeat_params;
            activity.repeat_params = []
            if(activity.length == 1){
                repeat_params.map(function(item) {
                    activity.repeat_params.push(parseInt(item));
                });
            }else{
                repeat_params.toString().split(",").map(function(item) {
                    activity.repeat_params.push(parseInt(item));
                });
            }
            activity.repeat_params = {"days_of_week":activity.repeat_params}
            activity.start_date = $('#update_activity_start_date').val()
            activity.end_date = $('#update_activity_end_date').val()
            activity.activity_type_desc_list = vm.update.activity.activity_type_desc_list.toString();

            return updateActivity(vm.update.id , activity)
        })
        .then(function(result){
            location.reload(); 
            //console.log(result)
        })
        

        //$('#updateModal').modal('close');
    }

    function addResidentDetails(e){
        e.originalEvent.stopPropagation();
        $q.when()
        .then(function(){
            //console.log(vm.add.resident.project)
            vm.add.resident.contact_other = parseInt(vm.add.resident.contact_other)
            vm.add.resident.contact_mobile = parseInt(vm.add.resident.contact_mobile)
            vm.add.resident.join_date =  moment(new Date()).format("YYYY-MM-DD")
            //console.log("ADD");
            //console.log(vm.add.resident)
            return addResident(vm.add.resident)
        })
        .then(function(result){
            location.reload(); 
        })
    }

    function updateResidentDetails(e){
        e.originalEvent.stopPropagation();
        $q.when()
        .then(function(){
            
            vm.update.resident.contact_other = parseInt(vm.update.resident.contact_other)
            vm.update.resident.contact_mobile = parseInt(vm.update.resident.contact_mobile)
            vm.update.resident.join_date = "2018-03-15" //new Date(vm.update.resident.join_date)
            console.log("UPDATE");
            console.log(vm.update.resident)
            return updateResident(vm.update.id , vm.update.resident)
        })
        .then(function(result){
            $('#updateModal').modal('close');
            location.reload(); 
  
        })
        

        
    }

    function deleteAttendance(){

        $('#deleteModal').modal('close');
    }

    /******************
        WEB SERVICE 
    ******************/
   function addActivity (params) { 
        var _defer = $q.defer();
        AService.addActivity(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function updateActivity (id, params) { 
        var _defer = $q.defer();
        AService.updateActivity(id, params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function addResident (params) { 
        var _defer = $q.defer();
        AService.addResident(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function updateResident (id, params) { 
        var _defer = $q.defer();
        AService.updateResident(id, params, function (result) {
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
        AService.getAllResidents(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function getAllProjects(){
        var _defer = $q.defer();
        AService.getAllProjects(function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getAllCenters (project_prefix, page_size) { 
        var _defer = $q.defer();
        AService.getAllCenters(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getAllCentersActivity (project_prefix, center_code_name, start_date, end_date, page_size) { 
        var _defer = $q.defer();
        AService.getAllCentersActivity(project_prefix, center_code_name, start_date, end_date, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function getAllResidentsAlerts (project_prefix, center_code_name, start_date, end_date) { 
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name,
            start_date: start_date,
            end_date: end_date
        }
        var _defer = $q.defer();
        AService.getAllResidentsAlerts(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getAllDevices (project_prefix, page_size) { //url, _defer, overall
        var _defer = $q.defer();
        AService.getAllDevices(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        
        return _defer.promise;
    }

    /******************** 
        HELPERS METHOD
    *********************/
    function compareCount (a, b) {
        // DSCENDING ORDER
        if (a.value > b.value) return -1;
        if (a.value < b.value) return 1;
        return 0;
    }
})