angular.module('iCityLab', [
    'ngRoute',
    'appRoutes',
    'appConfigurations',
    'LoginCtrl',
    'LoginService',
    'RealTimeCtrl',
    'RealTimeService',
    'HistoricalCtrl',
    'HistoricalDirective',
    'HistoricalService',
    'SystemMonitoringCtrl',
    'SystemMonitoringService',
    'AttendanceCtrl',
    'AttendanceService',
    'nvd3',
    'g1b.calendar-heatmap'

]).run(function($rootScope, $http, $location) {
    console.log(localStorage.getItem("user"))
    if (localStorage.getItem("user")) {
        $http.defaults.headers.common.Authorization = 'Token token=' + localStorage.getItem("user").token;
        //$http.defaults.headers.common['X-Store-Cookies'] = localStorage.getItem("user");
    }
});
