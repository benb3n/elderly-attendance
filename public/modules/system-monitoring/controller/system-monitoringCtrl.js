angular.module('SystemMonitoringCtrl', [])
.controller('SystemMonitoringController', function ($scope, $q, $timeout, SMService) {
    var vm = this;
    vm.api = {
        project: 'mp',
        system_monitoring_device_type: "battery_voltage",
        center: 'gl15',//localStorage.getItem('center_code_name'),
        all_device_count: 1000,
        system_monitoring_device_count: 1000,
        latest_sensor_reading_count: 1000
    }

    $(document).ready(function() {
        
        $('.tooltipped').tooltip({delay: 50});
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
        $('.modal').modal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            inDuration: 300, // Transition in duration
            outDuration: 200, // Transition out duration
            startingTop: '4%', // Starting top style attribute
            endingTop: '10%', // Ending top style attribute
            ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

            },
            complete: function() {} // Callback for Modal close
        }
        );

    });
    

    initController();
    function initController(){
        vm.data = {};
        vm.display = {
            all_devices: [],
            system_monitoring_device: []
        }

        vm.loading = true;
        generateDataForInit();
    }

    function generateDataForInit(){
        $q.when()
        .then(function(){
            return getAllDevices(vm.api.project, vm.api.center, vm.api.system_monitoring_device_count)
        })
        .then(function(result){
            console.log(result)
            vm.data.system_monitoring = result.results;
        
            vm.data.system_monitoring_by_device = {};
            result.results.forEach(function(value, index){
                value.image = "http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg";
                vm.display.system_monitoring_device.push(value);
            })

          

        }).then(function(result){
            vm.loading = false;
            $timeout(function () {
                $('select').material_select()
                Materialize.updateTextFields();
            });
        });

    }

    /***********************
        BUTTON FUNCTIONS 
    ***********************/
    vm.addNewDevice = addNewDevice;
    vm.updateNewDevice = updateNewDevice;

    function addNewDevice(){
        console.log(" " + $('#new_name').val() + " , " +$('#new_device_id').val())
        var obj = {};
        obj.name = $('#new_name').val();
        obj.device_id = $('#new_device_id').val();
        
        
    }
    function updateNewDevice(){
        console.log(" " + $('#update_name').val() + " , " +$('#update_device_id').val())
        var obj = {};
        obj.name = $('#update_name').val();
        obj.device_id = $('#update_device_id').val();
        
    }

    //https://dev-starlight.icitylab.com/api/v1/readings/sysmonreading/?gw_device=6902&reading_type=battery_voltage&start_datetime=2017-12-20T00:00:00

    /******************
        WEB SERVICE 
    ******************/
    function getAllDevices (project_prefix, center_code_name) {
        console.log(center_code_name + "  , " + project_prefix)
        var _defer = $q.defer();
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name
        }
        SMService.getSystemMonitoringDevice(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function addDevice(params){
        var _defer = $q.defer();
        SMService.addDevice(parmas, function (result) {
            if (result) {
                _defer.resolve(result);
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function updateDevice(params){
        var _defer = $q.defer();
        SMService.updateDevice(parmas, function (result) {
            if (result) {
                _defer.resolve(result);
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
})
