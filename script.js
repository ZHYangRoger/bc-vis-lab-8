let data;

async function loadData(url){
    let d = await d3.csv(url, d3.autoType);
    return d;
}

async function main(){
    const url = "driving.csv";
    data = await loadData(url);
    console.log(data);

    //margin
    var margin = {top: 20, right: 20, bottom: 20, left: 45};
    const width = 800 - margin.left - margin.right;
    const height = 650 - margin.top - margin.bottom;
    const svg = d3.select(".scatter-plot")
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //scales and axes
    const miles = [];
    const gas = [];
    data.forEach(a => miles.push(a.miles));
    data.forEach(a => gas.push(a.gas));
    const milesRange = d3.extent(miles);
    const gasRange = d3.extent(gas);

    const xScale = d3.scaleLinear()
                    .domain([milesRange[0], milesRange[1]]).nice()
                    .range([0, width])
    const yScale = d3.scaleLinear()
                    .domain([gasRange[1], 1.2]).nice()
                    .range([0, height])

    const xAxis = d3.axisBottom()
	                .scale(xScale);
    const yAxis = d3.axisLeft()
	                .scale(yScale)
                    .ticks(12, "$.2f");

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
                    .clone()
                    .attr("y2", -height)
                    .attr("stroke-opacity", 0.1));

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(0, ${width}`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line")
                    .clone()
                    .attr("x2", width)
                    .attr("stroke-opacity", 0.1));

    //line
    const line = d3.line()
                    .curve(d3.curveCatmullRom)
                    .x(d => xScale(d.miles))
                    .y(d => yScale(d.gas))

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    //circles and labels
    svg.selectAll("scatter-plot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.miles))
        .attr("cy", d => yScale(d.gas))
        .attr("r", 5)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", "2")

    svg.selectAll("label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.miles) + 3)
        .attr("y", d => yScale(d.gas) + 3)
        .text(d => d.year)
        .each(position)
        .call(halo)

    svg.append("text")
        .attr('x', 565)
        .attr('y', 605)
        .text("Miles per person per year")
        .attr("font-weight", "bold")

    svg.append("text")
        .attr('x', 3)
        .attr('y', 0)
        .text("Cost per gallon")
        .attr("font-weight", "bold")

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
            case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
            case "right":
            t.attr("dx", "0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "start");
            break;
            case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
            case "left":
            t.attr("dx", "-0.5em")
                .attr("dy", "0.32em")
                .attr("text-anchor", "end");
            break;
        }
    }
    function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }
}

main();