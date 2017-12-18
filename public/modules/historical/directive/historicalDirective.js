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
                var data = [
                    {
                        key: "Cumulative Return",
                        values: [
                            {x:"1", y:29}, {x:"2", y:70}, {x:"3", y:50}, {x:"4", y:88} ,{x:"4", y:10}]
                    }
                    ]


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
                    console.log("RESIZE");
                    chart.update();      
                });
                /*}else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
                }*/


             
            }
        }
    }
})