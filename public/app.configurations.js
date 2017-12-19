angular.module('appConfigurations', [])

.value('sensorReadingAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/readings/sensorreading/'
})
.value('systemMonitoringAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/readings/sysmonreading/'
})

