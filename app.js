// Set-up the data plot dimensions

var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");

d3.csv("data/data.csv", function(error, response) {

    if(error) {

        throw error;
    }

    // collect the data for each variable

    console.log(response);

    response.forEach(function(data){

        // console.log(data.Obesity);
        // console.log(data.Native_Population);
        data.Obesity = +data.Obesity;
        data.Native_Population = +data.Native_Population;
 
    });  

    // Create scale functions

    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Scale the domain

        
    xLinearScale.domain([70, d3.max(response, function(data) {
            return +data.Native_Population;
        })]);
    yLinearScale.domain([10, d3.max(response, function(data) {
            return +data.Obesity;
        })]);

    // Tool tip info to be provided later

    // Add the circles

    chart.selectAll("circle")
        .data(response)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {

                return xLinearScale(data.Native_Population);

        })
        .attr("cy", function(data, index) {

                return yLinearScale(data.Obesity);

        })
        .attr("r", "15")
        .attr("fill", "lightblue")

    // Add text to each circle

    chart.selectAll("text")
        .data(response)
        .enter()
        .append("text")
        .attr("x", function(data, index) {

                return xLinearScale(data.Native_Population);

        })
        .attr("y", function(data, index) {

                return yLinearScale(data.Obesity);

        })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .text(function(data, index){
            return data.Locationabbr;
        });

    chart.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(bottomAxis);

    chart.append("g")
        .call(leftAxis);

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obesity (%)");
        
    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axisText")
        .text("Native US Population (%)");

});