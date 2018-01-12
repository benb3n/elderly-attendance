angular.module('AttendanceCtrl', [])
.controller('AttendanceController', function ($scope, $q, $timeout, AService) {
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

        $('select').material_select();
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
        vm.update = {};
        vm.delete = {};
        vm.alertLoading = false;
        vm.loading = true;
        generateDataForInit();
    }

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
            })
            $('#resident_table').DataTable({
                "destroy": true,
                "responsive": true,
                "data": vm.data.all_residents.results,
                "columns": [
                    { title: "ID" ,data: "id" },
                    { title: "Resident Index" ,data: "resident_index" },
                    { title: "Display Name", data: "display_name" },
                    { title: "First Name", data: "name_first" },
                    { title: "Last Name", data: "name_last" },
                    { title: "Gender", data: "gender" },
                    { title: "Ethnicity", data: "ethnicity" },
                    { title: "Date of Birth", data: "dob" },
                    { title: "Contact", data: "contact_mobile" },
                    { title: "Address Blk", data: "address_blk" },
                    { title: "Address Street", data: "address_street" },
                    { title: "Address Floor", data: "address_floor" },
                    { title: "Address Unit", data: "address_unit"},
                    { title: "Language", data: "language_list"},
                    { title: "Active", data: "active"},
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

            return getAllCenters(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            vm.data.all_centers = result;
            console.log("centers", result)
            vm.selectedCenter = result.results[0].code_name
            vm.selectedGwDevice = result.results[0].device_list.split("; ")
            result.results.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.code_name] = value;
            })
            $('#center_table').DataTable({
                "destroy": true,
                "responsive": true,
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

            var end_datetime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            var start_datetime = moment('2017-12-20').subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DDTHH:mm:ss") //2017-06-01T10:00:00
            var start_date = moment('2017-11-01').subtract(10, "minutes").format("YYYY-MM-DD")  //moment(end_datetime).subtract(10, "minutes").format("YYYY-MM-DD") 
            var end_date =  moment(new Date()).format("YYYY-MM-DD") //2017-06-01T10:00:00 //moment(new Date()).format("YYYY-MM-DD") 

            return getAllCentersActivity(vm.api.project, vm.selectedCenter, start_date, end_date, vm.api.all_activity_count)
        })
        .then(function(result){
            vm.data.all_centers_activity = result
            console.log("activity" , result)
            $('#activity_table').DataTable({
                "destroy": true,
                "responsive": true,
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
            

            return getAllDevices(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            console.log(result)
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

            vm.update.name = "Test";
            vm.update.status = "Present";
            
            $('select').material_select();
            

        

            // Edit record
            $('#edit_btn').on('click', function (e) {
                Materialize.updateTextFields();
                e.preventDefault();
                
                
                $('select').material_select();
                
                $('#updateModal').modal();
                $('#updateModal').modal('open');
                
                
            });
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
                ],
                attendance_alert: [
                    {name: "Alexander Hamilton",
                    image: "http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg",
                    course: "Physical Activities",
                    last_seen: "2 days ago"}
                ]
            }
            
        })
        .then(function(){
            vm.alertLoading = false;
            vm.loading = false;
        });


    }

    /**********************
        BUTTON FUNCTION 
    **********************/
    vm.deleteAttendance = deleteAttendance;
    vm.updateAttendance = updateAttendance;

    function updateAttendance(){

        console.log(vm.update)

        $('#updateModal').modal('close');
    }

    function deleteAttendance(){

        $('#deleteModal').modal('close');
    }

    /******************
        WEB SERVICE 
    ******************/
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
})