angular.module('RealTimeCtrl', [])
.controller('RealTimeController', function ($scope, $q, RTService) { 
    var vm = this;

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

        if(typeof vm.searchname == 'undefined' ){
            result = angular.copy(vm.elderly_attendance_backup);
        }else{
            result = applySearchFilter();
        }   
        result = angular.copy(applyEventTypeFilter(result));
        
        
        vm.elderly_attendance = angular.copy(result);
    }
    function applySearchFilter(data){
        if(vm.searchname == ""){
            return vm.elderly_attendance_backup;
        }else{
            return filterByAttr("name", vm.searchname, vm.elderly_attendance_backup);
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
        vm.centers = [
            {name:"6901", value:6901},
            {name:"6902", value:6902},
            {name:"6903", value:6903}
        ]
        vm.courses = [
            {name:"6901", value:6901},
            {name:"6902", value:6902},
            {name:"6903", value:6903}
        ]
        vm.status = [
            {name:"Present", value:"Present"},
            {name:"Absent", value:"NA"},
        ]

        vm.selectedStatus = ['Present', 'NA']
        vm.searchname = "";
        
        vm.elderly_attendance =[];

        /*vm.elderly_attendance = [
            {name: "John Tan Wei Jie", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"NA"},
            {name: "Amos Tan Wei Jie", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"NA"},
            {name: "Nam Hyunsuk", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"NA"},
            {name: "Jane Ng asd asd", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"NA"},
            {name: "Person5", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"NA"},
            {name: "Person6", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"Present"},
            {name: "Person7", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"Present"},
            {name: "Person8", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"Present"},
            {name: "Person9", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"Present"},
            {name: "Person10", image:"http://demos.creative-tim.com/material-dashboard/assets/img/faces/marc.jpg", status:"Present"}
        ]
        vm.elderly_attendance_backup = angular.copy(vm.elderly_attendance);*/

        
        generateDeviceList();
        generateDataForInit();
    }

    function generateDeviceList(){
        $q.when()
        .then(function(){
            return getAllDevices('mp',1000)
        })
        .then(function(result){
            console.log(vm.centers)
            console.log(result)
            console.log("NONOANDOASNDOAS")
            /*result.forEach(function(value,index){

            })*/
        });
    }
    function generateDataForInit () {
        $q.when()
        .then(function(){
            return getSensorReadings(6901);
        })
        .then(function(result){
            console.log(result)

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
    function getSensorReadings (gw_device) {
        var _defer = $q.defer();
        RTService.getSensorReadings(gw_device, function (result) {
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