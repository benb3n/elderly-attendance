angular.module('SystemMonitoringCtrl', [])
.controller('SystemMonitoringController', function ($scope, $q, $timeout, SMService) {
    var vm = this;
    vm.api = {
        project: 3,
        project_prefix: localStorage["project"] ,
        center_code_name : localStorage["center"] ,
        system_monitoring_device_type: "battery_voltage",
        center: 'gl15',//localStorage.getItem('center_code_name'),
        all_device_count: 1000,
        system_monitoring_device_count: 1000,
        latest_sensor_reading_count: 1000,
        device_type: 'beacon',
        reading_type: 'sysmon',
        payload_type: 'batt_voltage'
    }

    $(document).ready(function() {
        $('ul.tabs').tabs();
        $('.tooltipped').tooltip({delay: 50});
        $('.button-collapse').sideNav({
            menuWidth: 300, // Default is 240
            edge: 'left', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
            }
        );
        $('select').material_select();
        /*$('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });*/
        $('.modal').modal();
        

    });

    /*************** 
        WATCHERS
    ****************/
    $scope.$watch(function() {
        return vm.selectedBatteryLevel;
    },function(newBattery, oldBattery) {
        if(newBattery != oldBattery) {
            vm.selectedBatteryLevel = newBattery;
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
        result = applySearchFilter();
        result = applyBatteryTypeFilter(result);
        vm.display.system_monitoring_device = angular.copy(result)
    }   

    function applySearchFilter(data){
        if(typeof vm.searchname == 'undefined' || vm.searchname == "" ){
            return vm.display.system_monitoring_device_backup;
        }else{
            //if(isNaN(vm.searchname)){
            return filterByAttr("resident_index", vm.searchname, vm.display.system_monitoring_device_backup);
            //}else{
            //    return filterByAttrNum("value", vm.searchname, vm.display.system_monitoring_device_backup);
            //}
        }
    }

    function applyBatteryTypeFilter(data){
        var result = [];
        vm.selectedBatteryLevel.forEach(function(value, index) {
            result = result.concat(filterByAttr("battery_status", value, data));
        });
        return result;
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
            resident_hash: {},
            mapping: [],
            all_centers: [],
            all_centers_by_center_code: {},
            all_devices:[]
        };
        vm.display = {
            all_devices: [],
            system_monitoring_device: [],
            system_monitoring_device_backup: []
        }
        vm.update = {
            device: {},
            mapping: {}
        };
        vm.add = {
            device: {},
            mapping: {}
        }
        vm.searchname = "";
        vm.selectedBatteryLevel = ['Low', 'Medium', 'High']

        vm.loading = true;
        generateDataForInit();
    }

    function generateDataForInit(){
        $q.when()
        .then(function(){
            return getAllResidents(vm.api.project_prefix)
        })
        .then(function(result){
            console.log("resident", result)
            vm.data.resident = result.results;
            result.results.forEach(function(value, index){
                vm.data.resident_hash[value.resident_index] = value;
            })
            return  getAllCenters(vm.api.project_prefix);
        })
        .then(function(result){
            vm.data.all_centers = angular.copy(result.results);
            console.log("centers", result)
            vm.selectedCenter = result.results[0].code_name
            //vm.selectedGwDevice = result.results[0].device_list.split("; ")
            result.results.forEach(function(value, index){
                vm.data.all_centers_by_center_code[value.code_name] = value;
            })
            return getAllDevices(vm.api.project_prefix, 'beacon');
        })
        .then(function(result){
            console.log("devices", result)
            vm.data.all_devices = angular.copy(result.results);
   
            return getSystemMonitoringDevice(vm.api.project, vm.api.center, vm.api.device_type, vm.api.reading_type, vm.api.payload_type)
        })
        .then(function(result){
            console.log("sys mon", result)
            vm.data.system_monitoring = result.results;
           
            result.results.forEach(function(value, index){
     
                vm.data.system_monitoring_hash[value.id] = value;
                //var index = value.resident_list.indexOf(",");
                value.resident_index = value.participant_id_list || 'nil'//value.resident_list.substring(0, index);
                value.image = (typeof vm.data.resident_hash[value.resident_index] != 'undefined' && vm.data.resident_hash[value.resident_index].profile_picture != null) ? vm.data.resident_hash[value.resident_index].profile_picture : "https://openclipart.org/download/247319/abstract-user-flat-3.svg";
                value.last_seen = (moment(new Date()).diff(moment(value.gw_timestamp), 'days') == 0) ? moment(new Date()).diff(moment(value.gw_timestamp), 'minutes') + " minutes ago" : moment(new Date()).diff(moment(value.gw_timestamp), 'days') + " days ago"   //.format("YYYY-MM-DD HH:mm:ss")
                value.status = (value.value > 2.9) ? "Green" : (value.value > 2.7) ? "Orange" : "Red"
                value.battery_status = (value.value > 2.9) ? "High" : (value.value > 2.7) ? "Medium" : "Low"
                value.last_seen_in_minutes = moment(new Date()).diff(moment(value.gw_timestamp), 'minutes')
                vm.display.system_monitoring_device.push(value);
                
            })

            vm.display.system_monitoring_device.sort(compareCount)
            vm.display.system_monitoring_device_backup = angular.copy(vm.display.system_monitoring_device)           

            return getAllDeviceMapping({project:vm.api.project})
        })
        .then(function(result){
            console.log('mapping', result)
            vm.data.mapping = result

            $('#mapping_table').DataTable({
                "destroy": true,
                "responsive": true,
                "bAutoWidth": false,
                "data": vm.data.mapping.results,
                "columns": [
                    { title: "ID" ,data: "id" },
                    //{ title: "Resident Index" ,data: "resident_index" },
                    //{ title: "Display Name", data: "display_name" },
                    { title: "Device ID", data: "device_id" },
                    { title: "Center", data: "center_desc" },
                    { title: "Participant", data: "participant_id_list" },
                    { title: "Device Description", data: "device_loc_desc" },
                    { title: "Install Date", data: "install_date" },
                    { title: "Uninstall Date", data: "uninstall_date" },
                    //{ title: "Last Modified", data: "modified_timestamp" },
                    {
                        title: "Edit",
                        data: null,
                        className: "center",
                        defaultContent: 
                            '<a class="btn-floating waves-effect waves-light btn modal-trigger" data-target="updateMappingModal" ><i class="material-icons">edit</i></a>' //+
                            //<button  class="btn-floating btn-small waves-effect waves-light" id="edit_btn"><i class="material-icons">edit</i></button>   
                            //'&nbsp;&nbsp; <button  class="btn-floating btn-small waves-effect waves-light  red darken-4" id="delete_btn"><i class="material-icons">delete</i></button>'
                    }
                ],
                "language": {
                    "emptyTable": "No Data Available"
                }
               
            })
            var mapping_table = $('#mapping_table').DataTable();
            //Edit Button
            $('#mapping_table tbody').on( 'click', 'a', function (e) {

                var data = mapping_table.row( $(this).parents('tr') ).data();
              
                vm.update.id = data.id
                //vm.update.mapping.device_id = data.device_id;
                //vm.update.mapping.center_desc = data.center_desc;
                //vm.update.mapping.participant_id_list = data.participant_id_list;
                //vm.update.mapping.device_loc_desc = data.device_loc_desc 
                vm.update.mapping.install_date = new Date(data.install_date)
                vm.update.mapping.uninstall_date = (data.uninstall_date == null ) ? "" : new Date(data.uninstall_date)
                //vm.update.resident.modified_timestamp = data.modified_timestamp

                refresh();
                $('#updateMappingModal').modal();
                $('#updateMappingModal').modal('open');
                refresh();
            });

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
    function sortFunc(a, b) {
        var sortingArr = [ 'Red', 'Orange', 'Green'];
        return sortingArr.indexOf(a[1]) - sortingArr.indexOf(b[1]);
      }

    /***********************
        BUTTON FUNCTIONS 
    ***********************/
    vm.addNewDevice = addNewDevice;
    vm.updateNewDevice = updateNewDevice;
    vm.addNewMappingDevice = addNewMappingDevice;
    vm.updateNewMappingDevice = updateNewMappingDevice;
    vm.refresh = refresh;

    function refresh(){
        //$('.modal').modal();

        $('.datepicker').pickadate({
            format: 'yyyy-mm-dd',
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15, // Creates a dropdown of 15 years to control year,
            today: 'Today',
            clear: 'Clear',
            close: 'Ok',
            closeOnSelect: true // Close upon selecting a date,
        });
        Materialize.updateTextFields();
        $timeout(function () {
            $('select').material_select()
            Materialize.updateTextFields();
        });
        
    }

    function addNewMappingDevice(){        
        vm.add.mapping.participant_list = [vm.add.mapping.participant_list];
        vm.add.mapping.install_date = $('#add_resident_install_date').val() //moment(new Date($('#add_resident_install_date').val())).format("YYYY-MM-DD");

        console.log(vm.add.mapping)

        $q.when()
        .then(function(){
            return addDeviceMapping(vm.add.mapping);
        })
        .then(function(result){
            //console.log(result)
            location.reload(); 
        })
    }

    function updateNewMappingDevice(){
        /*console.log(" " + $('#update_name').val() + " , " +$('#update_device_id').val())
        var obj = {};
        obj.name = $('#update_name').val();
        obj.device_id = $('#update_device_id').val();*/

        vm.update.id = vm.update.id
        //vm.update.mapping.participant_list = ["14"]
        //vm.update.mapping.device = '2'
        vm.update.mapping.install_date = $('#update_mapping_install_date').val()
        vm.update.mapping.uninstall_date = $('#update_mapping_uninstall_date').val()  
        
        $q.when()
        .then(function(){
            return updateDeviceMapping(vm.update.id, vm.update.mapping);
        })
        .then(function(result){
            //console.log(result)
            //location.reload(); 
        })
    }

    function addNewDevice(){
        /*console.log(" " + $('#new_name').val() + " , " +$('#new_device_id').val())
        var obj = {};
        obj.name = $('#new_name').val();
        obj.device_id = $('#new_device_id').val();*/
        
        vm.add.device.device_type_desc = 'beacon'
        vm.add.device.device_id = '123456'
        vm.add.device.remarks = 'abc'
        
        $q.when()
        .then(function(){
            return addDevice(vm.add.device);
        })
        .then(function(result){
            console.log(result)
        })
    }
    function updateNewDevice(){
        /*console.log(" " + $('#update_name').val() + " , " +$('#update_device_id').val())
        var obj = {};
        obj.name = $('#update_name').val();
        obj.device_id = $('#update_device_id').val();*/

        vm.update.id = 3
        vm.update.device.device_type_desc = 'beacon'
        vm.update.device.device_id = '123457'
        vm.update.device.remarks = 'abc'
        
        $q.when()
        .then(function(){
            return updateDevice(vm.update.id, vm.update.device);
        })
        .then(function(result){
            console.log(result)
        })
    }

    /******************
        WEB SERVICE 
    ******************/
   function getAllDeviceMapping (params) { 
    var _defer = $q.defer();
    SMService.getAllDeviceMapping(params, function (result) {
        if (result) {
            _defer.resolve(result)
        } else {
            _defer.reject();
        }
    });
    return _defer.promise;
}
   function addDeviceMapping (params) { 
        var _defer = $q.defer();
        SMService.addDeviceMapping(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function updateDeviceMapping (id, params) { 
        var _defer = $q.defer();
        SMService.updateDeviceMapping(id, params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }

    function addDevice (params) { 
        var _defer = $q.defer();
        SMService.addDevice(params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function updateDevice (id, params) { 
        var _defer = $q.defer();
        SMService.updateDevice(id, params, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function getAllDevices (project_prefix, device_type) { //url, _defer, overall
        var _defer = $q.defer();
        var params = {
            project_prefix: project_prefix,
            device_type: device_type
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
    function getAllCenters (project_prefix, page_size) { 
        var _defer = $q.defer();
        SMService.getAllCenters(project_prefix, page_size, function (result) {
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
        SMService.getAllResidents(project_prefix, function (result) {
            if (result) {
                _defer.resolve(result)
            } else {
                _defer.reject();
            }
        });
        return _defer.promise;
    }
    function getSystemMonitoringDevice (project_prefix, center_code_name, device_type, reading_type, payload_type) {
        var _defer = $q.defer();
        var params = {
            project_prefix: project_prefix,
            center_code_name: center_code_name,
            device_type: device_type,
            reading_type: reading_type,
            payload_type: payload_type
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

    /*function addDevice(params){
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
    }*/
})
