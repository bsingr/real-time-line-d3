function RealTimeLine(dataProvider, config){
  var resolution = config.resolution,
    zeroData = d3.random.normal(0, 0),
    data = d3.range(resolution+2).map(zeroData);
    margin = config.margin,
    width = config.width,
    height = config.height,
    tickSpeed = config.tickSpeed;

  if (!margin) {
    margin = {top: 20, right: 20, bottom: 20, left: 40};
  }

  if (!width) {
    width = 960;
  }

  if (!height) {
    height = 100;
  }

  if (!tickSpeed) {
    tickSpeed = 500;
  }

  var innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain([0, resolution - 1])
      .range([0, innerWidth]);

  var y = d3.scale.linear()
      .domain([0, 1])
      .range([innerHeight, 0]);

  var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

  var path = svg.append("g")
      .attr("clip-path", "url(#clip)")
    .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  var realTimeLine = this;
  this.tick = function () {

    // push a new data point onto the back
    var nextValue = dataProvider.shift();
    if (!nextValue) {
      nextValue = 0;
    }
    data.splice(data.length - 1, 0, nextValue);

    // redraw the line, and slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(tickSpeed)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ",0)")
        .each("end", function(){
          realTimeLine.tick();
        });

    // pop the old data point off the front
    data.shift();
  }
}
