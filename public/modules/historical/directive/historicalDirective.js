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

.directive('lineChart',function(){
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
            d3.select(Element[0]).selectAll("*").remove();

            var chart = nv.models.lineChart()
                //.margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                //.transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
          ;
          /*
          chart.xAxis     //Chart x-axis settings
            .axisLabel('Time (ms)')
            .tickFormat(d3.format(',r'));

          chart.yAxis     //Chart y-axis settings
            .axisLabel('Voltage (v)')
            .tickFormat(d3.format('.02f'));
          */

            d3.select(Element[0])
                .append("svg")
                .datum(parsedData)
                .call(chart);

            nv.utils.windowResize(chart.update);
          }
        }
      }

})
/*
.directive('crD3Bars', [
  function() {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element) {

        function getDate(d) {
          var dt = new Date(d.date);
          dt.setHours(0);
          dt.setMinutes(0);
          dt.setSeconds(0);
          dt.setMilliseconds(0);
          return dt;
        }

        function showData(obj, d) {
          var coord = d3.mouse(obj);
          var infobox = d3.select(".infobox");
          // now we just position the infobox roughly where our mouse is
          infobox.style("left", (coord[0] + 100) + "px");
          infobox.style("top", (coord[1] - 175) + "px");
          $(".infobox").html(d);
          $(".infobox").show();
        }

        function hideData() {
          $(".infobox").hide();
        }

        var drawChart = function(data) {

          // define dimensions of graph
          var m = [50,50,50,50]; // margins
          var w = 400 - m[1] - m[3]; // width
          var h = 200 - m[0] - m[2]; // height


          console.log(data);
          data.sort(function(a, b) {
            var d1 = getDate(a);
            var d2 = getDate(b);
            if (d1 == d2) return 0;
            if (d1 > d2) return 1;
            return -1;
          });

          var minDate = getDate(data[0]),
            maxDate = getDate(data[data.length - 1]);

          var x = d3.time.scale().domain([minDate, maxDate]).range([0, w]);
          var y = d3.scale.linear().domain([0, d3.max(data, function(d) {
            return d.trendingValue;
          })]).range([h, 0]);


          var line = d3.svg.line()
            .x(function(d, i) {
              return x(getDate(d)); //x(i);
            })
            .y(function(d) {
              return y(d.trendingValue);
            });

          function xx(e) {
            return x(getDate(e));
          }

          function yy(e) {
            return y(e.trendingValue);
          }

          var graph = d3.select(element[0]).append("svg:svg")
            .attr("width", w + m[1] + m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");


          var xAxis = d3.svg.axis().scale(x).ticks(d3.time.months, 1).tickSize(-h).tickSubdivide(true);

          var yAxisLeft = d3.svg.axis().scale(y).ticks(10).orient("left"); //.tickFormat(formalLabel);

          graph
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("fill", "steelblue")
            .attr("r", 5)
            .attr("cx", xx)
            .attr("cy", yy)
            .on("mouseover", function(d) {
              showData(this, d.trendingValue);
            })
            .on("mouseout", function() {
              hideData();
            });

          graph.append("svg:path").attr("d", line(data));

          $("#graphDiv3").append("<div class='infobox' style='display:none;'>Test</div>");
        };

        drawChart(scope.data);
      }
    };
  }
])
.directive('horizontalStackedBarChart', function(){
    return {
        restrict: 'E',
        scope: {
            options: '='
        },
        template: '<div id="chart"></div>',
        link: function ($scope) {
            function parseData(params) {
                var parsedArr = [];

                // If the data is an object, convert it to an array
                if (_.isObject(params.data)) {
                    params.data = _.values(params.data);
                }

                // If the yAxis param is a string, convert it to an array
                if (_.isString(params.yAxis)) {
                    params.yAxis = [params.yAxis];
                }

                _.each(params.data, function (d) {
                    var parsed = {};
                    parsed.total = 0;
                    parsed.types = [];
                    _.each(params.yAxis, function (cat) {
                        parsed[cat] = d[cat];
                        parsed.types.push(parsed[cat]);
                        parsed.total += d[cat];
                    });
                    parsed[params.xAxis] = d[params.xAxis];
                    parsedArr.push(parsed);
                });
                _.each(parsedArr, function (d) {
                    var y0 = 0;
                    d.types = params.yAxis.map(function (type) {
                        var bar = {
                            y0: y0,
                            y1: y0 += +d[type]
                        };
                        bar[params.xAxis] = type;
                        return bar;
                    });
                    d.total = _.last(d.types).y1;
                });
                return _.sortBy(parsedArr, function (d) {
                    return d[params.sortBy];
                });
            }

            var chart;

            chart = {
                data: parseData($scope.options),
                width: $scope.options.width || 350,
                height: $scope.options.height || 350,
                gutter: $scope.options.gutter || 5
            };
        }
    };
})
*/

.directive('horizontalBarChart',function(){
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
            d3.select(Element[0]).selectAll("*").remove();

            var chart = nv.models.multiBarHorizontalChart()
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    //.margin({top: 30, right: 20, bottom: 50, left: 175})
                    .showValues(true)           //Show bar value next to each bar.
                    //.tooltips(true)             //Show tooltips on hover.
                    //.transitionDuration(350)
                    .showControls(false) //Allow user to switch between "Grouped" and "Stacked" mode.
                    .stacked(true)
                    .groupSpacing(0)
                    .valuePadding(10);
                    //.height(400);


            d3.select(Element[0])
                .append("svg")
                .datum(parsedData)
                .call(chart);

            chart.xAxis
              .tickFormat(d3.format(',.2f'));

            nv.utils.windowResize(chart.update);
          }
        }
      }



})
