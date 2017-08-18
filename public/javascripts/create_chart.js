function dashboard(id, fData) {

    function histogram(fd){
        var hg={}, hgDim={t: 60, b: 30, l: 0, r: 0};
        hgDim.w = 500 - hgDim.l - hgDim.r;
        hgDim.h = 300 - hgDim.t - hgDim.b;

        // create svg for histogram
        var hgSvg = d3.select(id).append("svg")
            .attr("width", hgDim.w + hgDim.l + hgDim.r)
            .attr("height", hgDim.h + hgDim.t + hgDim.b)
            .append("g")
            .attr("transform", "translate(" + hgDim.l + "," + hgDim.t + ")");

        // create function for x-axis mapping
        var x = d3.scaleBand().rangeRound([0, hgDim.w])
            .domain(fd.map(function(d) { return d[0]; }));

        // add x-axis to histogram
        hgSvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hgDim.h + ")")
            .call(d3.axisBottom(x));

        // create function for y-axis mapping
        var y = d3.scaleLinear().range([hgDim.h - 20, 0])
            .domain([0, d3.max(fd, function(d) { return d[1]; })]);

        var bars = hgSvg.selectAll(".bar").data(fd).enter()
            .append("g").attr("class", "bar");

        // create rectangles
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return hgDim.h - y(d[1]); })
            .attr("fill", "steelblue");

        // create frequency labels above bars
        bars.append("text").text(function(d) { return d3.format(",")(d[1]) })
            .attr("x", function(d) { return x(d[0]) + x.bandwidth()/2; })
            .attr("y", function(d) { return y(d[1]) - 5; })
            .attr("text-anchor", "middle");
    }

    var hg = histogram(fData);
}

function updateDashboard(id, fData) {
    var hg={}, hgDim={t: 60, b: 30, l: 0, r: 0};
    hgDim.w = 500 - hgDim.l - hgDim.r;
    hgDim.h = 300 - hgDim.t - hgDim.b;

    // create svg for histogram
    var hgSvg = d3.select(id).select("svg").select("g");

    // create function for x-axis mapping
    var x = d3.scaleBand().rangeRound([0, hgDim.w])
        .domain(fData.map(function(d) { return d[0]; }));

    // add x-axis to histogram
    hgSvg.select("g").call(d3.axisBottom(x));

    // create function for y-axis mapping
    var y = d3.scaleLinear().range([hgDim.h - 20, 0])
        .domain([0, d3.max(fData, function(d) { return d[1]; })]);

    // remove old bars
    var bars = hgSvg.selectAll(".bar").data(fData, function(d) { return d; });
    bars.exit().remove();

    // add new bars
    bars = hgSvg.selectAll(".bar").data(fData).enter()
        .append("g").attr("class", "bar");

    // create rectangles
    bars.append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return hgDim.h - y(d[1]); })
        .attr("fill", "steelblue");

    // create frequency labels above bars
    bars.append("text").text(function(d) { return d3.format(",")(d[1]) })
        .attr("x", function(d) { return x(d[0]) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d[1]) - 5; })
        .attr("text-anchor", "middle");
}

d3.json('/api/histogram?variable=id', function(err, res) {
    sF = res.map(function(d) {return [d.id, d.freq]});
    dashboard('#dashboard', sF);
});

// event listeners
$('#graph-id').click(function() {
    d3.json('/api/histogram?variable=id', function(err, res) {
        sF = res.map(function(d) {return [d.id, d.freq]});
        updateDashboard('#dashboard', sF);
    });
});

$('#graph-platform').click(function() {
    d3.json('/api/histogram?variable=platform', function(err, res) {
        sF = res.map(function(d) {return [d.platform, d.freq]});
        updateDashboard('#dashboard', sF);
    });
});

$('#graph-action').click(function() {
    d3.json('/api/histogram?variable=action', function(err, res) {
        sF = res.map(function(d) {return [d.action, d.freq]});
        updateDashboard('#dashboard', sF);
    });
});
