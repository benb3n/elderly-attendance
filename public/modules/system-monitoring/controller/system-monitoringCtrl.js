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
        $('.modal').modal();

    });

    /*************** 
        WATCHERS
    ****************/
    $scope.getkeys = function(event){
        applyFilters();    
    }

    /********************* 
        SEARCH FILTERS
    **********************/
    function applyFilters(){
        result = applySearchFilter();
        console.log(result.length)
        vm.display.system_monitoring_device = angular.copy(result)
    }   

    function applySearchFilter(data){
        if(typeof vm.searchname == 'undefined' || vm.searchname == "" ){
            return vm.display.system_monitoring_device_backup;
        }else{
            if(isNaN(vm.searchname)){
                return filterByAttr("resident_list", vm.searchname, vm.display.system_monitoring_device_backup);
            }else{
                return filterByAttrNum("value", vm.searchname, vm.display.system_monitoring_device_backup);
            }
        }
    }

    function filterByAttrNum(attr, value, data) {
        return $.grep(data, function(n, i) {
            return n[attr] < value;
        });
    }

    function filterByAttr(attr, value, data) {
        var value = value.toLowerCase();
        return $.grep(data, function(n, i) {
            return n[attr].toLowerCase().indexOf(value) != -1;
        });
    }

    initController();
    function initController(){
        vm.data = {
            system_monitoring: [],
            system_monitoring_hash: {},
            resident: [],
            resident_hash: {}
        };
        vm.display = {
            all_devices: [],
            system_monitoring_device: [],
            system_monitoring_device_backup: []
        }
        vm.update = {};
        vm.searchname = "";

        vm.loading = true;
        generateDataForInit();
    }

    function generateDataForInit(){
        $q.when()
        .then(function(){
            return getAllResidents(vm.api.project, vm.api.all_device_count)
        })
        .then(function(result){
            vm.data.resident = result.results;
            result.results.forEach(function(value, index){
                vm.data.resident_hash[value.resident_index] = value;
            })

            return getSystemMonitoringDevice(vm.api.project, vm.api.center, vm.api.system_monitoring_device_count)
        })
        .then(function(result){
            console.log(result)
            vm.data.system_monitoring = result.results;
           
            result.results.forEach(function(value, index){
                vm.data.system_monitoring_hash[value.id] = value;
                var index = value.resident_list.indexOf(",");
                value.resident_index = value.resident_list.substring(0, index);
                value.image = (vm.data.resident_hash[value.resident_index].profile_picture != null) ? vm.data.resident_hash[value.resident_index].profile_picture : "http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg";
                value.last_seen = moment(value.gw_timestamp).format("YYYY-MM-DD HH:mm:ss")
                value.status = (value.value > 2.7) ? "Green" : "Red"
                vm.display.system_monitoring_device.push(value);
            })
            console.log(vm.display.system_monitoring_device)
            vm.display.system_monitoring_device.sort(compareCount)
            vm.display.system_monitoring_device_backup = angular.copy(vm.display.system_monitoring_device)            

        }).then(function(result){
            vm.loading = false;
            $timeout(function () {
                $('select').material_select()
                Materialize.updateTextFields();
            });
        });

    }

    
    /************************
        HELPER FUNCTIONS 
    ************************/
    function compareCount (a, b) {
        // ASCENDING ORDER
        if (a.value > b.value) return 1;
        if (a.value < b.value) return -1;
        return 0;
    }

    /***********************
        BUTTON FUNCTIONS 
    ***********************/
    vm.addNewDevice = addNewDevice;
    vm.updateNewDevice = updateNewDevice;
    vm.refresh = refresh;

    function refresh(id){
        $('.modal').modal();
        vm.update.update_selectedPerson = vm.data.system_monitoring_hash[id].resident_list;
        console.log(vm.update.update_selectedPerson)
        $timeout(function () {
            $('select').material_select()
            Materialize.updateTextFields();
        });
        
    }

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

    /******************
        WEB SERVICE 
    ******************/
    function getAllDevices (project_prefix, page_size) { //url, _defer, overall
        var _defer = $q.defer();
        var params = {
            project_prefix: project_prefix,
            page_size: page_size
        }
        SMService.getAllDevices(params, function (result) {
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
        SMService.getAllResidents(project_prefix, page_size, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function getSystemMonitoringDevice (project_prefix, center_code_name) {
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
