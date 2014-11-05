

// Start here
d3.csv("theme/js/posts/japanese/japanese-occupation.csv", function(error, data){
  var data_count = 0;

var margin = {top: 20, right: 80, bottom: 30, left: 50},
    W = 750,
    H = 500,
    width = W - margin.left - margin.right,
    height = H - margin.top - margin.bottom;

var x = d3.scale.ordinal().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var dot_size = d3.scale.linear().range([2, 10]);
var color = d3.scale.ordinal().range(["#002566", "#D6A692"]);

var x_axis = d3.svg.axis().scale(x).orient("bottom");

var tip = d3.tip().attr('class', 'd3-tip').html(function(d){ 
  return '<span style="font-size: 14px;">' + d.Name + '</span><br />' + d.Count + ' people in job category <i>' 
  + d.Description + '</i><br />' + 
  'That\'s ' + (d.Count / data_count * 100).toFixed(1) + '% of all'; 
});

var y_axis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line().interpolate("cardinal")
    .x(function(d) { return x(d.Description); })
    .y(function(d) { return y(d.Count); });

var svg = d3.select("#chart1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(d3.keys(data[0]).filter(function(key){ 
    return key !== "Description"; 
  }));

  for (var i = 0; i < data.length; ++i)
  { 
    // Number of all people
    data_count += parseFloat(data[i].US);
  }

  var jobs = color.domain().map(function(name){
    return {
      name: name,
      values: data.map(function(d){
        return { Name: name, Description: d.Description, Count: parseFloat(d[name])};
      })
    };
  });

  x.domain(data.map(function (d) {
    return d.Description; 
  })).rangeRoundBands([margin.left, width], 0.05);

  y.domain([
    d3.min(jobs, function(c) { return d3.min(c.values, function(v) { return (v.Count); }); }),
    d3.max(jobs, function(c) { return d3.max(c.values, function(v) { return (v.Count); }); })
  ]);

  dot_size.domain([
    d3.min(jobs, function(c) { return d3.min(c.values, function(v) { return (v.Count); }); }),
    d3.max(jobs, function(c) { return d3.max(c.values, function(v) { return (v.Count); }); })
  ]);

  svg.append("g").attr("class", "y axis").attr("transform", "translate(20,0)").call(y_axis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of People");

  var job = svg.selectAll(".job")
      .data(jobs)
    .enter().append("g")
      .attr("class", "job");

  job.append("path").attr("class", "line").attr("d", function(d){ 
    return line(d.values); 
  }).style("stroke", function(d){ 
    return color(d.name); 
  });

  var g = svg.selectAll('g.line')
    .data(jobs) .enter().append('svg:g') .attr('class', 'line').style('fill', function(d,i){
      return color(d.name); 
    }).style('stroke', function(d,i){
      return color(d.name);
    }); 

  var dots = g.selectAll('circle') .data(function(d){ 
    return d.values; 
  }).enter().append('svg:circle').attr('class', 'dot').attr('cx', function(d){ 
    return x(d.Description); 
  }).attr('cy', function(d){ 
    return y(d.Count); 
  }).attr('r', function(d){ 
    return dot_size(d.Count);
  });

  svg.call(tip);

  var test = svg.selectAll('circle').on('mouseover', tip.show).on('mouseout', tip.hide);
  
  job.append("text").datum(function(d){ 
    return {name: d.name, value: d.values[d.values.length - 1]}; 
  }).attr("transform", function(d){ 
    return "translate(" + 0 + "," + 0 + ")"; 
  }).attr("x", width/2).attr('y', function(d, i){ 
    return i * 30;
  }).attr("dy", ".35em").text(function(d){ 
    if (d.name == 'US')
      return 'Father\'s occupation in the U.S.';
    else if (d.name == 'Abroad')
      return 'Father\'s occupation abroad'; 
  }).style("stroke", function(d){ 
    return color(d.name); 
  });
});