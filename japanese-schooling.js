
d3.csv("theme/js/posts/japanese/japanese-schooling.csv", function(error, data){
  
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  var width = 750 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
  var y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var sum = data.reduce(
           function(prev, current){
             return +(current.Schooling) + prev;
           }, 0
         );

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
      return '<strong style="color: #ffffff;">' + d.Description + ' of schooling in Japan</strong><br /><span style="color: #D6A692;">' + d.Schooling + " people (" + (d.Schooling / sum*100).toFixed(1) + "%)</span>";
    });

  svg = d3.select("#chart2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  data = data.map(function(d){
    d.Schooling = parseFloat(d.Schooling);
    
    if (d.Description != 'None')
    {
      return d;
    }
  });

  data = data.filter(function(n){ return n != undefined });

  x.domain(data.map(function(d) { return d.Description; }));
  y.domain([d3.max(data, function(d) { return d.Schooling; }), d3.min(data, function(d) { return d.Schooling; })]);

  svg.append("g")
      .attr("class", "yaxis").attr('transform', 'translate(18, 0)')
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of People");

      svg.select('.yaxis').append('text').text("Total Years' Schooling in Japan")
        .attr('transform', 'translate(250, 20)');

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr('transform', 'translate(20, 0)')
      .attr("x", function(d) { return x(d.Description); })
      .attr("width", 10)
      .attr("y", function(d) { return y(d.Schooling); })
      .attr("height", function(d) { return height - y(d.Schooling); })
      .attr("fill", "#D6A692")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});