angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise('/login');
    $routeProvider
        // home page
        .when('/login', {
            templateUrl: 'modules/login/views/login.html',
            controller: 'LoginController',
            controllerAs: "signin"
        })
        .when('/home', {
            templateUrl: 'modules/real-time/views/real-time.html',
            controller: 'RealTimeController',
            controllerAs: "rt"
        })

        .when('/historical', {
            templateUrl: 'modules/historical/views/historical.html',
            controller: 'HistoricalController',
            controllerAs: 'historical'
        })

        .when('/attendance', {
            templateUrl: 'modules/attendance/views/attendance.html',
            controller: 'AttendanceController',
            controllerAs: 'attendance'
        })

        .when('/system-monitoring', {
            templateUrl: 'modules/system-monitoring/views/system-monitoring.html',
            controller: 'SystemMonitoringController',
            controllerAs: 'sm'
        })

        $locationProvider.html5Mode(true);

    }]);
