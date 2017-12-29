angular.module('AttendanceCtrl', [])
.controller('AttendanceController', function ($scope, $q, $timeout, AService) {
    var vm = this;
    vm.api = {
        project: 'mp',
        all_device_count: 1000,
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
        vm.data = {};
        vm.update = {};
        vm.alertLoading = false;
        vm.loading = true;
        generateDataForInit();
    }

    function generateDataForInit(){
        $q.when()
        .then(function(){
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
                responsive: true,
                "data": vm.data.all_devices,
                "columns": [
                    /*{ title: "ID" },
                    { title: "Resident Name" },
                    { title: "Resident Index" },
                    { title: "Device ID" },
                    { title: "Edit / Delete" },*/
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
                e.preventDefault();
                $('#updateModal').modal();
                $('#updateModal').modal('open');
                $('select').material_select();
                Materialize.updateTextFields();

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