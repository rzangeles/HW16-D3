// Level 2 - transition plots

// Set-up the data plot dimensions

var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 90, left: 100 };

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

    // console.log(response);

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

        
    xLinearScale.domain([0, d3.max(response, function(data) {
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
        .attr("class", "statetext")
        .text(function(data, index){
            return data.Locationabbr;
        });

    chart.append("g")
        .attr("transform", "translate(0, " + height + ")")
        .attr("class", "x-axis")
        .call(bottomAxis);

    chart.append("g")
        .attr("class", "y-axis")
        .call(leftAxis);
        

    // Append y-axis labels

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 15)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText active")
        .attr("data-axis-name", "Obesity")
        .text("Obesity (%)");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 35)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .attr("data-axis-name", "Smoking")
        .text("Smoking (%)");

    chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 55)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText inactive")
        .attr("data-axis-name", "Exercise")
        .text("Exercise (%)");
        
    // Append x-axis labels
    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 25) + ")")
        .attr("class", "axis-text active")
        .attr("data-axis-name", "Native_Population")
        .text("Native US Population (%)");

    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 45) + ")")
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "Millenials")
        .text("Millenial Population (%)");

    chart.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 65) + ")")
        .attr("class", "axis-text inactive")
        .attr("data-axis-name", "Median_Income")
        .text("Median Family Income ($)");
    

    function labelChange(clickedAxis) {
        d3
            .selectAll(".axis-text")
            .filter(".active")
                .classed("active", false)
                .classed("inactive", true);
            clickedAxis.classed("inactive", false).classed("active", true);
    }

    function labelChangeY(clickedAxis) {
        d3
            .selectAll(".axisText")
            .filter(".active")
                .classed("active", false)
                .classed("inactive", true);
            clickedAxis.classed("inactive", false).classed("active", true);
    }

    function findMinAndMax(dataColumnX) {
        return d3.extent(response, function(data) {
            return +data[dataColumnX];
        });
    }
    
    // x axis click function

    d3.selectAll(".axis-text").on("click", function() {

        var clickedSelection = d3.select(this);

        var isClickedSelectionInactive = clickedSelection.classed("inactive");
 
        var clickedAxis = clickedSelection.attr("data-axis-name");
 
        console.log("current xaxis:", clickedAxis);

        if (isClickedSelectionInactive) {

            xLinearScale.domain(findMinAndMax(clickedAxis));

            svg
                .select(".x-axis")
                .transition()
                .duration(1800)
                .call(bottomAxis);

            // svg
            //     .select(".y-axis")
            //     .transition()
            //     .duration(1800)
            //     .call(leftAxis);

            d3.selectAll("circle").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("cx", function(data) {
                        return xLinearScale(+data[clickedAxis]);
                    })
                    // .attr("cy", function(data) {
                    //     return yLinearScale(+data[clickedAxis])
                    // })
                    .duration(1800);

            }); 
        
            d3.selectAll(".statetext").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("x", function(data) {
                        // console.log(data);
                        return xLinearScale(+data[clickedAxis]);
                    // .attr("y", function(data) {
                    //     return yLinearScale(+data[clickedAxis])
                    // })                    
                    })
                    .duration(1800);

            });

            labelChange(clickedSelection);
        }
    })
    
    // y axis click function

    d3.selectAll(".axisText").on("click", function() {

        var clickedSelection = d3.select(this);

        var isClickedSelectionInactive = clickedSelection.classed("inactive");
 
        var clickedAxis = clickedSelection.attr("data-axis-name");
 
        console.log("current yaxis:", clickedAxis);

        if (isClickedSelectionInactive) {

            yLinearScale.domain(findMinAndMax(clickedAxis));

            svg
                .select(".y-axis")
                .transition()
                .duration(1800)
                .call(leftAxis);

            d3.selectAll("circle").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("cy", function(data) {
                        return yLinearScale(+data[clickedAxis]);
                    })
                    // .attr("cy", function(data) {
                    //     return yLinearScale(+data[clickedAxis])
                    // })
                    .duration(1800);

            }); 
        
            d3.selectAll(".statetext").each(function() {
                d3
                    .select(this)
                    .transition()
                    .attr("y", function(data) {
                        // console.log(data);
                        return yLinearScale(+data[clickedAxis]);
                    // .attr("y", function(data) {
                    //     return yLinearScale(+data[clickedAxis])
                    // })                    
                    })
                    .duration(1800);

            });

            labelChangeY(clickedSelection);
        }
    })
    
});