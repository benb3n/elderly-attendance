angular.module('AttendanceCtrl', [])
.controller('AttendanceController', function ($scope, $q, $timeout, AService) {
    var vm = this;
    vm.api = {
        project: 3,
        project_prefix: 'SMU',
        center_code_name : 'smu-office',
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
            vm.data.all_centers = result.results;
            result.results.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.prefix] = value;
            })
            
            return getAllResidents(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_residents = result;
            console.log("resident", result)
            result.results.forEach(function(value, index){
                vm.data.all_residents_by_resident_index[value.resident_index] = value;
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
                            '<a class="btn-floating waves-effect waves-light btn modal-trigger" data-target="updateResidentModal"><i class="material-icons">edit</i></a>' //+
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
           
                

                $timeout(function () {
                    $('select').material_select();     
                    Materialize.updateTextFields();
                });
                //$('#updateResidentModal').modal();
                //$('#updateResidentModal').modal('open');
 
            });


            return getAllCenters(vm.api.project_prefix)
        })
        .then(function(result){
            vm.data.all_centers = result;
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
                    { title: "Repeat", data: "repeat_params" },
                    {title: "Activity Type", data: "activity_type_list"},
                    {
                        title: "Edit / Delete",
                        data: null,
                        className: "center",
                        defaultContent: '<button  class="btn-floating btn-small waves-effect waves-light" id="edit_btn"><i class="tiny material-icons">edit</i></button>  ' //+
                            //'&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "language": {
                    "emptyTable": "No Data Available"
                }
            });

            var activity_table = $('#activity_table').DataTable();
            //Edit Button
            $('#activity_table tbody').on( 'click', 'button', function () {
                var data = activity_table.row( $(this).parents('tr') ).data();
                console.log(data)
                vm.update.activity.address = data.address_blk + " " + data.address_street + " #" + data.address_floor + data.address_unit
                Materialize.updateTextFields();
                $('select').material_select();
                $('#updateCenterActivityModal').modal();
                $('#updateCenterActivityModal').modal('open');

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

            } );
         
            
            vm.display = {
                centers: [
                    {name:"6901", value:6901},
                    {name:"6902", value:6902},
                    {name:"6903", value:6903}
                ],
                status:[
                    {name: "Present", value: "Present"},
                    {name: "Absent", value: "Absent"}
                ]
            }*/
            //return getAllResidentsAlerts(vm.api.project, vm.api.center_code_name, vm.selectedDays, vm.api.all_activity_count)
        })
        .then(function(result){
            /*console.log("alerts", result)

            vm.display.attendance_alert = []

            result.results.forEach(function(value , index){
                vm.display.attendance_alert.push({
                    name: value.resident_list,
                    image: "https://openclipart.org/download/247319/abstract-user-flat-3.svg",
                    //course: "Physical Activities",
                    last_seen: moment(new Date()).diff(moment(value.gw_timestamp), 'days') + "days" ,
                    value: moment(new Date()).diff(moment(value.gw_timestamp), 'days') 
                })
            })
            

            vm.display.attendance_alert.sort(compareCount)*/

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
        $timeout(function(){
             $('select').material_select();
             Materialize.updateTextFields();
        })
    }

    function addActivityDetails(){
        $q.when()
        .then(function(){
            vm.add.activity.center = 1
            vm.add.activity.desc = "HIT ME ONE MORE TIME"
            vm.add.activity.start_date = "2018-01-15"
            vm.add.activity.end_date = "2018-03-15"
            vm.add.activity.start_time = "9:30:00"
            vm.add.activity.end_time = "11:30:00"
            vm.add.activity.repeat_params = {"days_of_week":[4,5]}
            vm.add.activity.activity_type_desc_list = "abc, asd, assd"

            console.log(vm.add.activity)
            return addActivity(vm.add.activity)
        })
        .then(function(result){
            console.log(result)
        })
    }
    function updateActivityDetails(){
        
        $q.when()
        .then(function(){
            vm.update.id = 13
            vm.update.activity.center = 1
            vm.update.activity.desc = "I WAN TO SLEEP"
            vm.update.activity.start_date = "2018-01-15"
            vm.update.activity.end_date = "2018-03-15"
            vm.update.activity.start_time = "08:00:00"
            vm.update.activity.end_time = "09:00:00"
            vm.update.activity.repeat_params = {"days_of_week":[1,2,3,5]}
            vm.update.activity.activity_type_desc_list = "abc, asd, assd"

            console.log(vm.update.activity)

            return updateActivity(vm.update.id , vm.update.activity)
        })
        .then(function(result){
            console.log(result)
        })
        

        //$('#updateModal').modal('close');
    }

    function addResidentDetails(){
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
            console.log(result)
        })
    }

    function updateResidentDetails(){
        
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
            console.log(result)
        })
        

        $('#updateModal').modal('close');
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
    function getAllResidentsAlerts (project_prefix, center_code_name, days, page_size) { 
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name,
            days: days,
            page_size: page_size
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