import * as d3 from 'd3';
import { z } from '../z/z3.9';


const rubFormater = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format;

export function Doughnut(labels, values) {
    return z.relative({
        on$created(e) {
            // set the dimensions and margins of the graph
            const width = 450,
            height = 450,
            margin = 40;

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            const radius = Math.min(width, height) / 2 - margin

            // append the svg object to the div called 'my_dataviz'
            const svg = d3.select(e.target)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width/2},${height/2})`);

            // set the color scale
            const color = d3.scaleOrdinal()
            //.domain(labels)
            .range(d3.schemeDark2);

            // Compute the position of each group on the pie:
            const pie = d3.pie()
            .sort(null) // Do not sort group by size
            .value(d => d[1])
            const data_ready = pie(labels.map((l, i) => [l, values[i]]));

            // The arc generator
            const arc = d3.arc()
            .innerRadius(radius * 0.5)         // This is the size of the donut hole
            .outerRadius(radius * 0.8)

            var Tooltip = d3.select(e.target)
                .append("div")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")

            var mouseover = function(d) {
                Tooltip
                    .style("opacity", 1)
                d3.select(this)
                    .style("opacity", 1)
            }
            var mousemove = function(e, d) {
                Tooltip
                    .html(d.data[0] + "<br>" + rubFormater(d.data[1]))
                    .style("left", (d3.pointer(e)[0] + radius+70) + "px")
                    .style("top", (d3.pointer(e)[1] + radius) + "px")
            }
            var mouseleave = function(d) {
                Tooltip
                    .style("opacity", 0)
                d3.select(this)
                    .style("opacity", 0.8)
            }

            // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            svg
            .selectAll('allSlices')
            .data(data_ready)
                .join('path')
                    .attr('d', arc)
                    .attr('fill', d => color(d.data[1]))
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 0.7)
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)

            svg.selectAll("mydots")
            .data(data_ready)
            .enter()
            .append("circle")
                .attr("cx", -radius)
                .attr("cy", (d, i) => radius + i*25)
                .attr("r", 7)
                .style("fill", d => color(d.data[1]))

            // Add one dot in the legend for each name.
            svg.selectAll("mylabels")
            .data(data_ready)
            .enter()
            .append("text")
                .attr("x", -radius + 20)
                .attr("y", (d, i) => radius + i*25)
                .text(d => d.data[0])
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
    });
};

export function Hist(data, from, to) {
    return z({on$created(e) { setTimeout(_ => {
        var margin = {top: 40, right: 30, bottom: 30, left: 40},
            width = e.target.clientWidth - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleTime()
            .domain([from, to])
            .rangeRound([0, width]);
        var y = d3.scaleLinear()
            .range([height, 0]);

        // set the parameters for the histogram
        var histogram = d3.bin()
            .value(function(d) { return d.date; })
            .domain(x.domain())
            .thresholds(x.ticks(d3.timeDay));

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select(e.target).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // format the data
        data.forEach(function(d) {
            d.date = new Date(d.data_prodazhi);
            d.value = Number(d.summa_checka);
        });

        // group the data for the bars
        var bins = histogram(data);
        // Scale the range of the data in the y domain
        y.domain([0, d3.max(bins, function(d) { return d.reduce((a, b) => a + b.value, 0); })]);

        if (data.length) {
            // append the bar rectangles to the svg element
            svg.selectAll("rect")
            .data(bins)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 1)
                .attr("transform", function(d) {
                    const v = d.reduce((a, b) => a + b.value, 0);
                    return "translate(" + x(d.x0) + "," + y(v) + ")";
                })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) {
                    const v = d.reduce((a, b) => a + b.value, 0);
                    return height - y(v);
                })
                .attr("fill", '#5bb79d')
        }
        // add the x Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
        .call(d3.axisLeft(y));

    }, 10)}});
}