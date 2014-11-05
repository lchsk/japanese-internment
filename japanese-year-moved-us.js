
d3.csv("theme/js/posts/japanese/japanese-moved-us.csv", function(error, data){
  
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  var width = 750 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
 
  var y = d3.scale.linear().range([0, height]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

  var sum = data.reduce(
           function(prev, current){
             return +(current.Count) + prev;
           }, 0
         );

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){
      var message_header = d.Year;

      switch(message_header){
        case 'has_been': message_header = 'American born, has been in Japan'; break;
        case 'never': message_header = 'American born, never has been in Japan'; break;
        case 'unknown': message_header = 'Unknown'; break;
      }

      return '<strong style="color: #ffffff;">' + message_header + '</strong><br /><span style="color: #D6A692;">' + d.Count + " people (" + (d.Count / sum*100).toFixed(1) + "%)</span>";
    });

  svg = d3.select("#chart4")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);
  
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([d3.max(data, function(d) { return parseFloat(d.Count); }), d3.min(data, function(d) { return parseFloat(d.Count); })]);

  svg.append("g")
      .attr("class", "yaxis").attr('transform', 'translate(18, 0)')
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of People");

      svg.select('.yaxis').append('text').text("Year of First Arrival in the U.S. for Foreign Born")
        .attr('transform', 'translate(180, 20)');

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr('transform', 'translate(20, 0)')
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", 5)
      .attr("y", function(d) { return y(parseFloat(d.Count)); })
      .attr("height", function(d) { 
        if (height - y(parseFloat(d.Count)) < 1)
          return 1;
        else
          return height - y(parseFloat(d.Count)); 
      })
      .attr("fill", "#DD423E")
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
});