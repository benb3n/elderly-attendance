angular.module('appConfigurations', [])

.value('sensorReadingAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/readings/sensorreading/'
})

.value('systemMonitoringAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/readings/sysmonreading/'
})

.value('deviceAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/manifest_device/device/'
})

.value('centerAPI', {
    'url': 'https://dev-starlight.icitylab.com/api/v1/manifest_center/center/'
})

.value('starlightAPI', {
    'url': 'https://dev-starlight.icitylab.com'
})

.value('digitalOceanAPI', {
    'url': 'https://aurora.hxtan.info'
})

.value('APIToken', {
    'token': 'Token b2f2c8bd87dff8fa0fb1c2fc24b29f9c551bc21c'
})

.value('RealTimeThreshold', {
    'recent_threshold_min': '20'
})

