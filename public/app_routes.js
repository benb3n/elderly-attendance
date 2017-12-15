angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.otherwise('/home');
    $routeProvider    
        // home page
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

        $locationProvider.html5Mode(true);
    
    }]);