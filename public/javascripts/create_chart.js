/**
 * Builds the dashboard. Currently only the histogram
 * @param id - id of html element to attach to
 * @param fData - data to build dashboard from
 */
function dashboard(id, fData, varName) {

    function histogram(fData, varName){
        var hgDim={t: 60, b: 30, l: 0, r: 0};
        hgDim.w = 500 - hgDim.l - hgDim.r;
        hgDim.h = 300 - hgDim.t - hgDim.b;

        // title of histogram
        d3.select(id).append('h1')
            .html('Histogram of ' + varName);

        // create svg for histogram
        var hgSvg = d3.select(id).append('svg')
            .attr('width', hgDim.w + hgDim.l + hgDim.r)
            .attr('height', hgDim.h + hgDim.t + hgDim.b)
            .append('g')
            .attr('transform', 'translate(' + hgDim.l + ',' + hgDim.t + ')');

        // create function for x-axis mapping
        var x = d3.scaleBand().rangeRound([0, hgDim.w])
            .domain(fData.map(function(d) { return d[0]; }));

        // add x-axis to histogram
        hgSvg.append('g').attr('class', 'x axis')
            .attr('transform', 'translate(0,' + hgDim.h + ')')
            .call(d3.axisBottom(x));

        // create function for y-axis mapping
        var y = d3.scaleLinear().range([hgDim.h - 20, 0])
            .domain([0, d3.max(fData, function(d) { return d[1]; })]);

        // data join to create bar elements
        var bars = hgSvg.selectAll('.bar').data(fData).enter()
            .append('g').attr('class', 'bar');

        // create rectangles
        bars.append('rect')
            .attr('x', function(d) { return x(d[0]); })
            .attr('y', function(d) { return y(d[1]); })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return hgDim.h - y(d[1]); })
            .attr('fill', 'steelblue');

        // create frequency labels above bars
        bars.append('text').text(function(d) { return d3.format(',')(d[1]) })
            .attr('x', function(d) { return x(d[0]) + x.bandwidth()/2; })
            .attr('y', function(d) { return y(d[1]) - 5; })
            .attr('text-anchor', 'middle');
    }

    histogram(fData, varName);
}

/**
 * Updates the data in the histogram after an event.
 * @param id - id of html element to attach to
 * @param fData - data to build dashboard from
 */
function updateHistogram(id, fData, varName) {
    var hgDim={t: 60, b: 30, l: 0, r: 0};
    hgDim.w = 500 - hgDim.l - hgDim.r;
    hgDim.h = 300 - hgDim.t - hgDim.b;

    // title of histogram
    d3.select(id).select('h1')
        .html('Histogram of ' + varName);

    // select svg of histogram
    var hgSvg = d3.select(id).select('svg').select('g');

    // create function for x-axis mapping
    var x = d3.scaleBand().rangeRound([0, hgDim.w])
        .domain(fData.map(function(d) { return d[0]; }));

    // add x-axis to histogram
    hgSvg.select('g').call(d3.axisBottom(x));

    // create function for y-axis mapping
    var y = d3.scaleLinear().range([hgDim.h - 20, 0])
        .domain([0, d3.max(fData, function(d) { return d[1]; })]);

    // remove old bars
    var bars = hgSvg.selectAll('.bar').data(fData, function(d) { return d; });
    bars.exit().remove();

    // add new bars
    bars = hgSvg.selectAll('.bar').data(fData).enter()
        .append('g').attr('class', 'bar');

    // create rectangles
    bars.append('rect')
        .attr('x', function(d) { return x(d[0]); })
        .attr('y', function(d) { return y(d[1]); })
        .attr('width', x.bandwidth())
        .attr('height', function(d) { return hgDim.h - y(d[1]); })
        .attr('fill', 'steelblue');

    // create frequency labels above bars
    bars.append('text').text(function(d) { return d3.format(',')(d[1]) })
        .attr('x', function(d) { return x(d[0]) + x.bandwidth()/2; })
        .attr('y', function(d) { return y(d[1]) - 5; })
        .attr('text-anchor', 'middle');
}

// Builds initial dashboard on page load
d3.json('/api/histogram?variable=id', function(err, res) {
    fData = res.map(function(d) {return [d.id, d.freq]});
    dashboard('#dashboard', fData, 'ID');
});


/**
 * Event listeners
 */

// Histogram button event listeners
$('#graph-id').click(function() {
    d3.json('/api/histogram?variable=id', function(err, res) {
        fData = res.map(function(d) {return [d.id, d.freq]});
        updateHistogram('#dashboard', fData, 'ID');
    });
});

$('#graph-platform').click(function() {
    d3.json('/api/histogram?variable=platform', function(err, res) {
        fData = res.map(function(d) {return [d.platform, d.freq]});
        updateHistogram('#dashboard', fData, 'Platform');
    });
});

$('#graph-action').click(function() {
    d3.json('/api/histogram?variable=action', function(err, res) {
        fData = res.map(function(d) {return [d.action, d.freq]});
        updateHistogram('#dashboard', fData, 'Action');
    });
});

// datapicker event listener
$('.input-daterange').datepicker({
    format: 'yyyy-mm-dd',
    startDate: '2017-01-01',
    endDate: '2019-12-31'
});
