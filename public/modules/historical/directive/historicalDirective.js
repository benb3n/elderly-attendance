angular.module('HistoricalDirective', [])

.directive('barChart', function() {
    return {
        restrict: 'EA',
        scope: {
            data: "=",
            color: "="
        },
        link: function(scope, Element, Attrs) {
            scope.$watch('data', function(data) {
                    scope.renderChart(data, "")
            },true);

            scope.renderChart = function(parsedData, color){
                console.log(parsedData)
                d3.select(Element[0]).selectAll("*").remove();

                //if(){
                var chart = nv.models.multiBarChart()
                    .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(0)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
                    .stacked(true)

                chart.xAxis.rotateLabels(-30);
                chart.yAxis.tickFormat(d3.format(',.0f'));

                d3.select(Element[0])
                    .append("svg")
                    .datum(parsedData)
                    .transition().duration(500)
                    .call(chart);

                nv.utils.windowResize(function(){

                    chart.update();
                });
                /*}else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
                }*/



            }
        }
    }
})

.directive('cumulativeLineChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
                scope.renderChart(data, "")
        },true);

        scope.renderChart = function(parsedData, color){
            console.log(parsedData)
            d3.select(Element[0]).selectAll("*").remove();

            var chart = nv.models.cumulativeLineChart()
                      .x(function(d) {return d[0] })
                      .y(function(d) { return d[1] }) //adjusting, 100% is 1.00, not 100 as it is in the data
                      .color(d3.scale.category10().range())
                      .useInteractiveGuideline(true)
                      .showControls(false)
                      ;
            //chart.xAxis
                    /*.tickValues([1025409600000,1036040400000,1041310800000,1049086800000])
                    .tickFormat(function(d) {
                        return d3.time.format('%x')(new Date(d))
                    });*/

            /*chart.yAxis
                .tickFormat(d3.format(',.1%'));*/

            d3.select(Element[0])
                .append("svg")
                .datum(parsedData)
                .transition().duration(500)
                .call(chart);

            nv.utils.windowResize(chart.update);
          }
        }
      }

})
