// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the data.csv file
// =================================
d3.csv("data/data.csv").then(function(data) {

  // Format the data
  data.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 4: Create the scales for the chart
  // =================================
  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

  // Step 5: Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 6: Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // Add y-axis
  chartGroup.append("g").call(leftAxis);

    // append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "5")
    .attr("fill", "gray");


  // Line generator for evening data
  var line2 = d3.line()
    .x(d => xTimeScale(d.date))
    .y(d => yLinearScale(d.evening));

  // Append a path for line1
  chartGroup
    .append("path")
    .attr("d", line1(donutData))
    .classed("line green", true);

  // Append a path for line2
  chartGroup
    .data([donutData])
    .append("path")
    .attr("d", line2)
    .classed("line orange", true);

}).catch(function(error) {
  console.log(error);
});

