angular.module('HistoricalDirective', [])

/*.directive('textDisplay',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "=",
        axis: "="
    },
    link: function(scope, Element, Attrs) {
      scope.$watch('data', function(data) {
        if(typeof data != 'undefined'){
          var parsedData = data
        }

        scope.renderChart(parsedData, scope.axis);
      },true);

      scope.renderChart = function(data){
        var format = d3.format(".0f");
        if(typeof data != 'undefined'){
          d3.select(Element[0])
          .transition().duration(2000).delay(0)
          .tween("text", function(d) {
            var i = d3.interpolate(0, data);
            return function(t) {
              if(isNaN(data)){
                d3.select(Element[0]).text( (i(t)) );
              }else{
                d3.select(Element[0]).text( format(i(t)) );
              }
            };
          });

        }
      }

    }
  }
})*/

.directive('barHorizontalChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "=",
        axis: "="
    },
    link: function(scope, Element, Attrs) {
      scope.$watch('data', function(data) {
        if(typeof data != 'undefined' && data.length!=0 ){
          var parsedData = data
        }

        scope.renderChart(parsedData, scope.axis);
      },true);

      scope.renderChart = function(data, axis_device_id){
        d3.select(Element[0]).selectAll("*").remove();

        if(data && data.length > 0){
          var chart = c3.generate({
            bindto: Element[0],
            data: {
              columns: [data],
              types: {
                'Hours': 'bar',
                'Unique Visit': 'bar',
                activities: 'bar'
              }
            },
            padding: {
              left: 100,
              right: 15
            },
            axis: {
              x: {
                  type: 'category',
                  categories: axis_device_id,
                  width:10
              },
              y: {
                tick: {
                    count :  4,
                    format: d3.format('.2f')
                }
              },
              rotated:true
            },
            legend:{
              show:false
            },
            transition: {
              duration: 500
            },
            tooltip: {
              position: function (data, width, height, element) {
                var top = d3.mouse(element)[1] - (element.width.baseVal.value + 30)
                return {top: top, left: parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width'))}
              }
            }
          });

          d3.select(window).on("resize", resized);

        }else {
          d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
        }

        function resized(){
            chart.flush();
            //chart.resize();
        }


      }
    }
  }
})//end dir barHorizontalChart

.directive('weeklyLineChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
      scope.$watch('data', function(data) {
        if(typeof data != 'undefined' && data.length!=0 ){

          /*SAMPLE DATA FORMAT
          var parsedData = [
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 50, 20, 10, 40, 15, 25]
          ]*/
          var parsedData = data

        }

        scope.renderChart(parsedData);
      },true);

      scope.renderChart = function(data){
        d3.select(Element[0]).selectAll("*").remove();
        var w = (document.documentElement.clientWidth <= 640) ? (document.documentElement.clientWidth-100) : (document.documentElement.clientWidth <= 906) ? (document.documentElement.clientWidth - 200) / 2 : (document.documentElement.clientWidth - 200) / 3;

        if(data && data.length > 0){

          console.log(document.getElementById('activity_content').style)
          var chart = c3.generate({
            bindto: Element[0],
            data: {
                columns: data
            },
            size: {
              width: w
            },
            padding: {
              left: 20
            },
            axis: {
              x: {
                  type: 'category',
                  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  tick: {fit: true}
              }
            },
            legend:{
              show:true
            },
            tooltip: {
              position: function (data, width, height, element) {
                var top = d3.mouse(element)[1] - element.height.baseVal.value
                return {top: top, left: parseInt(element.getAttribute('x')) + parseInt(element.getAttribute('width'))}
              }
            }

          });
          d3.select(window).on("resize", resized);

        }else {
          d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
        }

        function resized(){
            chart.flush();
            chart.resize();

        }


      }
    }
  }
})//end dir weeklyLineChart

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
            var parseData = data
            console.log(parseData);
          }
          scope.renderChart(parseData);
        },true);

        scope.renderChart = function(data){
          d3.select(Element[0]).selectAll("*").remove();

          if(data && data.length > 0){

            //Margin conventions
            var margin = {top: 20, right: 70, bottom: 50, left: 35};
            //var widther = window.outerWidth;
            var widther = (document.documentElement.clientWidth <= 640) ? (document.documentElement.clientWidth-100) : (document.documentElement.clientWidth <= 906) ? (document.documentElement.clientWidth - 200) / 2 : (document.documentElement.clientWidth - 200) / 3;
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
              .tickPadding(2)
              .ticks(numTicks(width))
              .orient("left")
              //help: maybe the data is stored as a doube instead of the integers i pass in,resulting in .5 values
              //https://github.com/danielgindi/Charts/issues/315
              .tickFormat(d3.format(".0f"));

            //Defines the x axis styles
            var xAxis = d3.svg.axis()
              .scale(xScale)
              .tickPadding(8)
              .orient("bottom")
              .tickSize(height)
              .ticks(numTicks(data.length))
              .tickFormat(d3.time.format("%b %Y"));
              //help: prevent duplicate ticks
              //.tickFormat(d3.time.format("%d %b"));

            //line function convention (feeds an array)
            var line = d3.svg.line()
              .x(function(d) { return xScale(d.date); })
              .y(function(d) { return yScale(d.num); });

            //FORMAT data
            data.forEach(function(d) {
              //d.num = parseInt(d.num);
              d.num = +d.num;
              d.date = new Date(d.date);
            });

            //Appends chart headline
            //d3.select(".g-hed").text("Chart headline goes here");

            //Appends chart intro text
            //d3.select(".g-intro").text("Chart intro text goes here. Write a short sentence describing the chart here.");

            //data.sort(function(a,b) { return a.date - b.date; });

            //Defines the xScale max and min
            xScale.domain(d3.extent(data, function(d) {
              return d.date;
            }));

            var yscalemax = d3.extent(data, function(d) { return d.num; })[1];
            //Defines the yScale max
            //yScale.domain(d3.extent(data, function(d) { return d.num; }));
            yScale.domain([0, yscalemax]);

            //Appends the y axis
            var yAxisGroup = svg.append("g")
              .attr("class", "y axis")
              .attr("transform", "translate(0, 0)")
              .call(yAxis);

            //Appends the x axis
            var xAxisGroup = svg.append("g")
              .attr("class", "x axis")
              //.attr("transform", "translate(50, 0)")
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
            //help: dont need to specify cx,cy(relative positions) cause you move them later?in mouseover
            focus.append("circle")
                .attr("r", 4);

            //Adds text to focus point on line
            focus.append("text")
                //help: this dosent work, why?
                //.text(function (d) {return d.num;})
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
                  d1 = data[i];
                  var d;
                  if (typeof d1 == "undefined"){
                    d = d0;
                  }else{
                    d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                  }
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
              var num_months = data.length;
            //RESPONSIVENESS
            d3.select(window).on("resize", resized);
            resized();resized();
          }else {
            d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
          }

          function resized(){

            //new margin
            var newMargin = {top: 20, right: 70, bottom: 110, left: 35};

            //Get the width of the window
            var w = d3.select(".g-chart").node().clientWidth;

            //console.log("Responsive line chart resized: new width", w);

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
              .ticks(numTicks(num_months));

              xAxisGroup
                .selectAll("text")
                 .attr("y","135")
                 .attr("x","-325")
                 .attr("transform", "rotate(-65)");

            //Updates yAxis
            yAxis
              .tickSize(-w - newMargin.right);
          }//end resize
        }

        //Determines number of ticks base on width
        function numTicks(num_months) {
          if (num_months > 5) {
            return 5
          }
          else {
            return num_months
          }
        }//end numticks
    }
  }
})//end dir responsiveLineChart

/*
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
                }else {
                    d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
                }



            }
        }
    }
})

*/
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

})//end dir

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
            scope.heatmapChart(data);
        },true);

        scope.heatmapChart =  function(data) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 40, right: 0, bottom: 30, left: 30 },
              width = screen.width - margin.left - margin.right -30,
              gridSize = Math.floor(width / 23),
              height = (gridSize*7) + margin.top + margin.bottom,
              legendElementWidth = gridSize*2,
              rangeDomain = [1,3,6,9,15],
              displayRangeDomain = [0,1,3,6,9],
              colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4"],//,"#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am", "", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm"];
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
                //.style("font-size",'10px')
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

              var colorScale = d3.scale.threshold()
                   .domain(rangeDomain)
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
                .attr("x", function(d) { return (d.hour - 1) * gridSize + (gridSize/2.8); })
                .attr("y", function(d) { return (d.day - 1) * gridSize + (gridSize/1.5); })//height
                //.attr("rx", 4)
                //.attr("ry", 4)
                .text(function(d) { return d.value; })
                .style("fill",'#000000')
                //.style("fill",'#CBC8B4')
                .style("font-weight",'bold');

              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  //.data([0].concat(colorScale.quantiles()), function(d) { return d; });
                  .data(displayRangeDomain);

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height-margin.bottom)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / (2))
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize - margin.bottom);
                //.attr("y", height + (gridSize / (2.5)) - margin.bottom);

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
          scope.heatmapChart(data);
        },true);

        scope.heatmapChart =  function(data) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 50, right: 30, bottom: 24, left: 40 },
              hMargin = 30,
              rangeDomain = [1,3,6,9,15],
              displayRangeDomain = [0,1,3,6,9],
              colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4"],//,"#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am","", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm"],
              width = screen.width - margin.left - margin.right -72,
              gridSize = Math.floor(width / 7),
              legendElementWidth = width / rangeDomain.length,
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

              var colorScale = d3.scale.threshold()
                  .domain(rangeDomain)
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
                //.text(function(d) { return d.value; })
                .text(function(d) {return(d.value ==0) ? null : d.value ;})
                .style("fill",'#000000')
                .style("font-weight",'bold');

              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  .data(displayRangeDomain);

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i -50; })
                .attr("y", -35)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i -50; })
                .attr("y", -35 + gridSize);

              legend.exit().remove();
          }else {
            d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
          }
      };
    }
  }
})//end dayHourHeatmapChart

.directive('boxHeatmapChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
            scope.heatmapChart(data);
        },true);

        scope.heatmapChart =  function(data) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 40, right: 0, bottom: 30, left: 30 },
              width = screen.width - margin.left - margin.right -30,
              gridSize = Math.floor(width / 23),
              height = (gridSize*7) + margin.top + margin.bottom,
              legendElementWidth = gridSize*2,
              rangeDomain = [1,3,6,9,15],
              displayRangeDomain = [0,1,3,6,9],
              colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4"],//,"#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am", "", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm"];
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
                //.style("font-size",'10px')
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

              var colorScale = d3.scale.threshold()
                   .domain(rangeDomain)
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
                .attr("x", function(d) { return (d.hour - 1) * gridSize + (gridSize/2.8); })
                .attr("y", function(d) { return (d.day - 1) * gridSize + (gridSize/1.5); })//height
                //.attr("rx", 4)
                //.attr("ry", 4)
                .text(function(d) { return(d.value==0)? null:d.value ; })
                .style("fill",'#000000')
                //.style("fill",'#CBC8B4')
                .style("font-weight",'bold');

              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  //.data([0].concat(colorScale.quantiles()), function(d) { return d; });
                  .data(displayRangeDomain);

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height-margin.bottom -30)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / (2))
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize - margin.bottom -30);
                //.attr("y", height + (gridSize / (2.5)) - margin.bottom);

              legend.exit().remove();
            }else {
              d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
            }
        };
    }
  }
})//end dayHourHeatmapChart

.directive('residentBoxHeatmapChart',function(){
  return {
    restrict: 'EA',
    scope: {
        data: "=",
        color: "=",
        datelist: "="
    },
    link: function(scope, Element, Attrs) {
        scope.$watch('data', function(data) {
            console.log(data);
            scope.heatmapChart(data,scope.datelist);
        },true);

        scope.heatmapChart =  function(data, date_list) {
          d3.select(Element[0]).selectAll("*").remove();
          if(data && data.length > 0){
            var margin = { top: 40, right: 0, bottom: 30, left: 80 },
              width = screen.width - margin.left - margin.right -30,
              gridSize = Math.floor(width / 25),
              height = (gridSize*(data.length/22)) + margin.top + margin.bottom,
              legendElementWidth = gridSize*2,
              legend_text = ["Absent","Present"],
              index = [0,1],
              colors = ["#ffffd9","#edf8b1"],
              //rangeDomain = [1,5,10,15,25],
              //displayRangeDomain = [0,1,5,10,15],
              //colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4"],//,"#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
              //days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
              times = ["8am", "", "9am", "", "10am", "", "11am", "", "12pm", "", "1pm", "", "2pm", "", "3pm", "", "4pm", "", "5pm", "", "6pm"];

            var svg = d3.select(Element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var dayLabels = svg.selectAll(".dayLabel")
              .data(date_list)
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
                //.style("font-size",'10px')
                .attr("transform", "translate(" + gridSize / 2 + ", -6)")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

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
                  .style("fill", function(d) { return ((d.value==0)? colors[0]:colors[1]); });

              /*cards.enter().append("text")
                .attr("x", function(d) { return (d.hour - 1) * gridSize + (gridSize/2.8); })
                .attr("y", function(d) { return (d.day - 1) * gridSize + (gridSize/1.5); })//height
                //.attr("rx", 4)
                //.attr("ry", 4)
                .text(function(d) { return(d.value==0)? null:d.value ; })
                .style("fill",'#000000')
                //.style("fill",'#CBC8B4')
                .style("font-weight",'bold');
                */
              cards.select("title").text(function(d) { return d.value; });

              cards.exit().remove();

              var legend = svg.selectAll(".legend")
                  //.data([0].concat(colorScale.quantiles()), function(d) { return d; });
                  .data(index);

              legend.enter().append("g")
                  .attr("class", "legend");

              legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height-margin.bottom)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / (2))
                .style("fill", function(d, i) { return colors[i]; })

              legend.append("text")
                .attr("class", "mono")
                .text(function(d,i) { return legend_text[i]; })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize - margin.bottom);
                //.attr("y", height + (gridSize / (2.5)) - margin.bottom);

              legend.exit().remove();
            }else {
              d3.select(Element[0]).html('<div style="text-align: center; line-height: 115px;"><span style="font-size: 18px;font-weight: 700;">No Data Available.</span></div>');
            }
        };
    }
  }
})//end dayHourHeatmapChart
