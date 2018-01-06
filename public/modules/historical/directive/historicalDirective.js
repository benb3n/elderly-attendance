angular.module('HistoricalDirective', [])

.directive('numberDisplay', function() {
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

      scope.renderChart = function(data, color){
        var numberDisplay = dc.numberDisplay(Element[0]);


      }

    }
  }
})

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
                if(typeof data != 'undefined' && data.length>0){
                  scope.renderChart(data, "");
                };
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
          if(typeof data != 'undefined' && data.length>0){
            scope.renderChart(data, "");
          };
        },true);

        scope.renderChart = function(parsedData, color){
            d3.select(Element[0]).selectAll("*").remove();

            var chart = nv.models.multiBarHorizontalChart()
                    //.height(500)
                    .x(function(d) { return d.label })
                    .y(function(d) { return d.value })
                    .margin({top: 40, right: 20, bottom: 50, left: 50})
                    .showValues(true)           //Show bar value next to each bar.
                    //.tooltips(true)             //Show tooltips on hover.
                    //.transitionDuration(350)
                    .showControls(false) //Allow user to switch between "Grouped" and "Stacked" mode.
                    .stacked(true)
                    .showLegend(false)
                    .groupSpacing(0.1)
                    .valuePadding(50);


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
})//end dir horizontalBarChart

.directive('responsiveLineChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
          if(typeof data != 'undefined' && data.length!=0 && data[0].date != null){
            scope.renderChart(data);
          }

        },true);

        scope.renderChart = function(data){
          d3.select(Element[0]).selectAll("*").remove;
            console.log("helo");
          if(data && data.length > 0){

            //Margin conventions
            var margin = {top: 20, right: 70, bottom: 40, left: 35};

            var widther = window.outerWidth;
            console.log(widther);


            var width = widther - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;


            //Parses date for correct time format
            var parseDate = d3.time.format("%Y-%m-%d");

            //Divides date for tooltip placement
            var bisectDate = d3.bisector(function(d) { return d.date; }).left;

            //Appends the svg to the chart-container div
            var svg = d3.select(Element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              //.attr("preserveAspectRatio", "xMinYMin meet")
              //.attr("viewBox", "0 0 960 500")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //Creates the xScale
            var xScale = d3.time.scale()
              .range([0, width]);

            //Creates the yScale
            var yScale = d3.scale.linear()
              .range([height, 0]);

            //Defines the y axis styles
            var yAxis = d3.svg.axis()
              .scale(yScale)
              .tickSize(-width)
              .tickPadding(8)
              .orient("left");

            //Defines the y axis styles
            var xAxis = d3.svg.axis()
              .scale(xScale)
              .tickPadding(8)
              .orient("bottom")
              .tickSize(height)
              .ticks(numTicks(width))
              .tickFormat(d3.time.format("%m/%Y"));

            //line function convention (feeds an array)
            var line = d3.svg.line()
              .x(function(d) { return xScale(d.date); })
              .y(function(d) { return yScale(d.num); });
            /*
            //Loads the data
            d3.csv("linetemplate.csv", ready);

            function ready(err, data) {

              if (err) throw "error loading data";
              console.log("hello");
              */
              //FORMAT data
              data.forEach(function(d) {
                d.num = +d.num;
                d.date = new Date(d.date);
              });

            //Appends chart headline
            //d3.select(".g-hed").text("Chart headline goes here");

            //Appends chart intro text
            //d3.select(".g-intro").text("Chart intro text goes here. Write a short sentence describing the chart here.");

            data.sort(function(a,b) { return a.date - b.date; });
            //console.log(data)

            //Defines the xScale max
            xScale.domain(d3.extent(data, function(d) { return d.date; }));

            //Defines the yScale max
            yScale.domain(d3.extent(data, function(d) { return d.num; }));

            //Appends the y axis
            var yAxisGroup = svg.append("g")
              .attr("class", "y axis")
              .call(yAxis);

            //Appends the x axis
            var xAxisGroup = svg.append("g")
              .attr("class", "x axis")
              .call(xAxis);

            //Binds the data to the line
            var drawline = svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);

            //Tooltips
            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            //Adds circle to focus point on line
            focus.append("circle")
                .attr("r", 4);

            //Adds text to focus point on line
            focus.append("text")
                .attr("x", 9)
                .attr("dy", ".35em");

            //Creates larger area for tooltip
            var overlay = svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() { focus.style("display", null); })
                .on("mouseout", function() { focus.style("display", "none"); })
                .on("mousemove", mousemove);

            //Tooltip mouseovers
            function mousemove() {
              var x0 = xScale.invert(d3.mouse(this)[0]),
                  i = bisectDate(data, x0, 1),
                  d0 = data[i - 1],
                  d1 = data[i],
                  d = x0 - d0.date > d1.date - x0 ? d1 : d0;
              focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(d.num) + ")");
              focus.select("text").text(d.num);
            }//end mouseover

            /*
            //Appends chart source
            d3.select(".g-source-bold")
              .text("SOURCE: ")
              .attr("class", "g-source-bold");

            d3.select(".g-source-reg")
              .text("Chart source info goes here")
              .attr("class", "g-source-reg");
              */

            //RESPONSIVENESS
            d3.select(window).on("resize", resized);

            resized();
            console.log("end dir");

          }else {
            d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
          }

          function resized(){
            console.log("resized");
            //new margin
            var newMargin = {top: 10, right: 80, bottom: 20, left: 100};

            //Get the width of the window
            var w = d3.select(".g-chart").node().clientWidth;
            //var w = document.getElementById("monthly_content").clientWidth;

            //console.log(Element[0].clientWidth);
            console.log("new width", w);

            //Change the width of the svg
            d3.select("svg")
              .attr("width", w);

            //Change the xScale
            xScale
              .range([0, w - newMargin.right]);

            //Update the line
            line = d3.svg.line()
              .x(function(d) { return xScale(d.date); })
              .y(function(d) { return yScale(d.num); });

            d3.selectAll('.line')
              .attr("d", line);

            //Updates xAxis
            xAxisGroup
              .call(xAxis);

            //Updates ticks
            xAxis
              .scale(xScale)
              .ticks(numTicks(w));

            //Updates yAxis
            yAxis
              .tickSize(-w - newMargin.right);
          }//end resize
        }

        //Determines number of ticks base on width
        function numTicks(widther) {
          if (widther <= 400) {
            return 3
            //console.log("return 4")
          }
          else {
            return 3
            //console.log("return 5")
          }
        }//end numticks
    }
  }
})//end dir

.directive('responsiveHorizontalBarChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
              if(typeof data != 'undefined' && data.length!=0){

              }
              scope.renderChart(data);
        },true);

        scope.renderChart = function(data){
          d3.select(Element[0]).selectAll("*").remove;
          if(data && data.length > 0){
            //Margin conventions
            var margin = {top: 10, right: 50, bottom: 20, left: 50};

            var widther = window.outerWidth;

            var width = widther - margin.left - margin.right,
                height = 250 - margin.top - margin.bottom;

            //Appends the svg to the chart-container div
            var svg = d3.select(Element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //Creates the xScale
            var xScale = d3.scale.linear()
              .range([0,width]);


            var yValues  = [];
            data.forEach(function(value){
              yValues.push(value.category);
            });

            //Creates the yScale
            var y0 = d3.scale.ordinal()
              .rangeBands([height, 0], 0.2)
              //.domain(["Cat5", "Cat4", "Cat3", "Cat2", "Cat1"]);
              .domain(yValues);

            //Defines the y axis styles
            var yAxis = d3.svg.axis()
              .scale(y0)
              .orient("left");

            //Defines the y axis styles
            var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .tickFormat(function(d) {return d + "%"; })
              .tickSize(height)
              .ticks(numTicks(width));

            //Appends chart headline
            //d3.select(".g-hed").text("Chart headline goes here");

            //Appends chart intro text
            //d3.select(".g-intro").text("Chart intro text goes here. Write a short sentence describing the chart here.");

            //Sets the max for the xScale
            var maxX = d3.max(data, function(d) { return d.num; });

            //Defines the xScale max
            xScale.domain([0, maxX ]);

            //Appends the y axis
            var yAxisGroup = svg.append("g")
              .attr("class", "y axis")
              .call(yAxis);

            //Appends the x axis
            var xAxisGroup = svg.append("g")
              .attr("class", "x axis")
              .call(xAxis);

            //Binds the data to the bars
            var categoryGroup = svg.selectAll(".g-category-group")
              .data(data)
              .enter()
              .append("g")
              .attr("class", "g-category-group")
              .attr("transform", function(d) {
                return "translate(0," + y0(d.category) + ")";
              });

            //Appends first bar
            var bars = categoryGroup.append("rect")
              .attr("width", function(d) { return xScale(d.num); })
              .attr("height", y0.rangeBand()/1.5 )
              .attr("class", "g-num")
              .attr("transform", "translate(0,4)");

            //Binds data to labels
            var labelGroup = svg.selectAll("g-num")
              .data(data)
              .enter()
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //Creates the xScale
            var xScale = d3.scale.linear()
              .range([0,width]);


            var yValues  = [];
            data.forEach(function(value){
              yValues.push(value.category);
            });

            //Creates the yScale
            var y0 = d3.scale.ordinal()
              .rangeBands([height, 0], 0.2)
              //.domain(["Cat5", "Cat4", "Cat3", "Cat2", "Cat1"]);
              .domain(yValues);

            //Defines the y axis styles
            var yAxis = d3.svg.axis()
              .scale(y0)
              .orient("left");

            //Defines the y axis styles
            var xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom")
              .tickFormat(function(d) {return d + "%"; })
              .tickSize(height)
              .ticks(numTicks(width));

              //Appends chart headline
              //d3.select(".g-hed").text("Chart headline goes here");

              //Appends chart intro text
              //d3.select(".g-intro").text("Chart intro text goes here. Write a short sentence describing the chart here.");

              //Sets the max for the xScale
              var maxX = d3.max(data, function(d) { return d.num; });

              //Defines the xScale max
              xScale.domain([0, maxX ]);

              //Appends the y axis
              var yAxisGroup = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

              //Appends the x axis
              var xAxisGroup = svg.append("g")
                .attr("class", "x axis")
                .call(xAxis);

              //Binds the data to the bars
              var categoryGroup = svg.selectAll(".g-category-group")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "g-category-group")
                .attr("transform", function(d) {
                  return "translate(0," + y0(d.category) + ")";
                });

              //Appends first bar
              var bars = categoryGroup.append("rect")
                .attr("width", function(d) { return xScale(d.num); })
                .attr("height", y0.rangeBand()/1.5 )
                .attr("class", "g-num")
                .attr("transform", "translate(0,4)");

              //Binds data to labels
              var labelGroup = svg.selectAll("g-num")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "g-label-group")
                .attr("transform", function(d) {
                  return "translate(0," + y0(d.category) + ")";
                });

              //Appends labels
              var barLabels = labelGroup.append("text")
                .text(function(d) {return  d.num;})
                .attr("x", function(d) { return xScale(d.num) - 20; })
                .attr("y", y0.rangeBand()/1.7 )
                .attr("class", "g-labels");

              //Appends chart source
              d3.select(".g-source-bold")
                .text("SOURCE: ")
                .attr("class", "g-source-bold");

              d3.select(".g-source-reg")
                .text("Chart source info goes here")
                .attr("class", "g-source-reg");


              //RESPONSIVENESS
              d3.select(window).on("resize", resized);
              resized();
            }else {
              d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
            }

            function resized() {

              //new margin
              var newMargin = {top: 10, right: 80, bottom: 20, left: 100};

              //Get the width of the window
              var w = d3.select(".g-chart").node().clientWidth-10;

              //Change the width of the svg
              d3.select("svg")
                .attr("width", w);

            //Updates ticks
            xAxis
              .scale(xScale)
              .ticks(numTicks(w));
          };//end resize
        }
        //Determines number of ticks base on width
        function numTicks(widther) {
          if (widther <= 400) {
            return 4
          }
          else {
            return 10
          }
        }//end numticks

      }

  }
})//end responsiveHorizontalBarChart

.directive('dayHourHeatmapChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
            if(typeof data != 'undefined' && data.length!=0){

            }
            scope.heatmapChart(data);
        },true);


        scope.heatmapChart =  function(data) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 40, right: 0, bottom: 50, left: 30 },
              width = screen.width - margin.left - margin.right,
              gridSize = Math.floor(width / 29),
              height = gridSize*7 + margin.top + margin.bottom,
              legendElementWidth = gridSize*2,
              buckets = 9,
              colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am", "", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm", "", "7pm", "","8pm"];
              /*times = ["8am", "", "9am", "", "10am", "10:30am", "11am", "11:30am", "12pm", "12:30pm", "1pm", "1:30pm", "2pm", "2:30pm", "3pm", "3:30pm", "4pm", "4:30p", "5pm", "5:30pm", "6pm", "6:30pm", "7pm", "7:30pm","8pm"];*/
            var svg = d3.select(Element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dayLabels = svg.selectAll(".dayLabel")
              .data(days)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = svg.selectAll(".timeLabel")
              .data(times)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .style("font-size",'10px')
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

              var colorScale = d3.scale.quantile()
                  .domain([0, buckets - 1, d3.max(data, function (d) {
                    return d.value; })])
                  .range(colors);



              var cards = svg.selectAll(".hour")
                  .data(data, function(d) {return d.day+':'+d.hour;});

              cards.append("title");

              cards.enter().append("rect")
                  .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                  .attr("y", function(d) { return (d.day - 1) * gridSize; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("color", colors[0]);

              cards.transition().duration(1000)
                  .style("fill", function(d) { return colorScale(d.value); });

              cards.enter().append("text")
                .attr("x", function(d) { return (d.hour - 1) * gridSize + (gridSize/3); })
                .attr("y", function(d) { return (d.day - 1) * gridSize + (gridSize/1.6); })
                .attr("rx", 4)
                .attr("ry", 4)
                .text(function(d) { return d.value; })
                .style("fill",'#CBC8B4')
                .style("font-weight",'bold');

              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  .data([0].concat(colorScale.quantiles()), function(d) { return d; });

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

              legend.exit().remove();
            }else {
              d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
            }
        };
    }
  }
})//end dayHourHeatmapChart

.directive('flipDayHourHeatmapChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
          if(typeof data != 'undefined' && data.length!=0){

          }
          scope.heatmapChart(data);
        },true);


        scope.heatmapChart =  function(data) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 50, right: 40, bottom: 24, left: 50 },
              hMargin = 15,
              buckets = 9,
              colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am","", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm", "", "7pm", "","8pm"],
              /*times = ["8am", "8:30am", "9am", "9:30am", "10am", "10:30am", "11am", "11:30am", "12pm", "12:30pm", "1pm", "1:30pm", "2pm", "2:30pm", "3pm", "3:30pm", "4pm", "4:30p", "5pm", "5:30pm", "6pm", "6:30pm", "7pm", "7:30pm","8pm"],*/
              width = screen.width - margin.left - margin.right -72,
              gridSize = Math.floor(width / 7),
              legendElementWidth = gridSize,
              height = gridSize*times.length;

            var svg = d3.select(Element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dayLabels = svg.selectAll(".dayLabel")
              .data(times)
              .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize + hMargin; })
                .style("text-anchor", "end")
                .style("font-size",'13px')
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var timeLabels = svg.selectAll(".timeLabel")
              .data(days)
              .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", hMargin)
                .style("text-anchor", "middle")
                //.style("font-size",'10px')
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

              var colorScale = d3.scale.quantile()
                  .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
                  .range(colors);

              var cards = svg.selectAll(".hour")
                  .data(data, function(d) {return d.day+':'+d.hour;});

              cards.append("title");

              cards.enter().append("rect")
                  .attr("y", function(d) { return (d.hour - 1) * gridSize + hMargin; })
                  .attr("x", function(d) { return (d.day - 1) * gridSize; })
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("class", "hour bordered")
                  .attr("width", gridSize)
                  .attr("height", gridSize)
                  .style("color", colors[0]);

              cards.transition().duration(1000)
                  .style("fill", function(d) { return colorScale(d.value); });

              cards.enter().append("text")
                .attr("y", function(d) { return (d.hour - 1) * gridSize + (gridSize/1.5) + hMargin; })
                .attr("x", function(d) { return (d.day - 1) * gridSize + gridSize/3.1 ;})
                .attr("rx", 4)
                .attr("ry", 4)
                .text(function(d) { return d.value; })
                .style("fill",'#CBC8B4')
                .style("font-weight",'bold');

              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  .data([0].concat(colorScale.quantiles()), function(d) { return d; });

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i -50; })
                .attr("y", -50)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i -50; })
                .attr("y", -50 + gridSize);

              legend.exit().remove();
          }else {
            d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
          }
      };
    }
  }
})//end dayHourHeatmapChart
